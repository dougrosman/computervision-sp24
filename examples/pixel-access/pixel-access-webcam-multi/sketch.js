// Pixel Access Webcam

const cam_w = 320;
const cam_h = 240;
let capture;
let capture1;
let capture2;
let capture3;

function setup() {
    createCanvas(cam_w*2, cam_h*2);
    capture = createCapture(VIDEO);
    capture.size(cam_w, cam_h);
    capture.hide();

    capture1 = createCapture(VIDEO);
    capture1.size(cam_w, cam_h);
    capture1.hide();

    capture2 = createCapture(VIDEO);
    capture2.size(cam_w, cam_h);
    capture2.hide();

    capture3 = createCapture(VIDEO);
    capture3.size(cam_w, cam_h);
    capture3.hide();
}

function draw() {
    
    capture.loadPixels();
    capture1.loadPixels();
    capture2.loadPixels();
    capture3.loadPixels();

    for(let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {

            const index = (x + y * width) * 4;
            const rVal = capture.pixels[index];
            const gVal = capture.pixels[index+1];
            const bVal = capture.pixels[index+2];

            capture1.pixels[index] = rVal;
            capture1.pixels[index+1] = 0;
            capture1.pixels[index+2] = 0;

            capture2.pixels[index] = 0;
            capture2.pixels[index+1] = gVal;
            capture2.pixels[index+2] = 0;

            capture3.pixels[index] = 0;
            capture3.pixels[index+1] = 0;
            capture3.pixels[index+2] = bVal;
        }
    }

    capture1.updatePixels();
    capture2.updatePixels();
    capture3.updatePixels();

    // mirror the webcam
    
    image(capture, 0, 0);
    image(capture1, width/2, 0);
    image(capture2, width/2, height/2);
    image(capture3, 0, height/2);
    
}