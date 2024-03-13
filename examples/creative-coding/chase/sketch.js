// atan2(), chase

let shapePos;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  shapePos = createVector(width / 2, height / 2);
}

function draw() {
  background(100);

  const mousePos = createVector(mouseX, mouseY);
  const angle = atan2(mousePos.y - shapePos.y, mousePos.x - shapePos.x);

  push()
  translate(shapePos.x, shapePos.y);
  rotate(angle + PI / 2);
  triangle(0, -20, -10, 20, 10, 20)
  pop()

  shapePos = p5.Vector.lerp(shapePos, mousePos, 0.05);

}
