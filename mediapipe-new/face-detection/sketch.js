import { subscribeToResults, w, h } from "./detection.js";

let faces;
subscribeToResults((results) => {
  faces = results;
});

// Treat everything inside of 'sketch' as a regular p5.js sketch. put p. in front of anything that is a built-in p5.js function
let sketch = function (p) {
  p.setup = function () {
    p.createCanvas(w, h);
    p.colorMode(p.HSB);
  };

  p.draw = function () {
    p.clear();

    // if any faces have been detected...
    if (faces) {

      // loop through all detected faces
      for(let i = 0; i < faces.detections.length; i++) {
        const face = faces.detections[i]

        // draw bounding box
        const boundingBox = face.boundingBox;
        p.fill(330, 100, 100, .5)
        p.noStroke()
        p.rect(p.width - boundingBox.originX - boundingBox.width, boundingBox.originY, boundingBox.width, boundingBox.height)

        // draw keypoints
        for(let j = 0; j < face.keypoints.length; j++) {
          const keypoint = p.createVector(
                p.width - face.keypoints[j].x * p.width,
                face.keypoints[j].y * p.height)
          p.stroke(180, 100, 100);
          p.strokeWeight(8)
          p.point(keypoint.x, keypoint.y);
          p.noStroke()
          p.textAlign(p.CENTER)
          p.textSize(20)
          p.fill(0, 0, 100)
          p.text(j, keypoint.x, keypoint.y)
        }
      }
      
    }
  };
};

let myp5 = new p5(sketch);
