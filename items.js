class Item {
  constructor(x, y, id, type) {
    this.x = x + Math.random() * 10 + -5
    this.y = y + Math.random() * 10 + -5
    this.id = id
    this.type = type
  }
  render() { //render item based on rarity, maybe replace with images once added
    if (this.type == 0) {
      rarityColourPicker(sItems[this.id].rarity, 255)
    }
    if (this.type == 1) {
      rarityColourPicker(spItems[this.id].rarity, 255)
    }
    rect(this.x, this.y, 10, 10)
  }
  interact(iPlayer) {
    if (stageObjective.id == 2) { //update plunder objective progress
      stageObjective.progress++
    }
    if (this.type == 0) {//type 0 standard, type 1 special
      //apply stat changes
      iPlayer.atk += sItems[this.id].atk
      iPlayer.def += sItems[this.id].def
      iPlayer.maxhp += sItems[this.id].maxhp
      iPlayer.atkSpeed -= sItems[this.id].atkspd
      iPlayer.sItemsLooted++
      items.splice(items.indexOf(this), 1)
      //for HUD pop-up
      itemDisp.start = millis() + 2000
      itemDisp.end = millis() + 3000
      itemDisp.text = sItems[this.id].name
      itemDisp.rarity = sItems[this.id].rarity
      itemDisp.desc = sItems[this.id].desc
    }
    if (this.type == 1) {
      //for HUD pop-up
      itemDisp.start = millis() + 2000
      itemDisp.end = millis() + 3000
      itemDisp.text = spItems[this.id].name
      itemDisp.rarity = spItems[this.id].rarity
      itemDisp.desc = spItems[this.id].shortdesc
      //create new item in appropriate player array based on ID
      //RiposteChip Series
      if (this.id == 0) {
        iPlayer.whenHitItems.push(new RiposteChip(0.25, this.id))
      }
      else if (this.id == 1) {
        iPlayer.whenHitItems.push(new RiposteChip(0.5, this.id))
      }
      else if (this.id == 2) {
        iPlayer.whenHitItems.push(new RiposteChip(1, this.id))
      }
      //ThornsChip Series
      else if (this.id == 3) {
        iPlayer.whenHitItems.push(new ThornsChip(0.25, this.id))
      }
      else if (this.id == 4) {
        iPlayer.whenHitItems.push(new ThornsChip(0.5, this.id))
      }
      else if (this.id == 5) {
        iPlayer.whenHitItems.push(new ThornsChip(1, this.id))
      }
      //DampingChip Series
      else if (this.id == 6) {
        iPlayer.whenHitItems.push(new DampingChip(0.1, this.id))
      }
      else if (this.id == 7) {
        iPlayer.whenHitItems.push(new DampingChip(0.25, this.id))
      }
      else if (this.id == 8) {
        iPlayer.whenHitItems.push(new DampingChip(0.5, this.id))
      }
      //VampireChip Series
      else if (this.id == 9) {
        iPlayer.onHitItems.push(new VampireChip(5, this.id))
      }
      else if (this.id == 10) {
        iPlayer.onHitItems.push(new VampireChip(10, this.id))
      }
      else if (this.id == 11) {
        iPlayer.onHitItems.push(new VampireChip(20, this.id))
      }
      //VampireModule Series
      else if (this.id == 12) {
        iPlayer.onKillItems.push(new VampireModule(0.25, this.id))
      }
      else if (this.id == 13) {
        iPlayer.onKillItems.push(new VampireModule(0.5, this.id))
      }
      //Response Series
      else if (this.id == 14) {
        iPlayer.whenHitConditional.push(new FlightResponse(this.id))
      }
      else if (this.id == 15) {
        iPlayer.whenHitConditional.push(new FightResponse(this.id))
      }
      items.splice(items.indexOf(this), 1)
    }
  }
}
//standard items
var sItems = []
//Assault Module series (ATK UP)
sItems[0] = { name: "Broken Assault Module", atk: 5, def: 0, maxhp: 0, atkspd: 0, rarity: "Common", desc: "ATK UP +5" }
sItems[1] = { name: "Worn Assault Module", atk: 10, def: 0, maxhp: 0, atkspd: 0, rarity: "Rare", desc: "ATK UP +10" }
sItems[2] = { name: "New Assault Module", atk: 15, def: 0, maxhp: 0, atkspd: 0, rarity: "Epic", desc: "ATK UP +15" }
sItems[3] = { name: "Modded Assault Module", atk: 20, def: 0, maxhp: 0, atkspd: 0, rarity: "Legendary", desc: "ATK UP +20" }
//Armour Plate series (DEF UP)
sItems[4] = { name: "Broken Armour Plate", atk: 0, def: 1, maxhp: 0, atkspd: 0, rarity: "Common", desc: "DEF UP +1" }
sItems[5] = { name: "Worn Armour Plate", atk: 0, def: 5, maxhp: 0, atkspd: 0, rarity: "Rare", desc: "DEF UP +5" }
sItems[6] = { name: "New Armour Plate", atk: 0, def: 10, maxhp: 0, atkspd: 0, rarity: "Epic", desc: "DEF UP +10" }
sItems[7] = { name: "Reinforced Armour Plate", atk: 0, def: 15, maxhp: 0, atkspd: 0, rarity: "Legendary", desc: "DEF UP +15" }
//Heart Container series (HP UP)
sItems[8] = { name: "Broken Heart Container", atk: 0, def: 0, maxhp: 5, atkspd: 0, rarity: "Common", desc: "HP UP +5" }
sItems[9] = { name: "Worn Heart Container", atk: 0, def: 0, maxhp: 10, atkspd: 0, rarity: "Rare", desc: "HP UP +10" }
sItems[10] = { name: "New Heart Container", atk: 0, def: 0, maxhp: 15, atkspd: 0, rarity: "Epic", desc: "HP UP +15" }
sItems[11] = { name: "Infused Heart Container", atk: 0, def: 0, maxhp: 20, atkspd: 0, rarity: "Legendary", desc: "HP UP +20" }
//Besieger Module series (ATK UP, ATKSPD DOWN)
sItems[12] = { name: "Worn Besieger Module", atk: 15, def: 0, maxhp: 0, atkspd: -10, rarity: "Rare", desc: "ATK UP +15, ATKSPD DOWN -10" }
sItems[13] = { name: "New Besieger Module", atk: 25, def: 0, maxhp: 0, atkspd: -10, rarity: "Epic", desc: "ATK UP +25, ATKSPD DOWN -10" }
sItems[14] = { name: "Amped Besieger Module", atk: 50, def: 0, maxhp: 0, atkspd: -10, rarity: "Legendary", desc: "ATK UP +50, ATKSPD DOWN -10" }
//Loader Joint series (ATKSPD UP)
sItems[15] = { name: "Worn Loader Joint", atk: 0, def: 0, maxhp: 0, atkspd: 5, rarity: "Rare", desc: "ATKSPD UP +5" }
sItems[16] = { name: "New Loader Joint", atk: 0, def: 0, maxhp: 0, atkspd: 10, rarity: "Epic", desc: "ATKSPD UP +10" }
sItems[17] = { name: "Swift Loader Joint", atk: 0, def: 0, maxhp: 0, atkspd: 15, rarity: "Legendary", desc: "ATKSPD UP +15" }
//Berserker Module series (ATK UP, DEF DOWN)
sItems[18] = { name: "Worn Berserker Module", atk: 15, def: -10, maxhp: 0, atkspd: 0, rarity: "Rare", desc: "ATK UP +15, DEF DOWN -10" }
sItems[19] = { name: "New Berserker Module", atk: 25, def: -10, maxhp: 0, atkspd: 0, rarity: "Epic", desc: "ATK UP +25, DEF DOWN -10" }
sItems[20] = { name: "Heavy Berserker Module", atk: 50, def: -10, maxhp: 0, atkspd: 0, rarity: "Legendary", desc: "ATK UP +50, DEF DOWN -10" }

