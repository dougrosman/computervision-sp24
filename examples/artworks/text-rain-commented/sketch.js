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

    // fill an array with FallingLetters
    for(let i = 0; i < phrase.length; i++) {
        const fontSize = 20;
        const letter = phrase[i];
        const position = createVector(i * fontSize, 0);
        fallingLetters.push(new FallingLetter(letter, position, fontSize));
    }
}

function draw() {
    clear(); // clear the canvas before drawing content

    capture.loadPixels();

    // for each of the falling letters...
    fallingLetters.forEach(fallingLetter => {

        // check the brightness of the video pixel at the position of falling letter
        // also check that the falling letter is visible on the canvas.
        // as long as the falling letter is touching a dark pixel, move it up
        // the while loop is important here. it makes sure that a letter can move up
        // continuously until it satisfies the conditions of the while loop. Try swapping out 'while' with 'if' to see the difference. An if-statement will only happen once per frame for each letter, but a while loop will keep executing as many times as it needs to until the condition is satisfied before moving on to the next letter.
        while (isLetterTouchingDarkSurface(fallingLetter)
            && fallingLetter.position.y > 0
            && fallingLetter.position.y < height) {

            fallingLetter.position.y--;
        }

        // move the falling letter down the screen
        fallingLetter.update();

        // draw the falling letter to the canvas
        fallingLetter.draw();
    })
}

// checks the brightness of a video pixel at the location of a falling letter. If the pixel at that location is darker than a threshold value we set, then the letter shouldn't fall past it.
function isLetterTouchingDarkSurface(fl) {

    // set the threshold higher or lower to change the sensitivity of your letters
    // the lower the threshold, the darker the surface must be to stop a letter.
    const threshold = 80;

    // although the camera feed appears mirrored because we're flipping it in CSS, the feed itself is actually not mirrored. Since we're using the feed to compare pixel values, we have to flip the x-position to its mirrored version.
    const mirrorX = width-fl.position.x

    // get the video's pixel information at the position of the falling letter
    const index = (mirrorX + fl.position.y * cam_w) * 4;
    const r = capture.pixels[index]
    const g = capture.pixels[index+1]
    const b = capture.pixels[index+2]

    // calculate the pixel brightness by finding the average of the three channels
    const brightness = floor((r + g + b) / 3)

    // if the pixel is bright, keep falling
    if(brightness > threshold) {
        return false;
    }
    // stop falling
    return true;    
}

// A FallingLetter is an object that contains a letter, a position, a fallRate and a fontSize

class FallingLetter {
    constructor(letter, position, fontSize) {
        this.letter = letter;
        this.position = position;
        this.fallRate = 2;
        this.fontSize = fontSize;
    }

    // update the position of the falling letter on the screen
    update() {
        // if the letter has reached the bottom of the window, bring it back to the top
        if(this.position.y > height+this.fontSize) {
            this.position.y = 0;
        }

        // make the letter fall by increase its y-value
        this.position.y+=this.fallRate;
    }

    // draw the falling letter to the canvas
    draw() {
        fill(255);
        textSize(this.fontSize);
        text(this.letter, this.position.x, this.position.y);
    }
}