let sketch = function (p) {
  p.setup = function () {
    p.createCanvas(cam_w, cam_h);
    p.rectMode(p.CENTER);
    p.colorMode(p.HSL, 360);
  };

  p.draw = function () {
    p.clear(0);

    if (detections != undefined) {
      // console.log(detections);

      if (detections.faceLandmarks != undefined) {
        p.drawFaceLandmarks(detections.faceLandmarks);
      }

      if (detections.poseLandmarks != undefined) {
        p.drawPoseLandmarks(detections.poseLandmarks);
      }

      if (detections.leftHandLandmarks != undefined) {
        p.drawHands(detections.leftHandLandmarks);
      }

      if (detections.rightHandLandmarks != undefined) {
        p.drawHands(detections.rightHandLandmarks);
      }
    }
  };

  p.drawFaceLandmarks = function (faceLandmarks) {
    p.strokeWeight(4);

    for (let i = 0; i < faceLandmarks.length; i++) {
      const hue = p.map(i, 0, faceLandmarks.length, 0, 360);
      p.stroke(hue, 360, 180);

      const landmark = p.createVector(faceLandmarks[i].x * p.width, faceLandmarks[i].y * p.height);

      p.point(landmark.x, landmark.y);
    }
  };

  p.drawPoseLandmarks = function (poseLandmarks) {
    p.strokeWeight(10);

    for (let i = 0; i < poseLandmarks.length; i++) {
      p.stroke(120, 360, 180);

      const landmark = p.createVector(poseLandmarks[i].x * p.width, poseLandmarks[i].y * p.height);

      p.point(landmark.x, landmark.y);
    }
  };

  p.drawHands = function (handLandmarks) {
    p.strokeWeight(10);

    for (let i = 0; i < handLandmarks.length; i++) {
      p.stroke(0, 360, 180);

      const landmark = p.createVector(handLandmarks[i].x * p.width, handLandmarks[i].y * p.height);

      p.point(landmark.x, landmark.y);
    }
  };
};

let myp5 = new p5(sketch);
