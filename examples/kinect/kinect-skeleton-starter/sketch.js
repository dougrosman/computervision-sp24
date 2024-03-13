// Create a p5 canvas (learn more at p5js.org)
let myCanvas = null;

// Declare kinectron
let kinectron = null;

function setup() {
  // Create a p5 canvas
  createCanvas(500, 500);

  // Set background color
  background(0);

  // Initialize Kinectron
  initKinectron();
}

function initKinectron() {
  // Define and create an instance of kinectron
  kinectron = new Kinectron("192.168.0.58");

  // Set Kinect type to windows
  kinectron.setKinectType("azure");

  // Connect with server over peer
  kinectron.makeConnection();

  // Request all tracked bodies and pass data to your callback
  kinectron.startTrackedBodies(drawSkeleton);
}

// The incoming "body" argument holds the Kinect skeleton data
function drawSkeleton(body) {
  // Clear the background
  background(0);

  // console.log(body.skeleton.joints.length)

  // Draw a circle at the location of each joint
  for (let i = 0; i < body.skeleton.joints.length; i++) {
    // Get the joint
    let joint = body.skeleton.joints[i];

    // Set the drawing color
    fill(100);

    // Map Kinect joint data to canvas size; Draw the circle
    ellipse(
      joint.depthX * width,
      joint.depthY * height,
      15,
      15
    );
  }
}