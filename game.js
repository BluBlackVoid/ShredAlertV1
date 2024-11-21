var canvas
var obstacles = []
var player
var camxoff = 0
var camyoff = 0
var shots = []
var enemies = []
var enemySpawnCap = 50
var enemyNextWave = 0
var stageObjective = { id: 0, goal: 0, progress: 0, complete: false }
var items = []
var difficulty = 1
var difficultyTimer = 5000
var gameState = "MainMenu"
var pauseStartTime = 0

function preload() {
  //background images (Credit to Hypergryph Arknights)
  bgImages.push(loadImage('images/bgImages/bg_1_call.png')) //0
  bgImages.push(loadImage('images/bgImages/pic_rogue_1_8.png')) //1
  bgImages.push(loadImage('images/bgImages/pic_rogue_1_25.png')) //2
  bgImages.push(loadImage('images/bgImages/21_G9_rhodes_xqoffice.png'))//3
  bgImages.push(loadImage('images/bgImages/avg_map_1.png'))//4
  bgImages.push(loadImage('images/bgImages/avg_map_2.jpg'))//5
  bgImages.push(loadImage('images/bgImages/bg_rooftop.png')) //6
  bgImages.push(loadImage('images/bgImages/bg_lungmencommand.png')) //7
  //skill images (i [poorly] drew these)
  iconImages.push(loadImage('images/skills/blink.jpg'))
  iconImages.push(loadImage('images/skills/lungingcuff.jpg'))
  iconImages.push(loadImage('images/skills/skullshatter.jpg'))
  iconImages.push(loadImage('images/skills/scattershot.jpg'))
}

function setup() { // set canvas pos and size, prompt use to resize window, set size may be to large/small for certain monitors.
  frameRate(60)
  rectMode(CORNER)
  ellipseMode(CORNER)
  canvas = createCanvas(1600, 900)
  canvas.position(150, 50)
  textWrap(WORD)
  activateMainMenu()
  prompt("Resize The Window If The Game Isn't Displayed Properly.", "Ctrl + ScrollWheel")
}

function draw() { //draw things based on game state
  switch (gameState) {
    case "inGame":
      inGameRender()
      break
    case "GameOver":
      gameOver()
      break
    case "Pause":
      pauseMenu()
      break
    case "MainMenu":
      drawMainMenu()
      break
    case "Archives":
      drawArchives()
      break
    case "TutorMenu":
      drawTutorMenu()
      break
    case "ItemMenu":
      drawItemMenu()
      break
    case "HeroMenu":
      drawHeroMenu()
      break
  }
}

function newStage() { //resets arrays, creates new maps, sets stage objective
  enemies = []
  shots = []
  obstacles = []
  items = []
  levelGen()
  leveldraw()
  genNavMap()
  stageTime.start = millis()
  stageObjective.id = Math.floor(Math.random() * 3)
  stageObjective.complete = false
  if (stageObjective.id == 0) {
    stageObjective.goal = millis() + (300000 / 2)
    stageTime.end = stageObjective.goal
  }
  else if (stageObjective.id == 1) {
    stageObjective.goal = 50
    stageObjective.progress = 0
  }
  else if (stageObjective.id == 2) {
    stageObjective.goal = 20
    stageObjective.progress = 0
  }
  opacity.start = millis() + 5000
  opacity.end = millis() + 5500
}

function keyPressed() {
  switch (gameState) {
    case "inGame":
      if (keyCode == 70) { //F
        player.interact()
      }
      if (keyCode == 32) {//Space
        player.skillActivate(0)
      }
      if (keyCode == 81) {//Q
        player.skillActivate(1)
      }
      if (keyCode == 69) {//E
        player.skillActivate(2)
      }
      if (keyCode == 88) {//X
        player.skillActivate(3)
      }
      if (keyCode == 84) {//T (objective check)
        opacity.start = millis() + 2000
        opacity.end = millis() + 2500
      }
      if (keyCode == 80) {//P
        activatePause()
      }
      break

    case "GameOver":
      initaliseGame()
      break
    case "Pause":
      if (keyCode == 80) {//P
        unPause()
      }
  }
}