//Special Items
spItems = []
spItems[0] = { id: 0, rarity: "Rare", name: "Worn Riposte Chip", desc: "When Hit, deal 25% of ATK to the attacking enemy. 15-second cooldown.", shortdesc: "CounterAttack, ATK Scaling" }
spItems[1] = { id: 1, rarity: "Epic", name: "New Riposte Chip", desc: "When Hit, deal 50% of ATK to the attacking enemy. 15-second cooldown.", shortdesc: "CounterAttack, ATK Scaling" }
spItems[2] = { id: 2, rarity: "Legendary", name: "Vengeful Riposte Chip", desc: "When Hit, deal 100% of ATK to the attacking enemy. 15-second cooldown.", shortdesc: "CounterAttack, ATK Scaling" }

spItems[3] = { id: 3, rarity: "Rare", name: "Worn Thorns Chip", desc: "When Hit, damage the attacking enemy with 25% of DEF. 10-second cooldown.", shortdesc: "CounterAttack, DEF Scaling" }
spItems[4] = { id: 4, rarity: "Epic", name: "New Thorns Chip", desc: "When Hit, damage the attacking enemy with 50% of DEF. 10-second cooldown.", shortdesc: "CounterAttack, DEF Scaling" }
spItems[5] = { id: 5, rarity: "Legendary", name: "Sharp Thorns Chip", desc: "When Hit, damage the attacking enemy with 100% of DEF. 10-second cooldown.", shortdesc: "CounterAttack, DEF Scaling" }

