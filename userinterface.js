var stageTime = { start: 0, end: 0 }
var opacity = { start: 0, end: 0, val: 0 }
var itemDisp = { start: 0, end: 0, text: "", rarity: "", desc: "", opacVal: 0 }
var interactables = []
var bgImages = []
var iconImages = []
var barDIFF //used to store difference in two values to convey progress bars

function rarityColourPicker(rarity, opacity) { //select colour based on item rarity
  if (rarity == "Common") {
    fill(50, 50, 50, opacity)
  }
  if (rarity == "Rare") {
    fill(0, 50, 170, opacity)
  }
  if (rarity == "Epic") {
    fill(100, 0, 150, opacity)
  }
  if (rarity == "Legendary") {
    fill(170, 120, 0, opacity)
  }
}
//HUD Functions
function hudRender() {
  strokeWeight(1)
  //BottomLeft
  //chara pic
  fill("Black")
  rect(0, 750, 150, 150)
  //healthbar
  barDIFF = player.hp / player.maxhp
  if (barDIFF < 0) {
    barDIFF = 0
  }
  rect(150, 850, 350, 50)
  if (barDIFF <= 0.5) {
    if (barDIFF <= 0.15) {
      fill("Red")
    }
    else {
      fill("Orange")
    }
  }
  else {
    fill("Green")
  }
  rect(150, 850, 350 * barDIFF, 50)
  fill("White")
  textSize(30)
  let itext = Math.round(player.hp) + " / " + player.maxhp
  text(itext, 250, 885)
  //skills
  strokeWeight(0)
  let xcord = 160
  for (let i = 0; i < 4; i++) {
    fill("Blue")
    rect(xcord, 760, 70, 70)
    image(player.skills[i].img, xcord, 760, 70, 70)
    fill(10, 10, 10, 200)
    barDIFF = 1 + (millis() - player.skills[i].timer) / player.skills[i].cooldown
    if (barDIFF >= 1) {
      barDIFF = 1
    }
    rect(xcord, 760, 70, 70 * (1 - barDIFF))
    fill("White")
    textSize(25)
    text(player.skills[i].charges, xcord + 27.5, 780)
    xcord += 90
  }
  //player stats
  fill("Black")
  itext = "ATK: " + player.atk
  text(itext, 5, 720)
  itext = "DEF: " + player.def
  text(itext, 5, 745)

  //TopLeft
  textSize(30)
  strokeWeight(1)
  fill("Yellow")
  barDIFF = difficulty - (Math.floor(difficulty))
  rect(0, 0, 250, 50)
  fill("Orange")
  rect(0, 0, 250 * barDIFF, 50)
  itext = "RSK: " + (Math.floor(difficulty * 100)) / 100
  fill("Black")
  text(itext, 12.5, 35)
  //TopRight
  fill("Black")
  rect(1600 - 300, 0, 300, 50)
  if (!stageObjective.complete) {
    if (stageObjective.id == 0) {
      itext = "Objective: Persist"
      barDIFF = 1 - (stageTime.end - millis()) / stageTime.end
      fill("Green")
      rect(1600 - (300 * barDIFF), 0, 300 * barDIFF, 50)
      fill("White")
      text(itext, 1600 - 275, 35)
    }
    if (stageObjective.id == 1) {
      itext = "Objective: Purge"
      barDIFF = 1 - (stageObjective.goal - stageObjective.progress) / stageObjective.goal
      fill("Green")
      rect(1600 - (300 * barDIFF), 0, 300 * barDIFF, 50)
      fill("White")
      text(itext, 1600 - 275, 35)
    }
    if (stageObjective.id == 2) {
      itext = "Objective: Plunder"
      barDIFF = 1 - (stageObjective.goal - stageObjective.progress) / stageObjective.goal
      fill("Green")
      rect(1600 - (300 * barDIFF), 0, 300 * barDIFF, 50)
      fill("White")
      text(itext, 1600 - 275, 35)
    }
  }
  else {
    itext = "Objective Complete"
    fill("Yellow")
    rect(1600 - 300, 0, 300, 50)
    fill("Black")
    text(itext, 1600 - 275, 35)
  }
  objectiveReminder()
  itemDisplay()
}
function objectiveReminder() {
  strokeWeight(0)
  opacity.val = map(millis(), opacity.start, opacity.end, 255, 0)
  if (stageObjective.id == 0) {
    fill(10, 0, 50, opacity.val)
    rect(525, 0, 500, 125)
    textSize(50)
    itext = "Persist"
    fill(255, 255, 255, opacity.val)
    text(itext, 700, 50)
    textSize(25)
    itext = "'Survive, Do Whatever is Necessary'"
    text(itext, 575, 100)
  }
  if (stageObjective.id == 1) {
    fill(10, 0, 50, opacity.val)
    rect(525, 0, 500, 125)
    textSize(50)
    itext = "Purge"
    fill(255, 255, 255, opacity.val)
    text(itext, 710, 50)
    textSize(25)
    itext = "'Take Back Our Land, Kill Our Invaders'"
    text(itext, 560, 100)
  }
  if (stageObjective.id == 2) {
    fill(10, 0, 50, opacity.val)
    rect(525, 0, 500, 125)
    textSize(50)
    itext = "Plunder"
    fill(255, 255, 255, opacity.val)
    text(itext, 690, 50)
    textSize(25)
    itext = "'Their Items are Ours to Take'"
    text(itext, 610, 100)
  }
}
function itemDisplay() {
  strokeWeight(0)
  itemDisp.opacVal = map(millis(), itemDisp.start, itemDisp.end, 255, 0)
  textSize(30)
  //item name
  itext = itemDisp.text
  let width = textWidth(itext)
  rarityColourPicker(itemDisp.rarity, itemDisp.opacVal)
  rect(0, 200, width, 35)
  fill(255, 255, 255, itemDisp.opacVal)
  text(itext, 0, 230)
  //item description
  itext = itemDisp.desc
  width = textWidth(itext)
  rarityColourPicker(itemDisp.rarity, itemDisp.opacVal)
  rect(0, 240, width, 40)
  fill(255, 255, 255, itemDisp.opacVal)
  text(itext, 0, 275)
}

