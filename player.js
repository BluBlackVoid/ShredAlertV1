class Player {
  constructor(x, y) {
    //Movement Variables
    this.x = x
    this.y = y
    this.w = 10
    this.h = 20
    this.dy = 0
    this.dx = 0
    this.moveSpeed = 5
    //Shooting Variables + Stats
    this.atk = 30
    this.maxhp = 100
    this.hp = 100
    this.def = 0
    this.atkSpeed = 500
    this.shotSpeed = 10
    this.nextShot = 0
    this.incDMG
    //ready-up variables
    this.ready = false
    this.readyCounter = 0
    this.readyDecay
    //item arrays
    this.whenHitItems = []
    this.whenHitConditional = []
    this.onHitItems = []
    this.onKillItems = []
    //skills
    this.skills = []
    this.inputLocked = false
    this.invuln = millis()
    //misc
    this.kills = 0
    this.sItemsLooted = 0
  }
  render() {
    fill("White")
    rect(this.x, this.y, this.w, this.h)
  }

  update() {
    if (!this.inputLocked) {
      this.moveCheck()//moveCheck
      if (mouseIsPressed == true) {//shooting checks
        if (mouseButton == LEFT) {
          this.shotCheck()
        }
      }
    }
    //skill Checks
    for (let i = 0; i < this.skills.length; i++) {
      this.skills[i].check(this)
    }
    //ready Checks
    if (this.readyCounter == 3) { //once F is tripple tapped
      this.ready = true
    }
    if (this.readyDecay < millis()) { //reset counter once time has elapsed
      this.readyCounter = 0
    }
    //extra collision check, mostly for skills
    let collideResult = collideCheck(this.x + this.dx, this.y + this.dy, this.w, this.h)
    if (collideResult[0]) { 
      this.dx = 0
      this.dy = 0
    }
    this.x += this.dx
    this.y += this.dy
    //border collison checks
    if (this.y <= 0) {
      this.y = 0
    }
    if (this.x <= 0) {
      this.x = 0
    }
    if (this.x >= currentmap[0].length * layoutCellSize - (this.w + 5)) {
      this.x = currentmap[0].length * layoutCellSize - (this.w + 5)
    }
    if (this.y >= currentmap.length * layoutCellSize - (this.h + 5)) {
      this.y = currentmap.length * layoutCellSize - (this.h + 5)
    }
    this.dx = 0
    this.dy = 0

    //whenHitConditional Items Checks
    for (let i = 0; i < this.whenHitConditional.length; i++) {
      this.whenHitConditional[i].update(this)
    }
  }

  moveCheck() {
    let collideResult //[0] is true/false. [1] is colliding obstacle
    //Check what key is being pressed, change movespeed, ensure player never moves into a wall
    if (keyIsDown(87)) { //up (W)
      this.dy = -this.moveSpeed
      collideResult = collideCheck(this.x + this.dx, this.y + this.dy, this.w, this.h)
      if (this.y > 0) {
        if (collideResult[0] == false) {
          this.dy = -this.moveSpeed
        }
        else {
          this.dy = (collideResult[1].y + collideResult[1].l + 1) - this.y
        }
      }
    }

    if (keyIsDown(83)) {//down (S)
      this.dy = this.moveSpeed
      collideResult = collideCheck(this.x + this.dx, this.y + this.dy, this.w, this.h)
      if (this.y < (currentmap.length) * layoutCellSize - 23) {
        if (collideResult[0] == false) {
          this.dy = this.moveSpeed
        }
        else {
          this.dy = (collideResult[1].y - 21) - this.y
        }
      }
    }
    if (keyIsDown(65)) {//left (A)
      this.dx = -this.moveSpeed
      collideResult = collideCheck(this.x + this.dx, this.y + this.dy, this.w, this.h)
      if (this.x > 0) {
        if (collideResult[0] == false) {
          this.dx = -this.moveSpeed
        }
        else {
          this.dx = (collideResult[1].x + collideResult[1].w + 1) - this.x
        }
      }
    }

    if (keyIsDown(68)) {//right (D)
      this.dx = this.moveSpeed
      collideResult = collideCheck(this.x + this.dx, this.y + this.dy, this.w, this.h)
      if (this.x < (currentmap[0].length) * layoutCellSize - 18.5) {
        if (collideResult[0] == false) {
          this.dx = this.moveSpeed
        }
        else {
          this.dx = (collideResult[1].x - 11) - this.x
        }
      }
    }
  }

  shotCheck() {
    if (this.nextShot <= millis()) { //check if enough time has passsed since last shot, then calculate angle and speed to shot prodj at.
      let shotDirection = shotAngleCalc(this.x, this.y)
      let dy = Math.sin(shotDirection[0]) * this.shotSpeed * shotDirection[1]
      let dx = Math.cos(shotDirection[0]) * this.shotSpeed * shotDirection[1]
      shots.push(new Prodj(this.x, this.y, dx, dy, this.atk, "player", this, 10, 0))
      this.nextShot = millis() + this.atkSpeed
    }
  }

  hurtMe(atk, origin) {
    if (this.invuln <= millis()) {
      this.incDMG = atk
      for (let i = 0; i < this.whenHitItems.length; i++) { //whenHitItem Checks
        this.whenHitItems[i].check(this.atk, this.def, origin, this)
      }
      for (let i = 0; i < this.whenHitConditional.length; i++) { //whenHitConidtional Checks
        this.whenHitConditional[i].check(this)
      }
      if (this.incDMG - this.def > 10) { //inflict damaged = atk - def. Min damage = 10 
        this.hp = this.hp - (this.incDMG - this.def)
      }
      else {
        this.hp -=10
      }
    }
  }

  interact() {
    if (collideRectRect(this.x, this.y, 10, 20, exitRegionX, exitRegionY, layoutCellSize, layoutCellSize) && stageObjective.complete == true) { //Readying Up
      if (this.readyCounter < 3) { //increments counter and decay time
        this.readyCounter++
        this.readyDecay = millis() + 1000
      }
    }
    for (i in items) { //pick up items
      if (collideRectCircle(items[i].x, items[i].y, 10, 10, this.x, this.y, 50)) {
        items[i].interact(this)
      }
    }
  }

  skillActivate(number) {
    if (!this.inputLocked) { 
      this.skills[number].activate(this)
    }
  }
}

function collideCheck(x, y, w, h) { //global colliding with walls check.
  for (o in obstacles) {
    if (collideRectRect(x, y, w, h, obstacles[o].x, obstacles[o].y, obstacles[o].l, obstacles[o].w)) {
      return ([true, obstacles[o]])
    }
  }
  return ([false])
}

function shotAngleCalc(x, y) { //calculate angle to shot prodj at based on target co-ords
  let shotmulti = 1
  let mouseYrealpos = mouseY - camyoff
  let mouseXrealpos = mouseX - camxoff
  let dy = mouseYrealpos - y
  let dx = mouseXrealpos - x
  if (dx < 0) {
    shotmulti = -1
  }
  let shotAngle = Math.atan(dy / dx)
  return ([shotAngle, shotmulti])
}