class Prodj {
  constructor(pshotX, pshotY, shotDirectionX, shotDirectionY, atk, align, origin, width, effect) {
    this.x = pshotX
    this.y = pshotY
    this.dX = shotDirectionX
    this.dY = shotDirectionY
    this.atk = atk
    this.align = align
    this.origin = origin
    this.w = width
    this.effect = effect //0 None 1 Stun
  }
  render() {
    if (this.align == "player") {
      fill("White")
    }
    if (this.align == "enemy") {
      if (this.origin.type == 0) {
        fill("Orange")
      }
      if (this.origin.type == 1) {
        fill("Red")
      }
    }
    ellipse(this.x, this.y, this.w, this.w)
  }
  update() {
    if (this.x < 0 || this.x > (currentmap[0].length) * layoutCellSize || this.y < 0 || this.y > (currentmap.length) * layoutCellSize) { //deletes projectile after it leaves the screen
      shots.splice(shots.indexOf(this), 1)
    }
    else {
      let currentNodeX = Math.floor(this.x / tileCellSize)
      let currentNodeY = Math.floor(this.y / tileCellSize)
      if (navmap[currentNodeY][currentNodeX].wall == true) { //delete when hit wall
        shots.splice(shots.indexOf(this), 1)
      }
    }
    //damages entities base on alignment 
    if (this.align == "player") {
      for (e in enemies) {
        if (collideRectCircle(enemies[e].x, enemies[e].y, 10, 20, this.x, this.y, this.w)) {
          for (let i = 0; i < this.origin.onHitItems.length; i++) { // onHitItem checks
            this.origin.onHitItems[i].check(this.origin)
          }
          if (this.effect == 1) { //if stunning projectile, pierce and stun enemies
            enemies[e].stunMe(1500, this.dX * 0.75, this.dY * 0.75)
            enemies[e].invulnEndTime = millis() + 10
          }
          enemies[e].hurtMe(this.atk, this.origin)
          if (this.effect != 1) {//delete on hit (doesn't apply to stunning projectiles)
            shots.splice(shots.indexOf(this), 1)
          }
        }
      }
    }

    if (this.align == "enemy") {
      if (collideRectCircle(player.x, player.y, 10, 20, this.x, this.y, this.w)) {
        player.hurtMe(this.atk, this.origin)
        shots.splice(shots.indexOf(this), 1)
      }
    }
    this.x = this.x + this.dX
    this.y = this.y + this.dY
  }
}

function fovUpdate() { //updates player field of view. WILL BREAK IF INITAL PLAYER POSITION IS NEAR MAP BORDER
  if (player.x <= 800) {
    camxoff = 0
  }
  else if (player.x >= (currentmap[0].length) * layoutCellSize - 800) {
    camxoff = camxoff
  }
  else {
    camxoff = 0 - player.x + 800
  }
  if (player.y <= 450) {
    camyoff = 0
  }
  else if (player.y >= (currentmap.length) * layoutCellSize - 450) {
    camyoff = camyoff
  }
  else {
    camyoff = 0 - player.y + 450
  }
  translate(camxoff, camyoff)
}