// All Pause Menu Functions
function activatePause() {
  interactables = []
  pauseStartTime = millis()
  generateItemsMenu()
  textSize(35)
  interactables.push(new ResumeButton())
  interactables.push(new ExitButton())
  interactables.push(new OptionsButton())
  gameState = "Pause"
}
function pauseMenu() {
  background(100)
  strokeWeight(0)
  fovUpdate()
  for (o in obstacles) {
    obstacles[o].render()
  }
  player.render()
  for (s in shots) {
    shots[s].render()
  }
  for (e in enemies) {
    enemies[e].render()
  }
  for (i in items) {
    items[i].render()
  }
  translate(-camxoff, -camyoff) //ensure static position
  //create boxes
  fill(0, 0, 0, 100)
  rect(0, 0, 1600, 900)
  fill("Black")
  rect(225, 125, 550, 400)
  rect(225, 550, 550, 250)
  rect(825, 125, 550, 675)
  textSize(40)
  fill("White")
  //Static Text Elements
  text("PAUSED", 425, 175)
  text("Items", 1050, 175)
  //player stat display
  text("Player Stats", 400, 600)
  textSize(30)
  text("ATK: " + player.atk, 250, 675)
  text("DEF: " + player.def, 250, 700)
  text("HP: " + Math.floor(player.hp) + "/" + player.maxhp, 250, 725)
  text("ATKSPD: " + player.atkSpeed, 525, 675)
  text("MoveSPD: " + player.moveSpeed, 525, 700)
  text("Kills: " + player.kills, 525, 725)
  text("Standard Items Collected: " + player.sItemsLooted, 875, 225)
  text("Special Items", 1000, 275)
  for (i in interactables) {
    interactables[i].render()
  }
  for (i in interactables) {
    //let stateChange = false
    if (collidePointRect(mouseX, mouseY, interactables[i].x, interactables[i].y, interactables[i].w, interactables[i].h)) {
      interactables[i].mouseOver()
    }
  }
}
class spItemIcon {
  constructor(x, y, id) {
    this.x = x
    this.y = y
    this.w = 50
    this.h = 50
    this.id = id
    this.name = spItems[id].name
    this.desc = spItems[id].desc
    this.rarity = spItems[id].rarity
    this.stack = 1
  }
  render() {
    rarityColourPicker(this.rarity, 255)
    rect(this.x, this.y, this.w, this.h)
    textSize(20)
    fill("White")
    text("x" + this.stack, this.x + 5, this.y + 20)
  }
  mouseOver() { //displays item info in box
    strokeWeight(1)
    fill("White")
    textSize(25)
    let boxSize = textWidth(this.name + 10)
    rect(this.x + 25, this.y + 10, boxSize, 10 + 25 * ((boxSize + textWidth(this.desc)) / boxSize))
    rarityColourPicker(this.rarity, 255)
    text(this.name, this.x + 30, this.y + 15, boxSize)
    textSize(20)
    text(this.desc, this.x + 30, this.y + 35, boxSize)
  }
  click() {
    //do nothing lol
  }
}
function generateItemsMenu() { //loops through every item array, creating a new icon for each unique item
  let iconposX = 0
  let iconposY = 0
  let x = 0
  let y = 0
  let dupe
  for (i in player.whenHitItems) {
    dupe = dupeIconCheck(player.whenHitItems[i])
    if (!dupe) {
      x = 850 + (75 * iconposX)
      y = 300 + (75 * iconposY)
      interactables.push(new spItemIcon(x, y, player.whenHitItems[i].id))
      iconposX++
      if (iconposX > 6) {
        iconposX = 0
        iconposY++
      }
    }
  }
  for (i in player.whenHitConditional) {
    dupe = dupeIconCheck(player.whenHitConditional[i])
    if (!dupe) {
      x = 850 + (75 * iconposX)
      y = 300 + (75 * iconposY)
      interactables.push(new spItemIcon(x, y, player.whenHitConditional[i].id))
      iconposX++
      if (iconposX > 6) {
        iconposX = 0
        iconposY++
      }
    }
  }
  for (i in player.onHitItems) {
    dupe = dupeIconCheck(player.onHitItems[i])
    if (!dupe) {
      x = 850 + (75 * iconposX)
      y = 300 + (75 * iconposY)
      interactables.push(new spItemIcon(x, y, player.onHitItems[i].id))
      iconposX++
      if (iconposX > 6) {
        iconposX = 0
        iconposY++
      }
    }
  }
  for (i in player.onKillItems) {
    dupe = dupeIconCheck(player.onKillItems)
    if (!dupe) {
      x = 850 + (75 * iconposX)
      y = 300 + (75 * iconposY)
      interactables.push(new spItemIcon(x, y, player.onKillItems[i].id))
      iconposX++
      if (iconposX > 6) {
        iconposX = 0
        iconposY++
      }
    }
  }
}
function dupeIconCheck(tItem) { //check if Icon exists already, increments count, returns boolean
  for (j in interactables) {
    if (tItem.id == interactables[j].id) {
      interactables[j].stack++
      return (true)
    }
  }
  return (false)
}
class ResumeButton {
  constructor() {
    this.x = 440
    this.y = 220
    this.w = textWidth("Resume")
    this.h = 35
    this.id = -1.0 //no item has a negative id, but every interactable needs an id 
  }
  render() {
    textSize(35)
    fill("White")
    text("Resume", this.x, this.y + this.h)
  }
  mouseOver() {
    textSize(35)
    fill("Green")
    text("Resume", this.x, this.y + this.h)
    fill("Gray")
    textSize(20)
    rect(this.x, this.y + this.h, textWidth("Back Into the Fight") + 5, 25)
    fill("Black")
    text("Back Into the Fight", this.x, this.y + this.h + 20)
  }
  click() {
    unPause()
  }
}
class OptionsButton {
  constructor() {
    this.x = 445
    this.y = 320
    this.w = textWidth("Options")
    this.h = 35
    this.id = -1.1
  }
  render() {
    textSize(35)
    fill("White")
    text("Options", this.x, this.y + this.h)
  }
  mouseOver() {
    textSize(35)
    fill("Yellow")
    text("Options", this.x, this.y + this.h)
    fill("Gray")
    textSize(20)
    rect(this.x, this.y + this.h, textWidth("Not Available") + 5, 25)
    fill("Black")
    text("Not Available", this.x, this.y + this.h + 20)
  }
  click() {
    //do nothing lol
  }
}
class ExitButton {
  constructor() {
    this.x = 450
    this.y = 420
    this.w = textWidth("Retreat")
    this.h = 35
    this.id = -1.2
  }
  render() {
    textSize(35)
    fill("White")
    text("Retreat", this.x, this.y + this.h)
  }
  mouseOver() {
    textSize(35)
    fill("Red")
    text("Retreat", this.x, this.y + this.h)
    fill("Gray")
    textSize(20)
    rect(this.x, this.y + this.h, textWidth("Leave to Fight Another Day") + 5, 25)
    fill("Black")
    text("Leave to Fight Another Day", this.x, this.y + this.h + 20)
  }
  click() {
    activateMainMenu()
  }
}
function unPause() {
  //increase all timers to prevent events from triggering early
  let timeDIFF = millis() - pauseStartTime
  if (stageObjective.id == 0) {
    stageObjective.goal += timeDIFF
  }
  stageTime.end += timeDIFF
  difficultyTimer += timeDIFF
  enemyNextWave += timeDIFF
  player.nextShot += timeDIFF
  for (s in player.skills) {
    player.skills[s].timer += timeDIFF
  }
  for (i in player.whenHitItems) {
    player.whenHitItems[i].timer += timeDIFF
  }
  for (i in player.whenHitConditional) {
    player.whenHitConditional[i].timer += timeDIFF
  }
  for (i in player.onHitItems) {
    player.onHitItems[i].timer += timeDIFF
  }
  for (i in player.onKillItems) {
    player.onKillItems[i].timer += timeDIFF
  }

  for (e in enemies) {
    enemies[e].nextShot += timeDIFF
  }
  interactables = []
  gameState = "inGame"
}

