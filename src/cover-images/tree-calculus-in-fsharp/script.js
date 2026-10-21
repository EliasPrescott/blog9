let centerX
let centerY
let halfSideLen

function setup() {
  createCanvas(1920, 1080);
  centerX = width/2
  centerY = height/2
  halfSideLen = min(width, height) * 0.2
}

function tri(x, y) {
  const xOffset = x*halfSideLen*2
  const yOffset = y*halfSideLen*2
  triangle(
    centerX-halfSideLen+xOffset, centerY+halfSideLen+yOffset,
    centerX+xOffset, centerY-halfSideLen+yOffset,
    centerX+halfSideLen+xOffset, centerY+halfSideLen+yOffset,
  )
}

function draw() {
  background(255);

  strokeWeight(12)
  fill(0)
  tri(-0.75, -.5)

  fill(0)
  tri(0.75, -.5)
  fill('transparent')
  tri(1.25, .5)
}
