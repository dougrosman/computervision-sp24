// https://developers.google.com/mediapipe/solutions/vision/gesture_recognizer/web_js
// original demo: https://codepen.io/mediapipe-preview/pen/zYamdVd?editors=0010

import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

const { GestureRecognizer, FilesetResolver, DrawingUtils } = vision;

let gestureRecognizer;
let results;
let runningMode = "VIDEO";
let observers = [];

const w = 640;
const h = 360;
video.style.width = w + "px";
video.style.height = h + "px";
video.setAttribute("width", w);
video.setAttribute("height", h);

async function createHandLandmarker() {
  const filesetResolver = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
  gestureRecognizer = await GestureRecognizer.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task`,
      delegate: "GPU",
    },
    numHands: 4,
    minHandDetectionConfidence: 0.5,
    minHandPresenceConfidence: 0.5,
    minHandTrackingConfidence: 0.5,
    canned_gestures_classifier_options: -1,
    custom_gestures_classifier_options: 0,
    runningMode,
  });

  enableCam();
}

createHandLandmarker();

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
  if (!gestureRecognizer) {
    console.log("Wait! gestureRecognizer not loaded yet.");
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
// const drawingUtils = new DrawingUtils(canvasCtx);

async function predictWebcam() {

  let startTimeMs = performance.now();
  if (lastVideoTime !== video.currentTime) {
    lastVideoTime = video.currentTime;
    results = gestureRecognizer.recognizeForVideo(video, startTimeMs);
  }
  if (results.landmarks) {
    notifyObservers(results);
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
