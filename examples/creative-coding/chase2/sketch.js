let birds = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  for(let i = 0; i < 200; i++) {
    birds.push(new Bird(random(width), random(height)));
  }
}

function draw() {
  background(100);

  const mousePos = createVector(mouseX, mouseY);

  for(let i = 0; i < birds.length-1; i++) {
    const birb = birds[i];
    if(i == 0) {
      birb.chase(mousePos);
    } else {
      birb.chase(birds[i-1].pos)
    }
    birb.draw();
  }
  

}

class Bird {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.speed = 0.05;
    this.angle = 0;
  }

  chase(chasePos) {
    this.pos = p5.Vector.lerp(this.pos, chasePos, this.speed);
    this.angle = atan2(chasePos.y - this.pos.y, chasePos.x - this.pos.x);
  }

  draw() {

    push()
    translate(this.pos.x, this.pos.y);
    rotate(this.angle + PI / 2);
    triangle(0, -10, -5, 10, 5, 10)
    pop()
  }
}