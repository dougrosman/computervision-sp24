let detections = {};
const videoElement = document.getElementsByClassName('input_video')[0];

const cam_w = 640;
const cam_h = 480;

function gotPoses(results) {
  detections = results;
}

const poses = new Pose({locateFile: (file) => {
  console.log(`https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`)
  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
}});

poses.setOptions({
  modelComplexity: 1,
  smoothLandmarks: false,
  enableSegmentation: false,
  smoothSegmentation: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

poses.onResults(gotPoses);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await poses.send({image: videoElement});
  },
  width: cam_w,
  height: cam_h
});
camera.start();