//Game Over Functions
function activateGameOver() {
  gameState = "GameOver"
  interactables = []
}
function gameOver() {
  background(100)
  textSize(200)
  fill("Red")
  text("Game Over", 300, 500)
  textSize(100)
  text("Press Any Key to Start Again", 150, 800)
}

//Main Menu Functions
function activateMainMenu() {
  interactables = []
  gameState = "MainMenu"
  interactables.push(new SinglePlayerButton())
  interactables.push(new MultiPlayerButton())
  interactables.push(new MainOptionsButton())
  interactables.push(new ArchivesButton())
}
function drawMainMenu() {
  fill("Black")
  background(100)
  image(bgImages[6], 0, 0, 1600, 900)
  textSize(75)
  textStyle(BOLDITALIC)
  text("Shred Alert", 800 - (textWidth("Shred Alert") / 2), 100)
  for (i in interactables) {
    interactables[i].draw()
  }
  for (i in interactables) {
    if (collidePointRect(mouseX, mouseY, interactables[i].x, interactables[i].y, interactables[i].w, interactables[i].h)) {
      interactables[i].mouseOver()
    }
  }
  textStyle(NORMAL)
  textSize(25)
  fill("Black")
  text("Various Image Assets property of Arknights, Hypergryph", 100, 850)
}
class SinglePlayerButton {
  constructor() {
    this.x = 100
    this.y = 150
    this.w = 650
    this.h = 375
  }
  draw() {
    strokeWeight(5)
    fill("White")
    rect(this.x, this.y, this.w, this.h)
    image(bgImages[4], this.x, this.y, this.w, this.h, 250, 200, this.w, this.h)
    fill("Black")
    textSize(40)
    textStyle(BOLD)
    text("Singleplayer", this.x + this.w / 2 - textWidth("SinglePlayer") / 2, this.y + 50)
  }
  mouseOver() {
    fill("White")
    text("Singleplayer", this.x + this.w / 2 - textWidth("SinglePlayer") / 2, this.y + 50)
  }
  click() {
    initaliseGame()
  }
}
class MultiPlayerButton {
  constructor() {
    this.x = 1500 - 650
    this.y = 150
    this.w = 650
    this.h = 375
  }
  draw() {
    strokeWeight(5)
    fill("White")
    rect(this.x, this.y, this.w, this.h)
    image(bgImages[5], this.x, this.y, this.w, this.h, 300, 150, this.w, this.h)
    fill("Black")
    textSize(40)
    textStyle(BOLD)
    text("Multiplayer", this.x + 225, this.y + 50)
  }
  mouseOver() {
    fill("White")
    text("Multiplayer", this.x + 225, this.y + 50)
    fill("Red")
    textSize(50)
    text("Feature Currently Offline", this.x + 25, this.y + 200)
  }
  click() {  }
}
class MainOptionsButton {
  constructor() {
    this.x = 100
    this.y = 550
    this.w = 650
    this.h = 350 / 2
  }
  draw() {
    strokeWeight(5)
    fill("White")
    rect(this.x, this.y, this.w, this.h)
    image(bgImages[7], this.x, this.y, this.w, this.h, 325, 250, this.w, this.h)
    fill("Black")
    textSize(40)
    textStyle(BOLD)
    text("Options", this.x + 400, this.y + 50)
  }
  mouseOver() {
    fill("White")
    text("Options", this.x + 400, this.y + 50)
    fill("Red")
    textSize(50)
    text("Feature Currently Offline", this.x + 25, this.y + 100)
  }
  click() {  }
}
class ArchivesButton {
  constructor() {
    this.x = 1500 - 650
    this.y = 550
    this.w = 650
    this.h = 350 / 2
  }
  draw() {
    strokeWeight(5)
    fill("White")
    rect(this.x, this.y, this.w, this.h)
    image(bgImages[3], this.x, this.y, this.w, this.h, 300, 200, this.w, this.h)
    fill("Black")
    textSize(40)
    textStyle(BOLD)
    text("Archives", this.x + 450, this.y + 50)
  }
  mouseOver() {
    fill("White")
    text("Archives", this.x + 450, this.y + 50)
  }
  click() {
    activateArchives()
  }
}

