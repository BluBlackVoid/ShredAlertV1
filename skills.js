function skillSet01(player) { //assigns skills to players
  player.skills.push(new Blink())
  player.skills.push(new LungingCuff())
  player.skills.push(new SkullShatter())
  player.skills.push(new ScatterShot())
}

class Blink { //short movementspeed boost
  constructor() {
    this.charges = 1
    this.timer = millis()
    this.statChange
    this.duration
    this.cooldown = 5000
    this.img = iconImages[0]
  }
  activate(player) {
    if (this.charges > 0) {
      this.charges--
      this.statChange = player.moveSpeed * 2
      player.moveSpeed = player.moveSpeed * 3
      player.invuln = millis() + 250
      this.duration = millis() + 100
    }
  }
  check(player) {
    if (this.duration <= millis()) { //ensure movespeed is reset properly
      player.moveSpeed -= this.statChange
      if (player.moveSpeed < 5) {
        player.moveSpeed = 5
      }
    }
    if (this.timer <= millis() && this.charges < 2) {
      this.charges++
      this.timer = millis() + this.cooldown
    }
  }
}

class LungingCuff { //move towards mouse, damaging and stunning all enemies
  constructor() {
    this.charges = 1
    this.timer = millis()
    this.duration
    this.dy
    this.dx
    this.cooldown = 10000
    this.img = iconImages[1]
  }
  activate(player) {
    if (this.charges > 0) {
      player.inputLocked = true
      player.invuln = millis() + 1000
      this.timer = millis() + this.cooldown
      this.duration = millis() + 500
      let shotDirection = shotAngleCalc(player.x, player.y)
      this.dy = Math.sin(shotDirection[0]) * player.moveSpeed * 2 * shotDirection[1]
      this.dx = Math.cos(shotDirection[0]) * player.moveSpeed * 2 * shotDirection[1]
      this.charges--
    }
  }
  check(player) {
    if (this.duration >= millis()) {
      player.dy = this.dy
      player.dx = this.dx
      for (e in enemies) { //stunning and hurting part
        if (collideRectCircle(enemies[e].x, enemies[e].y, enemies[e].w, enemies[e].l, player.x, player.y, player.h * 1.25)) { //applies following effects to any enemy within a certain radius
          enemies[e].hurtMe(player.atk * 1.75, player)
          enemies[e].stunMe(2000, player.dx, player.dy)
          enemies[e].invulnEndTime = this.duration //prevents enemy from being hurt multiple times by skill
        }
      }
      let tempNewX = player.x + player.dx
      let tempNewY = player.y + player.dy
      if (tempNewX > 0 && tempNewX < (currentmap[0].length) * layoutCellSize - 18.5 && tempNewY > 0 && player.y < (currentmap.length) * layoutCellSize - 23) {//check if next move is within map
        let colliding = collideCheck(player.x, player.y, player.w, player.h)
        if (colliding[0] == true) { //end skill if hit wall
          player.dx = -player.dx
          player.dy = -player.dy
          this.duration = millis() - 1
        }
      }
      else { //end skill if player is about to leave map
        player.dx = -player.dx
        player.dy = -player.dy
        this.duration = millis() - 1
      }
    }

    if (this.duration < millis()) { //end skill
      player.inputLocked = false
    }

    if (this.charges < 1 && this.timer <= millis()) {
      this.charges++
    }
  }
}

class SkullShatter { //create slow and large piercing shot, stuns
  constructor() {
    this.charges = 0
    this.timer = millis()
    this.cooldown = 7500
    this.img = iconImages[2]
  }
  activate(player) {
    if (this.charges > 0) {
      let shotDirection = shotAngleCalc(player.x, player.y)
      let dx = Math.cos(shotDirection[0]) * shotDirection[1]
      let dy = Math.sin(shotDirection[0]) * shotDirection[1]
      shots.push(new Prodj(player.x, player.y, dx * player.shotSpeed * 0.5, dy * player.shotSpeed * 0.5, player.atk * 2, "player", player, 15, 1))
      player.dx += -dx * 25
      player.dy += -dy * 25
      this.charges--
      this.timer = millis() + 7500
    }
  }
  check(player) {
    if (this.charges < 1 && this.timer <= millis()) {
      this.charges++
    }
  }
}

class ScatterShot { //instant 5 shot spread
  constructor() {
    this.charges = 0
    this.timer = millis()
    this.cooldown = 7500
    this.img = iconImages[3]
  }
  activate(player) {
    if (this.charges > 0) {
      let shotDirection = shotAngleCalc(player.x, player.y)
      let angleDeviation = -0.2
      let vel = createVector(player.shotSpeed, 0)
      for (let i = 0; i < 5; i++) {
        vel.setHeading(shotDirection[0] + angleDeviation)
        shots.push(new Prodj(player.x, player.y, vel.x * shotDirection[1], vel.y * shotDirection[1], player.atk * 1.25, "player", player, 10, 0))
        angleDeviation += 0.1
      }
      this.charges--
      this.timer = millis() + this.cooldown
    }
  }
  check(player) {
    if (this.charges < 1 && this.timer <= millis()) {
      this.charges++
    }
  }
}

//info for heores menu
var heroes = []
heroes[0] = { id: 0, hp: 100, atk: 30, def: 0, name: "Cartridge", altname: "The Fugitive", desc: "'Even at the End of Times, Law still Bind him to this Land.'", skills: [0, 1, 2, 3] }
heroes[1] = { id: 1, hp: "???", atk: "???", def: "???", name: "[NO DATA]", altname: "The Hunter", desc: "[File Incomplete. Information is still being gathered]", skills: [0, 1, 1, 1] } //this is a temp, proves automatic button creation works.

skilldesc = []
skilldesc[0] = { name: "Blink", desc: "Dash forward, temporarily increasing your movement speed. 2 Charges. 5s cooldown", quip: "Missed Me.", img: 0 }
skilldesc[1] = { name: "Lunging Cuff", desc: "Performing a lunging punch, damaging and knocking back enemies in your path. 10s cooldown.", quip: "Sometimes ya gotta get ya hands dirty.", img: 1 }
skilldesc[2] = { name: "SkullShatter", desc: "Fire a high power shot, knocking you and the enemy away from each other. 7.5s cooldown", quip: "Right between the eyes!", img: 2 }
skilldesc[3] = { name: "ScatterShot", desc: "Fire five bullets in a pattern infront of you. 7.5s cooldown", quip: "I got enough bullets for everyone", img: 3 }
