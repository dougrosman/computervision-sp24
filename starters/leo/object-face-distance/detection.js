// OBJECT DETECTION
// https://developers.google.com/mediapipe/solutions/vision/object_detector/web_js
// original demo: https://codepen.io/mediapipe-preview/pen/vYrWvNg

// FACE DETECTION
// https://developers.google.com/mediapipe/solutions/vision/face_detector/web_js
// original demo: https://codepen.io/mediapipe-preview/pen/OJByWQr

import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

const { ObjectDetector, FaceDetector, FilesetResolver, ObjectDetectionResult } = vision;

let objectDetector;
let faceDetector;
let objectResults;
let faceResults;
let runningMode = "VIDEO";
let observers = [];

const w = 640;
const h = 360;
video.style.width = w + "px";
video.style.height = h + "px";
video.setAttribute("width", w);
video.setAttribute("height", h);

async function createFaceObjectDetector() {
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  objectDetector = await ObjectDetector.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite`,
      delegate: "GPU",
    },
    maxResults: 1, // set to -1 to grab all results 
    scoreThreshold: 0.05,
    runningMode: runningMode,
    categoryAllowlist: ["toothbrush"],
  });

  faceDetector = await FaceDetector.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
      delegate: "GPU",
    },
    minDetectionConfidence: 0.5,
    minSuppressionThreshold: 0.3,
    runningMode: runningMode,
  });

  enableCam();
}

createFaceObjectDetector();

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
faceResults = undefined;
objectResults = undefined;

async function predictWebcam() {
  let startTimeMs = performance.now();
  if (lastVideoTime !== video.currentTime) {
    lastVideoTime = video.currentTime;
    objectResults = objectDetector.detectForVideo(video, startTimeMs);
    faceResults = faceDetector.detectForVideo(video, startTimeMs);

    if (faceResults.detections.length > 0) {
      notifyObservers(faceResults);
      //console.log("faces",faceResults)
    }

    if (objectResults.detections.length > 0) {
      notifyObservers(objectResults);
      //console.log("objects",objectResults)
    }
  }

  // Call this function again to keep predicting when the browser is ready.

  window.requestAnimationFrame(predictWebcam);
}

// Function to notify all observers about new results
function notifyObservers(newResults) {
  observers.forEach((observer) => observer(newResults));
  // console.log(observers.length)
}

// Allow other parts of the application to subscribe to results updates
export function subscribeToResults(observer) {
  observers.push(observer);
}

export { w, h };
