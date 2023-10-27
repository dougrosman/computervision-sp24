let detections = {};
const videoElement = document.getElementsByClassName('input_video')[0];

const cam_w = 1280;
const cam_h = 720;

function gotFaceMesh(results) {
  detections = results;
}

const holistic = new Holistic({locateFile: (file) => {
  console.log(`models/${file}`)
  return `models/${file}`;
}});
holistic.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: true,
  smoothSegmentation: true,
  refineFaceLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
holistic.onResults(gotFaceMesh);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await holistic.send({image: videoElement});
  },
  width: cam_w,
  height: cam_h
});
camera.start();