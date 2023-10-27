let detections = {};
const videoElement = document.getElementsByClassName('input_video')[0];

const cam_w = 1280;
const cam_h = 720;

function gotFaceMesh(results) {
  detections = results;
}

const holistic = new Holistic({locateFile: (file) => {
  console.log(`https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`)
  return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
}});
faceMesh.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: true,
  smoothSegmentation: true,
  refineFaceLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
faceMesh.onResults(gotFaceMesh);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await holistic.send({image: videoElement});
  },
  width: cam_w,
  height: cam_h
});
camera.start();