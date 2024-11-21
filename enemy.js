class Enemy {
  constructor(x, y, type, hp, atk, def) {
    //position variables
    this.x = x
    this.y = y
    this.dx
    this.dy
    this.w = 10
    this.l = 20
    //0 Idle 1 Move 2 Shoot 3 Stunned -1 Dead
    this.state = 0
    this.target
    //moving vars
    this.path
    this.pathpos
    this.moveSpeed = 3.5
    //shooting vars
    this.nextShot = 0
    this.shotDelay = 1500
    //stats
    this.hp = hp
    this.atk = atk
    this.def = def
    //misc
    this.attacker
    this.type = type //0 standard, 1 elite
    this.stunEndTime = 0
    this.invulnEndTime = 0
  }
  render() {
    if (this.type == 0) { //Normal
      fill("Orange")
    }
    if (this.type == 1) { //Elite
      fill("Red")
    }
    rect(this.x, this.y, this.w, this.l)
  }

  update() {
    if (this.hp <= 0) {
      this.state = -1
    }
    if (this.state == -1) {//delete self
      if (stageObjective.id == 1) { //update purge objective
        if (this.type == 0) {
          stageObjective.progress++
        }
        else if (this.type == 1) {
          stageObjective.progress += 2
        }

      }
      itemDrop(this.x, this.y, this.type)
      for (let i = 0; i < this.attacker.onKillItems.length; i++) {//onKillItems Check
        this.attacker.onKillItems[i].check(this.attacker)
      }
      this.attacker.kills++
      enemies.splice(enemies.indexOf(this), 1)
    }

    if (this.state == 0) { // Idle, trigger pathfinding
      this.targetAquire()
      this.path = pathfind(this.x, this.y, this.target.x, this.target.y)
      if (this.path == -1) {
        this.state = -1
      }
      this.pathpos = this.path.length - 1
      this.state = 1
    }

    if (this.state == 1) { // Move
      let los = losCheck(this.x, this.y, this.target.x, this.target.y)
      if (dist(this.x, this.y, this.target.x, this.target.y) <= 200 && los) { // within effective range and can see target, change state to shoot at target
        this.state = 2
      }
      if (this.pathpos >= 0) {// as long as not at end position
        //calculate postion relative to next node, change dy/dx to move to it.
        let pathX = this.path[this.pathpos].x * tileCellSize
        let pathY = this.path[this.pathpos].y * tileCellSize
        let distX = pathX - this.x
        let distY = pathY - this.y
        if (distX > 0) {
          this.dx = this.moveSpeed
        }
        if (distX < 0) {
          this.dx = -this.moveSpeed
        }
        if (distY > 0) {
          this.dy = this.moveSpeed
        }
        if (distY < 0) {
          this.dy = -this.moveSpeed
        }
        //once a correct x/y stop x/y movement.
        //Inside the each IF statement is a check if enemy is within targetted node
        if (this.x > this.path[this.pathpos].x * tileCellSize && this.x < this.path[this.pathpos].x * tileCellSize + tileCellSize - this.w) {
          this.dx = 0
        }
        if (this.y > this.path[this.pathpos].y * tileCellSize && this.y < this.path[this.pathpos].y * tileCellSize + tileCellSize - this.l) {
          this.dy = 0
        }
        this.x += this.dx
        this.y += this.dy
        if (this.dy == 0 && this.dx == 0) { //movement is 0 when inside target node, updates target node once true
          this.pathpos--
        }
      }
      else {//path find again if not near enemy
        this.state = 0
      }
    }

    if (this.state == 2) { //Shoot
      if (losCheck(this.x, this.y, this.target.x, this.target.y)) { // only allow firing if there is line of sight, else change state
        let shotmulti = 1
        let dy = this.target.y - this.y
        let dx = this.target.x - this.x
        if (dx < 0) {
          shotmulti = -1
        }
        let shotAngle = Math.atan(dy / dx)
        if (dy == 0 && dx == 0) { // fail safe for 0/0 (it crashes the game)
          shotAngle = 0
        }
        dy = Math.sin(shotAngle) * 5 * shotmulti
        dx = Math.cos(shotAngle) * 5 * shotmulti
        if (millis() >= this.nextShot) {
          shots.push(new Prodj(this.x, this.y, dx, dy, this.atk, "enemy", this, 10, 0))
          this.nextShot = millis() + this.shotDelay
        }
      }
      else { //path find again if not near enemy
        this.state = 0
      }

    }

    if (this.state == 3) { //Stunned
      if (this.stunEndTime < millis()) { //path find again once not stunned
        this.state = 0
      }
      let tempNewX = this.x + this.dx
      let tempNewY = this.y + this.dy
      if (tempNewX > 0 && tempNewX < (currentmap[0].length) * layoutCellSize - 18.5 && tempNewY > 0 && this.y < (currentmap.length) * layoutCellSize - 23) {//if next move is within map
        let colliding = collideCheck(this.x, this.y, this.w, this.l)
        if (colliding[0]) {
          this.dx = 0
          this.dy = 0
        }
      }
      else {
        this.dx = 0
        this.dy = 0
      }
      //update position, alter speed
      this.x += this.dx
      this.y += this.dy
      this.dx = this.dx / 1.05
      this.dy = this.dy / 1.05
    }
  }


  targetAquire() { //update when multiplayer implemented
    this.target = player
    this.attacker = player
  }

  hurtMe(atk, origin) {
    if (this.invulnEndTime < millis()) {
      this.attacker = origin
      //inflict damaged = atk - def. Min damage = 10 
      if (atk - this.def > 10) {
        this.hp = this.hp - (atk - this.def)
      }
      else {
        this.hp -= 10
      }
    }
  }

  stunMe(time, dx, dy) {//used to activate stun
    this.state = 3
    this.stunEndTime = millis() + time
    this.dy = dy
    this.dx = dx
  }

}

