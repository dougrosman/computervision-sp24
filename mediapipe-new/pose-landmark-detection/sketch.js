import { subscribeToResults, w, h } from "./detection.js";

let poses;
subscribeToResults((results) => {
  poses = results;
});

// Treat everything inside of 'sketch' as a regular p5.js sketch. put p. in front of anything that is a built-in p5.js function
let sketch = function (p) {
  p.setup = function () {
    p.pixelDensity(1);
    p.createCanvas(w, h);
    p.colorMode(p.HSB);
  };

  p.draw = function () {
    p.clear();

    // if any poses have been detected...
    if (poses) {
      console.log(poses);
      drawPoseLandmarks();
      //drawSegmentationMasks();
      // loop through all detected poses
    }
  };

  function drawPoseLandmarks() {
    for (let i = 0; i < poses.landmarks.length; i++) {
      let currentPose = poses.landmarks[i];
      p.colorMode(p.HSB);
      const hue = p.map(i, 0, poses.landmarks.length, 0, 360);
      p.stroke(hue, 100, 100);
      p.strokeWeight(10);
      p.beginShape(p.POINTS);
      // loop through landmarks;
      for (let j = 0; j < currentPose.length; j++) {
        const landmark = p.createVector(w - currentPose[j].x * w, currentPose[j].y * h);
        p.vertex(landmark.x, landmark.y);
      }
      p.endShape();
    }
  }

  function drawSegmentationMasks() {
    for (let i = 0; i < poses.landmarks.length; i++) {
      let currentMask = poses.segmentationMasks[i].getAsUint8Array();
      console.log(currentMask);

      const hue = p.map(i, 0, poses.landmarks.length, 0, 360);
      p.stroke(hue, 100, 100);
      p.fill(hue, 100, 100);
      p.strokeWeight(10);
      p.colorMode(p.RGB);
      p.loadPixels();
      console.log(p.pixels.length);
      for (let j = 0; j < currentMask.length; j += 4) {
        p.pixels[j] = 0;
        p.pixels[j + 1] = 255 * currentMask[j + 1];
        p.pixels[j + 2] = 0;
        p.pixels[j + 3] = 127;
      }
      p.updatePixels();
      // p.beginShape(p.POINTS);
      // // loop through landmarks;
      // for (let j = 0; j < currentPose.length; j++) {
      //   const landmark = p.createVector(w - currentPose[j].x * w, currentPose[j].y * h);
      //   p.vertex(landmark.x, landmark.y);
      // }
      // p.endShape();
    }
  }
};

let myp5 = new p5(sketch);
