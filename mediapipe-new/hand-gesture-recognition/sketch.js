import { subscribeToResults, w, h } from "./detection.js";

let hands;
subscribeToResults((results) => {
  hands = results;
});

// Treat everything inside of 'sketch' as a regular p5.js sketch. put p. in front of anything that is a built-in p5.js function
let sketch = function (p) {
  p.setup = function () {
    p.createCanvas(w, h);
    p.colorMode(p.HSB);
  };

  p.draw = function () {
    p.clear();

    // if any hands have been detected...
    if (hands) {
      // uncomment this to see what type of data you're capturing
      // console.log(hands);
      drawHandLandmarks();
      recognizeGestures();
    }
  };

  function recognizeGestures() {
    // loop through all detected hands
    for (let i = 0; i < hands.gestures.length; i++) {
      let currentHand = hands.gestures[i];
      let gesture = currentHand[0].categoryName;
      const textSize = 24;
      p.textSize(20);
      p.fill(0, 0, 100);
      p.strokeWeight(1);
      p.stroke(0);
      p.text(gesture, 10, i * (textSize + 2) + 50);
      p.fill(120, 100, 100);
      p.stroke(0);
      if (gesture == "Open_Palm") {
        p.ellipse(p.width / 2, p.height / 2, 50, 50);
      } else if (gesture == "Pointing_Up") {
        p.rect(p.width / 2, p.height / 2, 25, 25);
      }
    }
  }

  function drawHandLandmarks() {
    // loop through all detected hands
    for (let i = 0; i < hands.landmarks.length; i++) {
      let currentHand = hands.landmarks[i];
      const hue = p.map(i, 0, hands.landmarks.length, 0, 360);
      p.stroke(hue, 100, 100);
      p.strokeWeight(6);
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

let myp5 = new p5(sketch);
