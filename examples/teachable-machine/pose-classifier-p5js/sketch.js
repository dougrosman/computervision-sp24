// adapted from this sketch by "dano" https://editor.p5js.org/dano/sketches/JyMm6GiEk


const modelURL = 'https://teachablemachine.withgoogle.com/models/oO-VavFhR/';
// the json file (model topology) has a reference to the bin file (model weights)
const checkpointURL = modelURL + "model.json";
// the metatadata json file contains the text labels of your model and additional information
const metadataURL = modelURL + "metadata.json";


const flip = true; // whether to flip the webcam

let model;
let totalClasses;
let myCanvas;

let classification = "None Yet";
let probability = "100";
let poser;
let capture;

const cam_w = 320;
const cam_h = 240;


// A function that loads the model from the checkpoint
async function load() {
  model = await tmPose.load(checkpointURL, metadataURL);
  totalClasses = model.getTotalClasses();
  console.log("Number of classes, ", totalClasses);
}


async function setup() {
  myCanvas = createCanvas(cam_w, cam_h);
  // Call the load function, wait until it finishes loading

  await load();
  capture = createCapture(VIDEO, captureReady);
  capture.size(cam_w, cam_h);

}

function draw() {
  clear();
  fill(255,0,0)
  textSize(18);
  text("Result:" + classification, 10, 40);

  text("Probability:" + probability, 10, 20)

  textSize(8);
  if (poser) { //did we get a skeleton yet;
    for (var i = 0; i < poser.length; i++) {
      let x = poser[i].position.x;
      let y = poser[i].position.y;
      ellipse(x, y, 5, 5);
      text(poser[i].part, x + 4, y);
    }
  }

}

function captureReady() {
  console.log("Capture Ready");
  predict();
}


async function predict() {
  // Prediction #1: run input through posenet
  // predict can take in an image, video or canvas html element
  const flipHorizontal = flip;
  const {
    pose,
    posenetOutput
  } = await model.estimatePose(
    capture.elt, //webcam.canvas,
    flipHorizontal
  );
  // Prediction 2: run input through teachable machine assification model
  const prediction = await model.predict(
    posenetOutput,
    flipHorizontal,
    totalClasses
  );

  // console.log(prediction);
  
  // Sort prediction array by probability
  // So the first classname will have the highest probability
  const sortedPrediction = prediction.sort((a, b) => -a.probability + b.probability);

  //communicate these values back to draw function with global variables
  classification = sortedPrediction[0].className;
  probability = sortedPrediction[0].probability.toFixed(2);
  if (pose) poser = pose.keypoints; // is there a skeleton
  predict();
}