//Archive Functions
function activateArchives() {
  interactables = []
  interactables.push(new BackButton("MainMenu"))
  gameState = "Archives"
  interactables.push(new HeroesArchiveButton())
  interactables.push(new ItemsArchiveButton())
  interactables.push(new TutorialsArchiveButton())
}
function drawArchives() {
  //background
  background(100)
  image(bgImages[3], 0, 0, 1600, 900)
  fill(0, 0, 0, 100)
  rect(0, 0, 1600, 900)
  textSize(75)
  fill("Black")
  textStyle(BOLDITALIC)
  text("Archives", 800 - (textWidth("Archives") / 2), 75)
  for (i in interactables) {
    interactables[i].draw()
  }
  for (i in interactables) {
    if (collidePointRect(mouseX, mouseY, interactables[i].x, interactables[i].y, interactables[i].w, interactables[i].h)) {
      interactables[i].mouseOver()
    }
  }
  textStyle(NORMAL)
}
class HeroesArchiveButton {
  constructor() {
    this.x = 750 - 450 / 2 - 450
    this.y = 100
    this.w = 450
    this.h = 750
  }
  draw() {
    strokeWeight(5)
    fill("White")
    rect(this.x, this.y, this.w, this.h)
    image(bgImages[1], this.x, this.y, this.w, this.h, 700, 150, this.w, this.h)
    fill("Black")
    textSize(40)
    textStyle(BOLD)
    text("Heroes", this.x + 250, this.y + 50)
  }
  mouseOver() {
    fill("White")
    text("Heroes", this.x + 250, this.y + 50)
  }
  click() { activateHeroMenu() }
}
class ItemsArchiveButton {
  constructor() {
    this.x = 800 - 450 / 2
    this.y = 100
    this.w = 450
    this.h = 750
  }
  draw() {
    strokeWeight(5)
    fill("White")
    rect(this.x, this.y, this.w, this.h)
    image(bgImages[2], this.x, this.y, this.w, this.h, 550, 150, this.w, this.h)
    fill("Black")
    textSize(40)
    textStyle(BOLD)
    text("Items", this.x + 250, this.y + 50)
  }
  mouseOver() {
    fill("White")
    text("Items", this.x + 250, this.y + 50)
  }
  click() { activateItemsMenu() }
}
class TutorialsArchiveButton {
  constructor() {
    this.x = 850 + 450 / 2
    this.y = 100
    this.w = 450
    this.h = 750
  }
  draw() {
    strokeWeight(5)
    fill("White")
    rect(this.x, this.y, this.w, this.h)
    image(bgImages[0], this.x, this.y, this.w, this.h, 400, 0, this.w, this.h)
    fill("Black")
    textSize(40)
    textStyle(BOLD)
    text("Tutorials", this.x + 250, this.y + 50)
  }
  mouseOver() {
    fill("White")
    text("Tutorials", this.x + 250, this.y + 50)
  }
  click() { activateTutorial() }
}
class BackButton { // applicable everywhere
  constructor(prev) {
    this.x = 25
    this.y = 25
    this.w = 100
    this.h = 50
    this.prev = prev
  }
  draw() {
    strokeWeight(2)
    fill("White")
    rect(this.x, this.y, this.w, this.h)
    fill("Black")
    textSize(30)
    textStyle(BOLD)
    text("Back", this.x + 10, this.y + 10 + 30)
  }
  mouseOver() { }
  click() {
    if (this.prev == "MainMenu") {
      activateMainMenu()
    }
    if (this.prev == "Archives") {
      activateArchives()
    }
  }
}


