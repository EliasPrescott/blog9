function setup() {
  createCanvas(1920, 1080);
}

function draw() {
  background(255)
  textSize(height)
  const bounds = textBounds('λ', 0, 0)
  text('λ', width/2 - bounds.w/2, height/2 + bounds.h/2)
  textSize(height/4)
  text('👀', width*0.4, height*.3)
}
