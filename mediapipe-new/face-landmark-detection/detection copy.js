import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

let faceLandmarker;
let runningMode = "VIDEO";

const w = 640;
const h = 480;

async function createFaceLandmarker() {
  const filesetResolver = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
  faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
      delegate: "GPU",
    },
    outputFaceBlendshapes: true,
    runningMode,
    numFaces: 2,
  });
}

async function predictWebcam() {
    // await faceLandmarker.setOptions({ runningMode: "VIDEO" });

  let lastVideoTime = -1;
  function renderLoop() {
    const video = document.getElementById("video");

    if (video.currentTime !== lastVideoTime) {
      const faceLandmarkerResult = faceLandmarker.detectForVideo(video);
      processResults(detections);
      lastVideoTime = video.currentTime;
      console.log(detections)
    }

    requestAnimationFrame(() => {
      renderLoop();
    });
  }
}

createFaceLandmarker();
predictWebcam();
