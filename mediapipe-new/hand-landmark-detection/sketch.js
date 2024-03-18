import { subscribeToResults, w, h } from "./detection.js";

let hands;
subscribeToResults((results) => {
  hands = results;
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

    // if any hands have been detected...
    if (hands) {
      // loop through all detected hands
      for (let i = 0; i < hands.landmarks.length; i++) {
        let currentHand = hands.landmarks[i];
        const hue = p.map(i, 0, hands.landmarks.length, 0, 360);
        p.stroke(hue, 100, 100);
        p.strokeWeight(3);
        p.beginShape(p.POINTS);
        // loop through landmarks;
        for (let j = 0; j < currentHand.length; j++) {
          const landmark = p.createVector(w - currentHand[j].x * w, currentHand[j].y * h);
          p.vertex(landmark.x, landmark.y);
        }
        p.endShape();
      }
    }
  };
};

let myp5 = new p5(sketch);
