// Webcam Setup Canvas Responsive
// Create a webcam feed and draw it OVER the Canvas, and make it fullscreen/responsive. All the responsiveness is handled inside CSS

const cam_w = 640;
const cam_h = 480;
let capture;

function setup() {
    createCanvas(cam_w, cam_h);
    capture = createCapture(VIDEO);
    capture.size(cam_w, cam_h);
}

function draw() {
    clear(); // clear the canvas before drawing content
    
    fill(255, 0, 0, 127);
    noStroke();
    rect(0, 0, width/2, height/2);
}