spItems[6] = { id: 6, rarity: "Rare", name: "Worn Damping Chip", desc: "When Hit, reduce incoming damage by 10%. 30-second cooldown.", shortdesc: "Reduce Incoming Damage" }
spItems[7] = { id: 7, rarity: "Epic", name: "New Damping Chip", desc: "When Hit, reduce incoming damage by 25%. 30-second cooldown.", shortdesc: "Reduce Incoming Damage" }
spItems[8] = { id: 8, rarity: "Legendary", name: "Critical Damping Chip", desc: "When Hit, reduce incoming damage by 50%. 30-second cooldown.", shortdesc: "Reduce Incoming Damage" }

spItems[9] = { id: 9, rarity: "Rare", name: "Worn Vampire Chip", desc: "On Hit, heal 5HP. 5-second cooldown", shortdesc: "Heal on Hit" }
spItems[10] = { id: 10, rarity: "Epic", name: "New Vampire Chip", desc: "On Hit, heal 10HP. 5-second cooldown", shortdesc: "Heal on Hit" }
spItems[11] = { id: 11, rarity: "Legendary", name: "Frenzied Vampire Chip", desc: "On Hit, heal 20HP. 5-second cooldown", shortdesc: "Heal on Hit" }

spItems[12] = { id: 12, rarity: "Epic", name: "New Vampire Module", desc: "On kill, restore 25% of MaxHP. 10-second cooldown", shortdesc: "Heal on Kill" }
spItems[13] = { id: 13, rarity: "Legendary", name: "Bloody Vampire Module", desc: "On kill, restore 50% of MaxHP. 10-second cooldown", shortdesc: "Heal on Kill" }

spItems[14] = { id: 14, rarity: "Legendary", name: "'The Flight Response'", desc: "When Hit for >25% of MaxHP, increase MoveSpeed by 25% for 10 seconds. 60-second cooldown.", shortdesc: "Speedboost on Heavy Hit" }
spItems[15] = { id: 15, rarity: "Legendary", name: "'The Fight Response'", desc: "When Hit for >25% of MaxHP, increase ATK by 100% for 10 seconds. 60-second cooldown.", shortdesc: "ATKBoost on Heavy Hit" }


