// Text Rain

const cam_w = 640;
const cam_h = 480;
let capture;
const phrase = "please catch me, i'm falling down!"
let fallingLetters = [];

function setup() {
    createCanvas(cam_w, cam_h);
    capture = createCapture(VIDEO);
    capture.size(cam_w, cam_h);

    for(let i = 0; i < phrase.length; i++) {
        const fontSize = 20;
        const letter = phrase[i];
        const position = createVector(i * fontSize, 0);
        fallingLetters.push(new FallingLetter(letter, position, fontSize));
    }
}

function draw() {
    clear();

    capture.loadPixels();

    fallingLetters.forEach(fallingLetter => {

        while (isLetterTouchingDarkSurface(fallingLetter)
            && fallingLetter.position.y > 0
            && fallingLetter.position.y < height) {

            fallingLetter.position.y--;
        }

        fallingLetter.update();
        fallingLetter.draw();
    })
}

function isLetterTouchingDarkSurface(fl) {

    const threshold = 80;
    const mirrorX = width-fl.position.x

    const index = (mirrorX + fl.position.y * cam_w) * 4;
    const r = capture.pixels[index]
    const g = capture.pixels[index+1]
    const b = capture.pixels[index+2]

    const brightness = floor((r + g + b) / 3)

    if(brightness > threshold) {
        return false;
    }
    return true;    
}


class FallingLetter {
    constructor(letter, position, fontSize) {
        this.letter = letter;
        this.position = position;
        this.fallRate = 2;
        this.fontSize = fontSize;
    }

    update() {
        if(this.position.y > height+this.fontSize) {
            this.position.y = 0;
        }

        this.position.y+=this.fallRate;
    }

    draw() {
        fill(255);
        textSize(this.fontSize);
        text(this.letter, this.position.x, this.position.y);
    }
}