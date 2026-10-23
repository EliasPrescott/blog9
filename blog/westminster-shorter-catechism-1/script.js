function setup() {
  createCanvas(1920, 1080);
}

function draw() {
  background(255);
  const circleX = width/2
  const circleY = height/2
  const innerRadius = min(width, height) * 0.25
  const outerRadius = min(width, height) * 0.4
  const steps = 12
  const startAngle = PI/2
  const stepAngle = TAU/steps
  const offset = 0

  circle(circleX, circleY, outerRadius)

  stroke(0)
  strokeWeight(12)
  for (let i = 0; i < steps; i++) {
    const angle = startAngle + i*stepAngle
    const x0 = circleX + (innerRadius + offset) * cos(angle)
    const y0 = circleY + (innerRadius + offset) * sin(angle)
    const x1 = circleX + (outerRadius + offset) * cos(angle)
    const y1 = circleY + (outerRadius + offset) * sin(angle)
    const cardinal = angle % (PI/2) === 0
    if (cardinal) {
      line(x0, y0, x1, y1)
    } else {
      const a0 = { x: circleX, y: circleY }
      const a1 = { x: x1, y: y0 }
      bezier(a0.x, a0.y, x0, y0, x1, y1, a1.x, a1.y);
    }
  }
}
