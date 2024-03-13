let detections = {};
const videoElement = document.getElementsByClassName('input_video')[0];

const cam_w = 640;
const cam_h = 480;

function gotFaces(results) {
  detections = results;
}

const faces = new FaceDetection({locateFile: (file) => {
  //console.log(`https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`)
  // return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
  return `models/face_detection/${file}`;
}});
faces.setOptions({
  model: 'short', // use 'full' for up to 5 meters from camera
  minDetectionConfidence: 0.5
});
faces.onResults(gotFaces);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faces.send({image: videoElement});
  },
  width: cam_w,
  height: cam_h
});
camera.start();