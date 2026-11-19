function setup() {
  createCanvas(1920, 1080)
}

function draw() {
  background(255)
  strokeWeight(16)
  fill('transparent')
  const startAngle = -PI
  const iterations = 32
  const iterAngle = TAU/iterations
  const centerX = width/2
  const centerY = height/2
  for (let i = 0; i < iterations; i++) {
    const angle = startAngle + iterAngle * i
    const innerRad = 400
    const outerRad = 500
    const x0 = centerX + innerRad * cos(angle)
    const y0 = centerY + innerRad * sin(angle)
    const x1 = centerX + outerRad * cos(angle+iterAngle)
    const y1 = centerY + outerRad * sin(angle-iterAngle)
    bezier(x0, y0, x1, y1, x1, y1, x1, y1)
  }
}

function keyPressed() {
  if (key === 's') {
    save('cover')
  }
}
