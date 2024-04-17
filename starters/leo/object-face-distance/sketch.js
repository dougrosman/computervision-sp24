import { subscribeToResults, w, h } from "./detection.js";

let objects;
let faces;
subscribeToResults((results) => {
  // results contains object and face detections. You can tell which type of detection the current result is based on the lenght of the keypoints array (only the faces have keypoints)
  if (results.detections[0].keypoints.length == 6) {
    faces = results;
  } else {
    objects = results;
  }
});

// Treat everything inside of 'sketch' as a regular p5.js sketch. put p. in front of anything that is a built-in p5.js function
let sketch = function (p) {
  p.setup = function () {
    p.createCanvas(w, h);
    p.colorMode(p.HSB);
  };

  p.draw = function () {
    p.clear();

    // if we detect both a face AND a toothbrush, do all the important stuff
    if (faces && objects) {
      const face = faces.detections[0];
      const mouth = p.createVector(
        p.width - face.keypoints[3].x * p.width,
        face.keypoints[3].y * p.height
      );

      const toothbrush = objects.detections[0];
      const boundingBox = toothbrush.boundingBox;
      const toothBrushCenter = p.createVector(
        p.width - boundingBox.originX - boundingBox.width/2,
        boundingBox.originY + boundingBox.height/2
      );

      const distance = p5.Vector.dist(mouth, toothBrushCenter);
      const midPoint = p5.Vector.lerp(mouth, toothBrushCenter, 0.5);
      p.stroke(240, 100, 100);
      p.strokeWeight(2);
      p.line(mouth.x, mouth.y, toothBrushCenter.x, toothBrushCenter.y)
      p.noStroke();
      p.text(distance, midPoint.x, midPoint.y)

      // this is where we:
      // 1. calculate the distance between a toothbrush and a mouth
      // 2. if the distance is less than a certain amount, then the user is brushing their teeth (note, the distance threshold should scale with the size of the face's bounding box height)
      // 3.
    }

    if (faces) {
      drawFaces();
    }

    if (objects) {
      drawToothbrushBox();
    }
  };

  function drawFaces() {
    const face = faces.detections[0];
    const mouth = p.createVector(
      p.width - face.keypoints[3].x * p.width,
      face.keypoints[3].y * p.height
    );
    p.fill(255, 0, 0);
    p.ellipse(mouth.x, mouth.y, 20, 20);
  }

  function drawToothbrushBox() {
    const toothbrush = objects.detections[0];

    // draw bounding box
    const boundingBox = toothbrush.boundingBox;
    const boundingBoxOrigin = p.createVector(
      p.width - boundingBox.originX - boundingBox.width,
      boundingBox.originY
    );
    const toothBrushCenter = p.createVector(
      p.width - boundingBox.originX - boundingBox.width/2,
      boundingBox.originY + boundingBox.height/2
    );
    p.stroke(30, 100, 100);
    p.strokeWeight(4);
    p.noFill();
    p.rect(
      boundingBoxOrigin.x,
      boundingBoxOrigin.y,
      boundingBox.width,
      boundingBox.height
    );
    p.strokeWeight(20);
    p.stroke(30, 100, 100);
    p.point(toothBrushCenter.x, toothBrushCenter.y);

    // draw category name
    const categoryName = toothbrush.categories[0].categoryName;
    const score = toothbrush.categories[0].score;
    p.noStroke();
    p.fill(0, 0, 100);
    p.textSize(30);
    p.text(
      `${categoryName}, ${Math.round(parseFloat(score) * 100)}%`,
      p.width - boundingBox.originX - boundingBox.width,
      boundingBox.originY
    );
  }
};

let myp5 = new p5(sketch);
