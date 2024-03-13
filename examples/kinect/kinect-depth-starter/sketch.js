

// Declare kinectron
let kinectron;

function setup() {
  // Create a p5 canvas
  createCanvas(500, 500);

  // Set background color
  background(255);

  // Initialize Kinectron
  initKinectron();
}

function draw() {

}

function initKinectron() {
  // Define and create an instance of kinectron
  kinectron = new Kinectron("192.168.0.58");

  // Set Kinect type to windows
  kinectron.setKinectType("azure");

  // Connect with server over peer
  kinectron.makeConnection();

  kinectron.startDepth(drawDepth);
}

// The incoming "body" argument holds the Kinect skeleton data
function drawDepth(img) {
  // Clear the background
  clear();
  console.log(img);

  loadImage(img.src, function (depthImage) {

    //console.log(depthImage);

    // depthImage.loadPixels();

    


    // if (depthImage.pixels.length > 0) {
    //   for (let y = 0; y < depthImage.height; y++) {
    //     for (let x = 0; x < depthImage.width; x++) {
    //       const index = (x + y * depthImage.width) / 4;

    //       const r = depthImage.pixels[index]
    //       const g = depthImage.pixels[index + 1]
    //       const b = depthImage.pixels[index + 2]

    //       const brightness = (r + g + b) / 3;

    //       // console.log(brightness);

    //       depthImage.pixels[index] = 0
    //       depthImage.pixels[index + 1] = 0
    //       depthImage.pixels[index + 2] = 0

    //       // if (brightness > 100 && brightness < 200) {
    //       //   depthImage.pixels[index] = 255
    //       //   depthImage.pixels[index + 1] = 0
    //       //   depthImage.pixels[index + 2] = 0
    //       // }
    //     }
    //   }
    //   depthImage.updatePixels();
    //   image(depthImage, 0, 0);
    // }
  });


}