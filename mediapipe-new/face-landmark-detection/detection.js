// https://developers.google.com/mediapipe/solutions/vision/face_landmarker/web_js

import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

let faceLandmarker;
let results;
let runningMode = "VIDEO";
let observers = [];

const w = 640;
const h = 360;

async function createFaceLandmarker() {
  const filesetResolver = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
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
  video.style.width = w + "px";
  video.style.height = h + "px";
  video.setAttribute("width", w);
  video.setAttribute("height", h);

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

// 0:{index: 0, score: 0.0000014272295629780274, categoryName: '_neutral', displayName: ''}
// 1:{index: 1, score: 0.0020032331813126802, categoryName: 'browDownLeft', displayName: ''}
// 2:{index: 2, score: 0.0007416557637043297, categoryName: 'browDownRight', displayName: ''}
// 3:{index: 3, score: 0.6245725154876709, categoryName: 'browInnerUp', displayName: ''}
// 4:{index: 4, score: 0.2934659421443939, categoryName: 'browOuterUpLeft', displayName: ''}
// 5:{index: 5, score: 0.4471551775932312, categoryName: 'browOuterUpRight', displayName: ''}
// 6:{index: 6, score: 0.000027259677153779194, categoryName: 'cheekPuff', displayName: ''}
// 7:{index: 7, score: 0.00000407087418352603, categoryName: 'cheekSquintLeft', displayName: ''}
// 8:{index: 8, score: 0.0000010249408433082863, categoryName: 'cheekSquintRight', displayName: ''}
// 9:{index: 9, score: 0.2564017176628113, categoryName: 'eyeBlinkLeft', displayName: ''}
// 10:{index: 10, score: 0.06525620073080063, categoryName: 'eyeBlinkRight', displayName: ''}
// 11:{index: 11, score: 0.11117678135633469, categoryName: 'eyeLookDownLeft', displayName: ''}
// 12:{index: 12, score: 0.12005755305290222, categoryName: 'eyeLookDownRight', displayName: ''}
// 13:{index: 13, score: 0.007244510110467672, categoryName: 'eyeLookInLeft', displayName: ''}
// 14:{index: 14, score: 0.35253533720970154, categoryName: 'eyeLookInRight', displayName: ''}
// 15:{index: 15, score: 0.3333068788051605, categoryName: 'eyeLookOutLeft', displayName: ''}
// 16:{index: 16, score: 0.018403081223368645, categoryName: 'eyeLookOutRight', displayName: ''}
// 17:{index: 17, score: 0.10104365646839142, categoryName: 'eyeLookUpLeft', displayName: ''}
// 18:{index: 18, score: 0.10533400624990463, categoryName: 'eyeLookUpRight', displayName: ''}
// 19:{index: 19, score: 0.6268296241760254, categoryName: 'eyeSquintLeft', displayName: ''}
// 20:{index: 20, score: 0.18391795456409454, categoryName: 'eyeSquintRight', displayName: ''}
// 21:{index: 21, score: 0.0024020359851419926, categoryName: 'eyeWideLeft', displayName: ''}
// 22:{index: 22, score: 0.012607526034116745, categoryName: 'eyeWideRight', displayName: ''}
// 23:{index: 23, score: 0.00015678595809731632, categoryName: 'jawForward', displayName: ''}
// 24:{index: 24, score: 0.0005759671330451965, categoryName: 'jawLeft', displayName: ''}
// 25:{index: 25, score: 0.009614513255655766, categoryName: 'jawOpen', displayName: ''}
// 26:{index: 26, score: 0.00031904876232147217, categoryName: 'jawRight', displayName: ''}
// 27:{index: 27, score: 0.0014832287561148405, categoryName: 'mouthClose', displayName: ''}
// 28:{index: 28, score: 0.0009919182630255818, categoryName: 'mouthDimpleLeft', displayName: ''}
// 29:{index: 29, score: 0.00011515584628796205, categoryName: 'mouthDimpleRight', displayName: ''}
// 30:{index: 30, score: 0.25459158420562744, categoryName: 'mouthFrownLeft', displayName: ''}
// 31:{index: 31, score: 0.22298601269721985, categoryName: 'mouthFrownRight', displayName: ''}
// 32:{index: 32, score: 0.005898949224501848, categoryName: 'mouthFunnel', displayName: ''}
// 33:{index: 33, score: 0.006316004320979118, categoryName: 'mouthLeft', displayName: ''}
// 34:{index: 34, score: 0.0005216773133724928, categoryName: 'mouthLowerDownLeft', displayName: ''}
// 35:{index: 35, score: 0.0013624051352962852, categoryName: 'mouthLowerDownRight', displayName: ''}
// 36:{index: 36, score: 0.0053885020315647125, categoryName: 'mouthPressLeft', displayName: ''}
// 37:{index: 37, score: 0.0005580773577094078, categoryName: 'mouthPressRight', displayName: ''}
// 38:{index: 38, score: 0.5608692169189453, categoryName: 'mouthPucker', displayName: ''}
// 39:{index: 39, score: 0.00004981143501936458, categoryName: 'mouthRight', displayName: ''}
// 40:{index: 40, score: 0.010877673514187336, categoryName: 'mouthRollLower', displayName: ''}
// 41:{index: 41, score: 0.0005271697882562876, categoryName: 'mouthRollUpper', displayName: ''}
// 42:{index: 42, score: 0.009690284729003906, categoryName: 'mouthShrugLower', displayName: ''}
// 43:{index: 43, score: 0.025401318445801735, categoryName: 'mouthShrugUpper', displayName: ''}
// 44:{index: 44, score: 0.00038774253334850073, categoryName: 'mouthSmileLeft', displayName: ''}
// 45:{index: 45, score: 0.00010584185656625777, categoryName: 'mouthSmileRight', displayName: ''}
// 46:{index: 46, score: 0.14013028144836426, categoryName: 'mouthStretchLeft', displayName: ''}
// 47:{index: 47, score: 0.018130401149392128, categoryName: 'mouthStretchRight', displayName: ''}
// 48:{index: 48, score: 0.00011050975444959477, categoryName: 'mouthUpperUpLeft', displayName: ''}
// 49:{index: 49, score: 0.000095920950116124, categoryName: 'mouthUpperUpRight', displayName: ''}
// 50:{index: 50, score: 0.000007442636160703842, categoryName: 'noseSneerLeft', displayName: ''}
// 51:{index: 51, score: 0.000001189931140288536, categoryName: 'noseSneerRight', displayName: ''}