//Riposte Chip (CounterAttack, ATK Scaling)
class RiposteChip {//IDs 0,1,2
  constructor(scaling, id) {
    this.scaling = scaling //either 0.25, 0.5 or 1
    this.timer = millis()
    this.id = id
  }
  check(atk, def, enemy, player) {
    if (millis() >= this.timer && enemies.includes(enemy)) {
      enemies[enemies.indexOf(enemy)].hp -= this.scaling * atk
      this.timer = millis() + 15000
    }
  }
}
//Thorns Chip (CounterAttack, DEF Scaling)
class ThornsChip {//IDs 3,4,5
  constructor(scaling, id) {
    this.scaling = scaling //0.25, 0.5 or 1
    this.timer = millis()
    this.id = id
  }
  check(atk, def, enemy, player) {
    if (millis() >= this.timer && enemies.includes(enemy)) {
      enemies[enemies.indexOf(enemy)].hp -= this.scaling * def
      this.timer = millis() + 10000
    }
  }
}
//Damping Chip (Damage Reductions)
class DampingChip {//IDs 6,7,8
  constructor(scaling, id) {
    this.scaling = scaling //0.1, 0.25 or 0.5
    this.timer = millis()
    this.id = id
  }
  check(atk, def, enemy, player) {
    if (millis() >= this.timer) {
      console.log("dampened")
      player.incDMG = (1 - this.scaling) * player.incDMG
      this.timer = millis() + 30000
    }
  }
}

//Vampire Chip (Health on Hit)
class VampireChip {//IDs 9, 10 ,11
  constructor(scaling, id) {
    this.scaling = scaling //5, 10 or 20
    this.timer = millis()
    this.id = id
  }
  check(player) {
    if (millis() >= this.timer) {
      player.hp += this.scaling
      if (player.hp > player.maxhp) {
        player.hp = player.maxhp
      }
      this.timer = millis() + 5000
    }
  }
}

//Vampire Module (Health on Kill)
class VampireModule {
  constructor(scaling, id) {
    this.scaling = scaling //0.25 or 0.5
    this.timer = millis()
    this.id = id
  }
  check(player) {
    if (millis() >= this.timer) {
      console.log("health restored")
      player.hp += this.scaling * player.maxhp
    }
    if (player.hp > player.maxhp) {
      player.hp = player.maxhp
    }
    this.timer = millis() + 10000
  }
}

//Response Serires (Funny Gaming)
class FlightResponse { //increase movespeed
  constructor(id) {
    this.timer = millis()
    this.endTime = millis()
    this.statchange = 0
    this.active = false
    this.id = id
  }
  check(player) {
    if (this.timer <= millis()) { //activation check
      if (player.incDMG >= (player.maxhp * 0.25)) {
        this.statchange = (player.moveSpeed * 1.25) - player.moveSpeed
        player.moveSpeed = player.moveSpeed * 1.25
        this.active = true
        this.endTime = millis() + 10000
        this.timer = millis() + 60000
      }
    }
  }
  update(player) {
    if (this.endTime <= millis() && this.active) { //duration check
      player.moveSpeed -= this.statchange
      this.active = false
    }
  }
}

class FightResponse { //increase attack greatly
  constructor(id) {
    this.timer = millis()
    this.endTime = millis()
    this.statchange = 0
    this.active = false
    this.id = id
  }
  check(player) {
    if (this.timer <= millis()) {
      if (player.incDMG >= (player.maxhp * 0.25)) {
        this.statchange = (player.atk * 2) - player.atk
        player.atk = player.atk * 2
        this.active = true
        this.endTime = millis() + 10000
        this.timer = millis() + 60000
      }
    }
  }

  update(player) {
    if (this.endTime <= millis() && this.active) {
      player.atk -= this.statchange
      this.active = false
    }
  }
}