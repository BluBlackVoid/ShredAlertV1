const layoutCellSize = 600
const tileCellSize = layoutCellSize / 12
let layouts = []
let tiles = []
var currentmap
var navmap
var exitRegionX
var exitRegionY

// 1 represents a null tile (out of bounds)(make a massive obstacle here to prevent movement)
// 0 represents a normal tile
// make more tiles types later
layouts[0] = [
  [1, 0, 0, 0, 1],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [1, 0, 0, 0, 1]
];
layouts[1] = [
  [1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0],
  [1, 0, 1, 0, 1],
]
layouts[2] = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [1, 0, 0, 1],
  [1, 0, 0, 1],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]
layouts[3] = [
  [0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0],
]
tiles[0] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
tiles[1] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
tiles[2] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
tiles[3] = [
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
];
tiles[4] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
class Node { // nodes for pathfinding
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.wall = false;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbours = [];
    this.prev = null;
  }
  addNeighbours() {// add neighbouring nodes
    var y = Math.floor(this.y)
    var x = Math.floor(this.x)
    if (y < navmap.length - 1) {
      this.neighbours.push(navmap[y + 1][x])
    }
    if (y > 0) {
      this.neighbours.push(navmap[y - 1][x])
    }
    if (x < navmap[0].length - 1) {
      this.neighbours.push(navmap[y][x + 1])
    }
    if (x > 0) {
      this.neighbours.push(navmap[y][x - 1])
    }
  }
}

function levelGen() { //selects layout, fills tiles
  currentmap = layouts[Math.floor(Math.random() * layouts.length)]
  for (let r = 0; r < currentmap.length; r++) {
    for (let c = 0; c < currentmap[0].length; c++) {
      if (currentmap[r][c] != 1) {
        currentmap[r][c] = tiles[Math.floor(Math.random() * tiles.length)]
      }
    }
  }
  //creating and storing exit region co-ordinates
  let valid = false
  while (!valid) { //select random tile until valid
    let randR = Math.floor(Math.random() * currentmap.length)
    let randC = Math.floor(Math.random() * currentmap[0].length)
    if (currentmap[randR][randC] != 1) {
      exitRegionX = randC * layoutCellSize
      exitRegionY = randR * layoutCellSize
      valid = true
    }
  }
}

function leveldraw() {//creates obstacles
  //loop through arrays, create obstacles in where there is a 1
  for (let mapr = 0; mapr < currentmap.length; mapr++) {
    for (let mapc = 0; mapc < currentmap[0].length; mapc++) {
      if (currentmap[mapr][mapc] == 1) {
        obstacles.push(new Rock(mapc * layoutCellSize, mapr * layoutCellSize, layoutCellSize, layoutCellSize))
      }
      else {
        let currenttile = currentmap[mapr][mapc]
        for (let tiler = 0; tiler < 12; tiler++) {
          for (let tilec = 0; tilec < 12; tilec++) {
            if (currenttile[tiler][tilec] == 1) {
              obstacles.push(new Rock(tilec * tileCellSize + mapc * layoutCellSize, tiler * tileCellSize + mapr * layoutCellSize, tileCellSize, tileCellSize))
            }
          }
        }
      }
    }
  }
}

function genNavMap() {// makes navmap for pathfinding
  var maprows = currentmap[0].length
  var mapcols = currentmap.length
  navmap = new Array(mapcols)
  // generates completely empty map the same size as the actual map
  for (var i = 0; i < mapcols * 12; i++) {
    navmap[i] = new Array(maprows * 12)
  }
  // every node becomes an object
  for (let r = 0; r < currentmap.length * 12; r++) {
    for (let c = 0; c < currentmap[0].length * 12; c++) {
      navmap[r][c] = new Node(c, r)
    }
  }
  // refers to 'currentmap' to fill a 12x12 section where there is a 1's in 'currentmap' array
  for (let r1 = 0; r1 < currentmap.length; r1++) {
    for (let c1 = 0; c1 < currentmap[0].length; c1++) {
      if (currentmap[r1][c1] == 1) {
        for (let r2 = 0; r2 < 12; r2++) {
          for (let c2 = 0; c2 < 12; c2++) {
            navmap[r2 + (r1 * 12)][c2 + (c1 * 12)].wall = true
          }
        }
      }
    }
  }
  //refers to 'obstacles' to covert obstacles positions into grid co-ordinates
  for (o in obstacles) {
    var gridx = 0
    var gridy = 0
    gridx = obstacles[o].x / tileCellSize
    gridy = obstacles[o].y / tileCellSize
    navmap[gridy][gridx].wall = true
  }

  for (let r = 0; r < currentmap.length * 12; r++) {
    for (let c = 0; c < currentmap[0].length * 12; c++) {
      navmap[r][c].addNeighbours()
    }
  }
}

class Rock { //Obstructs movement and shooting
  constructor(x, y, w, l) {
    this.x = x
    this.y = y
    this.l = l
    this.w = w
  }
  render() {
    fill("White")
    rect(this.x, this.y, this.w, this.l)
  }
}