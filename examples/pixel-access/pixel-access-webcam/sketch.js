// Pixel Access Webcam

const cam_w = 640;
const cam_h = 480;
let capture;

function setup() {
    createCanvas(cam_w, cam_h*2);
    capture = createCapture(VIDEO);
    capture.size(cam_w, cam_h);
    capture.hide();
}

function draw() {
    
    capture.loadPixels();

    // draw the original webcam feed
    image(capture, 0, 0);

    for(let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {

            const index = (x + y * width) * 4;
            const rVal = capture.pixels[index];
            const gVal = capture.pixels[index+1];
            const bVal = capture.pixels[index+2];

            capture.pixels[index] = gVal;
            capture.pixels[index+1] = bVal;
            capture.pixels[index+2] = rVal;
        }
    }

    capture.updatePixels();

    // draw the updated webcam feed
    image(capture, 0, height/2);    
}