//TutorialMenu Functions
function activateTutorial() {
  interactables = []
  interactables.push(new BackButton(gameState))
  gameState = "TutorMenu"
}
function drawTutorMenu() {
  //background
  background(100)
  image(bgImages[0], 0, 0, 1600, 900)
  fill(0, 0, 0, 100)
  rect(0, 0, 1600, 900)
  //textsprawllol
  textSize(75)
  textStyle(BOLDITALIC)
  fill("White")
  text("Tutorial", 800 - (textWidth("Tutorial") / 2), 75)
  for (i in interactables) {
    interactables[i].draw()
  }
  for (i in interactables) {
    if (collidePointRect(mouseX, mouseY, interactables[i].x, interactables[i].y, interactables[i].w, interactables[i].h)) {
      interactables[i].mouseOver()
    }
  }
  textStyle(BOLD)
  textWrap(WORD)
  fill("White")
  text("Hey. Sorry if this message is rushed, got our work cut out for us. Anyway, welcome to [Company Name Here]. If you're new here, or you've forgetten, here's a quick run down of what you need to do.", 100, 100, 1400)
  text("I assume you know how to MOVE (it's WASD if you somehow forgot). Just hold down LEFT-CLICK to SHOOT and make sure you're hitting the enemies. They'll drop items, which you can PICK-UP by pressing F. Your SKILLS are bound to E, Q, X and SPACE. Of course, you can't spam them, so use them wisely.", 100, 250, 1400)
  text("You have a goal to complete in each region: SURVIVE, KILL or LOOT. Once you've completed your current objective, head to the YELLOW ZONE and spam F, we'll bring you to the next area. If you need to, you can press P to PAUSE to take a breather, check your gear, or leave if it's too dangerous.", 100, 400, 1400)
  text("More help will come in the future, we need time to get more info. Good Luck Out There! - Message Received [XXXXXX] Days Ago.", 100, 575, 1400)
}

