function setup() {
  createCanvas(1920, 1080)
}

function draw() {
  background(255)
  strokeWeight(2)
  fill('transparent')
  const startAngle = -PI
  const iterations = 100
  const iterAngle = TAU/iterations
  const centerX = width/2
  const centerY = height/2
  for (let i = 0; i < iterations; i++) {
    const angle = startAngle + iterAngle * i
    const innerRad = 100
    const outerRad = 500
    const x0 = centerX + innerRad * cos(angle)
    const y0 = centerY + innerRad * sin(angle)
    const x1 = centerX + outerRad * cos(angle)
    const y1 = centerY + outerRad * sin(angle)
    const xDiff = x1 - x0
    const yDiff = y1 - y0
    const upperX = x0 + xDiff*2
    const upperY = y0 + yDiff*0.5
    line(x0, y0, x1, y1)
    bezier(x0, y0, upperX, upperY, x1, y1, x1, y1)
  }
}
