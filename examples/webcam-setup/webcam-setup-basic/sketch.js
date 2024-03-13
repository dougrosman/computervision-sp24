// Webcam Basic
// Create a webcam feed and nothing else (not even the p5.js canvas)

const cam_w = 640;
const cam_h = 480;
let capture;

function setup() {
    capture = createCapture(VIDEO);
    capture.size(cam_w, cam_h);
    noCanvas();
}