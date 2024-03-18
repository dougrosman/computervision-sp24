import { subscribeToResults, w, h } from "./detection.js";

let faces;
subscribeToResults((results) => {
  faces = results;
});

// Treat everything inside of 'sketch' as a regular p5.js sketch. put p. in front of anything that is a built-in p5.js function
let sketch = function (p) {
  p.setup = function () {
    p.createCanvas(w, h);
    p.background(255, 0, 0);
    p.colorMode(p.HSB);
  };

  p.draw = function () {
    p.clear();

    // if any faces have been detected...
    if (faces) {
      // loop through all detected faces
      for (let i = 0; i < faces.faceLandmarks.length; i++) {
        let currentFace = faces.faceLandmarks[i];
        const hue = p.map(i, 0, faces.faceLandmarks.length, 0, 360);
        p.stroke(hue, 100, 100);
        p.strokeWeight(3);
        p.beginShape(p.POINTS);

        // loop through landmarks;
        for (let j = 0; j < currentFace.length; j++) {
          const landmark = p.createVector(w - currentFace[j].x * w, currentFace[j].y * h);
          p.vertex(landmark.x, landmark.y);
        }
        p.endShape();
      }
    }
  };
};

let myp5 = new p5(sketch);
