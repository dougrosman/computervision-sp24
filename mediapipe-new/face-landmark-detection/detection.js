// https://developers.google.com/mediapipe/solutions/vision/face_landmarker/web_js
// original demo: https://codepen.io/mediapipe-preview/pen/OJBVQJm?editors=1111

import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

let faceLandmarker;
let results;
let runningMode = "VIDEO";
let observers = [];

const w = 640;
const h = 360;
video.style.width = w + "px";
video.style.height = h + "px";
video.setAttribute("width", w);
video.setAttribute("height", h);

async function createFaceLandmarker() {
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
      delegate: "GPU",
    },
    numFaces: 10,
    minFaceDetectionConfidence: 0.5,
    minFacePresenceConfidence: 0.5,
    minFaceTrackingConfidence: 0.5,
    outputFaceBlendshapes: false,
    outputFacialTransformationMatrixes: false,
    runningMode,
  });

  enableCam();
}

createFaceLandmarker();

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
  if (!faceLandmarker) {
    console.log("Wait! faceLandmarker not loaded yet.");
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
    results = faceLandmarker.detectForVideo(video, startTimeMs);
  }
  if (results.faceLandmarks) {
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
