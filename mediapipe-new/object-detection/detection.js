// https://developers.google.com/mediapipe/solutions/vision/object_detector/web_js
// original demo: https://codepen.io/mediapipe-preview/pen/vYrWvNg

import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

const { ObjectDetector, FilesetResolver, ObjectDetectionResult } = vision;

let objectDetector;
let results;
let runningMode = "VIDEO";
let observers = [];

const w = 640;
const h = 360;
video.style.width = w + "px";
video.style.height = h + "px";
video.setAttribute("width", w);
video.setAttribute("height", h);

async function createObjectDetector() {
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  objectDetector = await ObjectDetector.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite`,
      delegate: "GPU",
    },
    maxResults: -1, // set to -1 to grab all results 
    scoreThreshold: .5,
    runningMode: runningMode,
  });

  console.log(objectDetector)
  enableCam();
}

createObjectDetector();

// Check if webcam access is supported.
function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// Check if webcam is supported
if (!hasGetUserMedia()) {
  alert("No webcam detected");
}

// Enable the live webcam view and start detection.
function enableCam() {
  if (!objectDetector) {
    console.log("Wait! object detector not loaded yet.");
    return;
  }

  // getUsermedia parameters.
  const constraints = {
    video: {
      width: { ideal: w },
      height: { ideal: h },
    },
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;
    video.addEventListener("loadeddata", predictWebcam);
  });
}

let lastVideoTime = -1;
results = undefined;

async function predictWebcam() {
  let startTimeMs = performance.now();
  if (lastVideoTime !== video.currentTime) {
    lastVideoTime = video.currentTime;
    results = objectDetector.detectForVideo(video, startTimeMs);

    if (results.detections.length > 0) {
      notifyObservers(results);
    }
  }

  // Call this function again to keep predicting when the browser is ready.

  window.requestAnimationFrame(predictWebcam);
}

// Function to notify all observers about new results
function notifyObservers(newResults) {
  observers.forEach((observer) => observer(newResults));
}

// Allow other parts of the application to subscribe to results updates
export function subscribeToResults(observer) {
  observers.push(observer);
}

export { w, h };
