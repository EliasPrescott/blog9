function setup() {
  createCanvas(1920, 1080);
}

function draw() {
  background(0)
  const steps = 100
  const size = min(width, height) / steps
  const xCount = width/size
  const yCount = height/size
  for (let x = 0; x < xCount; x++) {
    for (let y = 0; y < yCount; y++) {
      const z = (x * width + (x * (y+height*4) * 50)) % 255
      fill(0, z + x - 50, z/2 + y + 10)
      square(x*size, y*size, size, 0)
    }
  }
}