//ItemMenu Functions
var selectedItem = { name: "", desc: "", rarity: "" }
function activateItemsMenu() {
  interactables = []
  interactables.push(new BackButton(gameState))
  gameState = "ItemMenu"
  //generate Item Icons
  selectedItem = { name: "", desc: "", rarity: "" }
  let iconposX = 0
  let iconposY = 0
  let x = 0
  let y = 0
  for (i in sItems) {
    x = 1050 + (75 * iconposX)
    y = 100 + (75 * iconposY)
    interactables.push(new MenuItemIcons(x, y, i, sItems))
    iconposX++
    if (iconposX > 6) {
      iconposX = 0
      iconposY++
    }
  }
  iconposX = 0
  iconposY = 0
  for (i in spItems) {
    x = 1050 + (75 * iconposX)
    y = 400 + (75 * iconposY)
    interactables.push(new MenuItemIcons(x, y, i, spItems))
    iconposX++
    if (iconposX > 6) {
      iconposX = 0
      iconposY++
    }
  }
}
function drawItemMenu() {
  //background
  background(100)
  image(bgImages[2], 0, 0, 1600, 900)
  fill(0, 0, 0, 100)
  rect(0, 0, 1600, 900)
  fill("White")
  textSize(75)
  textStyle(BOLDITALIC)
  text("Items", 400, 75)
  text("Standard Issue", 1025, 75)
  text("Military Grade", 1050, 375)
  strokeWeight(5)
  fill(0, 0, 0, 100)
  rect(1000, 0, 600, 900)
  rect(0, 700, 1000, 200)
  for (i in interactables) {
    interactables[i].draw()
  }
  for (i in interactables) {
    if (collidePointRect(mouseX, mouseY, interactables[i].x, interactables[i].y, interactables[i].w, interactables[i].h)) {
      interactables[i].mouseOver()
    }
  }
  if (selectedItem.name != "") {
    textSize(50)
    strokeWeight(0)
    fill("White")
    text(selectedItem.name, 50, 750)
    textSize(25)
    text(selectedItem.desc, 50, 775, 850)
    rarityColourPicker(selectedItem.rarity, 255)
    rect(250, 125, 500, 500)
  }
}
class MenuItemIcons {
  constructor(x, y, id, type) {
    this.x = x
    this.y = y
    this.w = 50
    this.h = 50
    this.id = id
    this.name = type[id].name
    this.desc = type[id].desc
    this.rarity = type[id].rarity
  }
  draw() {
    rarityColourPicker(this.rarity, 255)
    strokeWeight(0)
    rect(this.x, this.y, this.w, this.h)
  }
  mouseOver() { }
  click() {
    selectedItem.name = this.name
    selectedItem.desc = this.desc
    selectedItem.rarity = this.rarity
  }
}

