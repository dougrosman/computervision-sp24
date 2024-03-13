let detections = {};
const videoElement = document.getElementsByClassName("input_video")[0];

const cam_w = 640;
const cam_h = 480;

function gotFaceMesh(results) {
  detections = results;
}

const faceMesh = new FaceMesh({
  locateFile: (file) => {
    console.log(`https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`);
    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
  },
});
faceMesh.setOptions({
  maxNumFaces: 6,
  refineLandmarks: false, // set to 'true' for more eye and lip detail
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
faceMesh.onResults(gotFaceMesh);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faceMesh.send({ image: videoElement });
  },
  width: cam_w,
  height: cam_h,
});
camera.start();
