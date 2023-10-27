// Face Mesh with mediapipe
// https://google.github.io/mediapipe/solutions/face_mesh#javascript-solution-api

let sketch = function (p) {

  p.setup = function () {
    p.createCanvas(cam_w, cam_h);
    p.rectMode(p.CENTER);
  }

  p.draw = function () {
    p.clear(0);

    if (detections != undefined) {
      if (detections.multiFaceLandmarks != undefined) {
        p.drawFaceMeshes();
        console.log(detections);
      }
    }
  }

  p.drawFaceMeshes = function () {
    p.strokeWeight(2);
    p.stroke(0, 255, 255);

    for (let i = 0; i < detections.multiFaceLandmarks.length; i++) {
      for (let j = 0; j < detections.multiFaceLandmarks[i].length; j++) {

        const currentFace = detections.multiFaceLandmarks[i];
        const x = p.width - currentFace[j].x * p.width;
        const y = currentFace[j].y * p.height;

        p.point(x, y);

      }
    }
  }
}

let myp5 = new p5(sketch)