//HeroMenu Functions
var sHID = null //selected Hero ID
function activateHeroMenu() {
  interactables = []
  interactables.push(new BackButton(gameState))
  gameState = "HeroMenu"
  let x = 50
  let y = 100
  for (h in heroes) {
    interactables.push(new HeroIcons(x, y, h))
    y += 125
  }
  sHID = null
}
function drawHeroMenu() {
  //background
  background(100)
  image(bgImages[1], 0, 0, 1600, 900)
  fill(0, 0, 0, 100)
  rect(0, 0, 1600, 900)
  //text and image elements
  fill("White")
  textSize(75)
  textStyle(BOLDITALIC)
  text("Heroes", 400 - (textWidth("Heroes") / 2), 75)
  for (i in interactables) {
    interactables[i].draw()
  }
  for (i in interactables) {
    if (collidePointRect(mouseX, mouseY, interactables[i].x, interactables[i].y, interactables[i].w, interactables[i].h)) {
      interactables[i].mouseOver()
    }
  }
  fill(255, 255, 255, 100)
  rect(800, 0, 800, 900)
  if (sHID != null) { //shows nothing if nothing is selected.
    fill("Black")
    textSize(75)
    textStyle(BOLDITALIC)
    fill("White")
    text(heroes[sHID].name, 200, 850)
    textSize(50)
    textStyle(BOLD)
    fill("Black")
    text("Statistics", 850, 50)
    text("Skills", 850, 225)
    textSize(25)
    textStyle(NORMAL)
    text("HP: " + heroes[sHID].hp, 850, 100)
    text("ATK: " + heroes[sHID].atk, 850, 130)
    text("DEF: " + heroes[sHID].def, 850, 160)
    fill("White")
    text(heroes[sHID].altname, 150, 775)
    fill("Black")
    textStyle(ITALIC)
    text(heroes[sHID].desc, 1100, 25, 475)
    let y = 250
    for (s in heroes[sHID].skills) {
      image(iconImages[skilldesc[heroes[sHID].skills[s]].img], 850, y, 125, 125)
      fill("black")
      textStyle(BOLD)
      textSize(30)
      text(skilldesc[heroes[sHID].skills[s]].name, 975, y, 400)
      let toffSet = textWidth(skilldesc[heroes[sHID].skills[s]].name)
      textStyle(NORMAL)
      textSize(25)
      text(skilldesc[heroes[sHID].skills[s]].desc, 975, y + 35, 1600 - 975)
      textStyle(BOLDITALIC)
      textSize(20)
      fill(50, 50, 50)
      text(skilldesc[heroes[sHID].skills[s]].quip, 975 + toffSet + 7.5, y + 5, 400)
      y += 160
    }
  }
}
class HeroIcons {
  constructor(x, y, id) {
    this.x = x
    this.y = y
    this.w = 100
    this.h = 100
    this.id = id
  }
  draw() {
    fill("White")
    rect(this.x, this.y, this.w, this.h)
  }
  mouseOver() { }
  click() {
    sHID = this.id
  }
}