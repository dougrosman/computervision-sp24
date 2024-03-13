let detections = {};
const videoElement = document.getElementsByClassName('input_video')[0];

const cam_w = 640;
const cam_h = 480;

function gotHands(results) {
  detections = results;
}

const hands = new Hands({locateFile: (file) => {
  return `models/hands/${file}`;
  // return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(gotHands);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: cam_w,
  height: cam_h
});
camera.start();