function waveCheck() { //enemy wave spawning
  let validSpawn = false
  if (enemyNextWave <= millis() && enemySpawnCap > enemies.length) {
    for (let i = 0; i <= Math.ceil(Math.random() * (5 - 1) + 1); i++) { //standard enemy spawning
      while (!validSpawn) { //randomise position until valid
        let pos = randomPosition(0, Math.random() * (currentmap[0].length * layoutCellSize), 0, Math.random() * (currentmap.length * layoutCellSize))
        if (positionCheck(pos[0], pos[1]) && !collideRectCircle(player.x, player.y, 10, 20, pos[0], pos[1], 500)) {
          enemies.push(new Enemy(pos[0], pos[1], 0, 100 * difficulty, 10 * difficulty, 5 * difficulty))
          validSpawn = true
        }
      }
    }
    if (Math.random() >= 0.5) { // elite enemy spawning
      validSpawn = false
      while (!validSpawn) {//randomise position until valid
        let pos = randomPosition(0, Math.random() * (currentmap[0].length * layoutCellSize), 0, Math.random() * (currentmap.length * layoutCellSize))
        if (positionCheck(pos[0], pos[1]) && !collideRectCircle(player.x, player.y, 10, 20, pos[0], pos[1], 500)) {
          enemies.push(new Enemy(pos[0], pos[1], 1, 100 * difficulty * 1.5, 10 * difficulty * 1.5, 5 * difficulty * 1.5))
          validSpawn = true
        }
      }
    }
    //variable spawn times
    if (enemies.length < 25) {
      if (enemies.length < 10) {
        enemyNextWave = millis() + 2500
      }
      else {
        enemyNextWave = millis() + 7500
      }
    }
    else {
      enemyNextWave = millis() + 12500
    }

  }
}

function positionCheck(x, y) { //check if position is inside obstacle
  let gridx = Math.floor(x / tileCellSize)
  let gridy = Math.floor(y / tileCellSize)
  if (navmap[gridy][gridx].wall == false) {
    return (true)
  }
  else {
    return (false)
  }
}
function randomPosition(xMin, xMax, yMin, yMax) { //generates random co-ordinates within an area
  let x = Math.random() * (xMax - xMin) + xMin
  let y = Math.random() * (yMax - yMin) + yMin
  return ([x, y])
}

function inGameRender() { //inGame logic and rendering
  background(100)
  strokeWeight(0)
  //stage objective checks
  if (stageObjective.id == 0) {
    if (stageObjective.goal <= millis()) {
      stageObjective.complete = true
    }
  }
  else {
    if (stageObjective.goal <= stageObjective.progress) {
      stageObjective.complete = true
    }
  }

  //player ready-up checks
  if (player.ready) {
    player.readyCounter = 0
    player.ready = false
    newStage()
    let valid = false
    let pos
    while (!valid) {
      pos = randomPosition(layoutCellSize, (currentmap[0].length - 1) * layoutCellSize - 800, layoutCellSize, (currentmap.length - 1) * layoutCellSize)
      valid = positionCheck(pos[0], pos[1])
    }
    player.x = pos[0]
    player.y = pos[1]
    player.hp = player.maxhp
  }

  //enemy spawning
  waveCheck()
  if (difficultyTimer <= millis()) {
    difficulty = difficulty + ((Math.random() * (0.3 - 0.1)) + 0.1)
    difficultyTimer = millis() + 10000
  }
  //render everything
  fovUpdate()
  if (stageObjective.complete == true) { //display exit region
    fill(255, 204, 0, 75)
    rect(exitRegionX, exitRegionY, layoutCellSize, layoutCellSize)
  }
  for (o in obstacles) {
    obstacles[o].render()
  }

  player.update()
  player.render()
  for (s in shots) {
    shots[s].render()
    shots[s].update()
  }

  for (e in enemies) {
    enemies[e].render()
    enemies[e].update()
  }

  for (i in items) {
    items[i].render()
  }

  translate(-camxoff, -camyoff) //ensure static position
  hudRender()
  if (player.hp <= 0) {
    newStage()
    gameState = "GameOver"
  }
}
function initaliseGame() { //clears and sets up arrays and variables for game
  interactables = []
  newStage()
  let valid = false
  let pos
  while (!valid) { //gen random pos until valid
    pos = randomPosition(800, (currentmap[0].length) * layoutCellSize - 800, 450, (currentmap.length) * layoutCellSize - 450)
    valid = positionCheck(pos[0], pos[1])
  }
  player = new Player(pos[0], pos[1])
  skillSet01(player)
  difficulty = 1
  standardDropRate = 100
  specialDropRate = 100
  gameState = "inGame"
}

function mouseClicked() {
  for (i in interactables) { //for clicking on buttons
    if (collidePointRect(mouseX, mouseY, interactables[i].x, interactables[i].y, interactables[i].w, interactables[i].h)) {
      interactables[i].click()
    }
  }
}

