// paste the url of the model you trained in teachablemachine here
let URL = "https://teachablemachine.withgoogle.com/models/kBXK62B00/";
let modelURL = URL + "model.json";
let metadataURL = URL + "metadata.json";

let model, webcam, ctx, labelContainer, sortedPrediction, maxPredictions, pose, posenetOutput;

const cam_w = 640;
const cam_h = 480;

async function setup() {
  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // Note: the pose library adds 'tmPose' object to your window (window.tmPose)
  model = await tmPose.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  document.getElementById("status").innerHTML = "Setting up camera";

  // Convenience function to setup a webcam

  const flip = true; // whether to flip the webcam
  webcam = new tmPose.Webcam(cam_w, cam_h, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop1);

  // append/get elements to the DOM
  const canvas = document.getElementById("canvas");
  canvas.width = cam_w;
  canvas.height = cam_h;
  ctx = canvas.getContext("2d");
  createCanvas(cam_w, cam_h);
  
  document.getElementById("status").innerHTML = "Ready";
}


function draw() {
  clear();
  // ellipse(width / 2, height / 2, 200, 200);
  
  if(sortedPrediction) {
    // do stuff with the predictions
    textSize(100)
    textAlign(CENTER)
    text(sortedPrediction[0].className, width/2, height/2)
  }

  if (pose) {
    pose.keypoints.forEach((keypoint) => {
      // console.log(keypoint);
      ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
    });
  }
}

async function loop1(timestamp) {
  webcam.update(); // update the webcam frame
  pose = await predict();
  window.requestAnimationFrame(loop1);
}

async function predict() {
  // Prediction #1: run input through posenet
  // estimatePose can take in an image, video or canvas html element
  const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
  // Prediction 2: run input through teachable machine classification model
  const prediction = await model.predict(posenetOutput);
  sortedPrediction = prediction.sort((a, b) => -a.probability + b.probability);
  //console.log(prediction)

  drawVideo()
  return pose;
}

function drawVideo() {
  if (webcam.canvas) {
    ctx.drawImage(webcam.canvas, 0, 0);
  }
}