function pathfind(x, y, tx, ty) {
  //A* path finding, refer to wikipedia 
  var openset = []
  var closedset = []
  var start = navmap[Math.floor(y / tileCellSize)][Math.floor(x / tileCellSize)]
  var end = navmap[Math.floor(ty / tileCellSize)][Math.floor(tx / tileCellSize)]
  openset.push(start)

  while (openset.length > 0) {
    let lowestF = 0;
    for (let i = 0; i < openset.length; i++) {
      if (openset[i].f < openset[lowestF].f) {
        lowestF = i
      }
    }

    let current = openset[lowestF]
    if (current == end) {//we reached the end, create path array for enemies
      let path = []
      let temp = current
      path.push(temp)
      while (temp.prev) {
        path.push(temp.prev)
        temp = temp.prev
      }
      for (let i = 0; i < navmap.length; i++) { //reset pathfinding array values
        for (let j = 0; j < navmap[0].length; j++) {
          navmap[i][j].f = 0
          navmap[i][j].g = 0
          navmap[i][j].h = 0
          navmap[i][j].prev = null
        }
      }
      return (path)
    }

    removeFromArray(openset, current)
    closedset.push(current)

    var neighbours = current.neighbours
    for (var i = 0; i < neighbours.length; i++) { //checking every neighbour
      var neighbour = neighbours[i]

      if (!closedset.includes(neighbour) && !neighbour.wall) {//stops closed set values from being evaluated
        var newG = current.g + 1

        if (openset.includes(neighbour)) {//if neighbour is already in openset, chooses better G val
          if (newG < neighbour.g) {
            neighbour.g = newG
          }
        }
        else {
          neighbour.g = newG
          openset.push(neighbour)
        }
        neighbour.h = calcH(neighbour, end)
        neighbour.f = neighbour.g + neighbour.h
        neighbour.prev = current
      }

    }
  }
  return (-1) //No Path???
}

function removeFromArray(array, item) { // removing from openset
  for (let i = array.length - 1; i >= 0; i--) {
    if (array[i] == item) {
      array.splice(i, 1)
    }
  }
}

function calcH(a, b) {
  //var d = dist(a.x, a.y, b.x.b.y) //euclidean dist
  var d = abs(a.x - b.x) + abs(a.y - b.y) //Taxicab dist
  return (d)
}

function losCheck(x, y, tx, ty) { //line of sight check
  for (o in obstacles) {
    if (collideLineRect(x, y, tx, ty, obstacles[o].x, obstacles[o].y, obstacles[o].l, obstacles[o].w)) {
      return (false)
    }
  }
  return (true)
}

var standardDropRate = 100
var specialDropRate = 100
function itemDrop(x, y, type) {
  if (type == 1) { //elite enemy
    standardDropRate = 100
    if (Math.floor(Math.random() * 99) < specialDropRate) { // special itemdrop
      let rarityVal = Math.random()
      let itemID
      //select item of correct rarity
      if (rarityVal <= 0.2) {
        itemID = rarityCheck("Legendary", spItems)
      }
      else if (rarityVal > 0.2 && rarityVal <= 0.55) {
        itemID = rarityCheck("Epic", spItems)
      }
      else if (rarityVal > 0.55) {
        itemID = rarityCheck("Rare", spItems)
      }
      items.push(new Item(x, y, itemID, 1))
      specialDropRate = 25
    }
    else { //increase Drop Rate on every failed drop
      specialDropRate += 25
    }
  }
  if (Math.floor(Math.random() * 99) < standardDropRate) { //standard item drop
    let rarityVal = Math.random()
    let itemID
    //select item of correct rarity
    if (rarityVal <= 0.15) {
      itemID = rarityCheck("Legendary", sItems)
    }
    else if (rarityVal > 0.15 && rarityVal <= 0.4) {
      itemID = rarityCheck("Epic", sItems)
    }
    else if (rarityVal > 0.4 && rarityVal <= 0.75) {
      itemID = rarityCheck("Rare", sItems)
    }
    else if (rarityVal > 0.75) {
      itemID = rarityCheck("Common", sItems)
    }
    items.push(new Item(x, y, itemID, 0))
    standardDropRate = 20
  }
  else {//increase Drop Rate on every failed drop
    standardDropRate += 20
  }

}

function rarityCheck(rarity, itemlist) { //randomly selects an item. If that item is the correct rarity, return it's ID 
  let valid = false
  let itemID
  while (!valid) {
    itemID = Math.floor(Math.random() * itemlist.length)
    if (itemlist[itemID].rarity == rarity) {
      valid = true
      return (itemID)
    }
  }
}