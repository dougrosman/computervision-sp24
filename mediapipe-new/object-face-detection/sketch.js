import { subscribeToResults, w, h } from "./detection.js";

let objects;
let faces;
subscribeToResults((results) => {

  // results contains object and face detections. You can tell which type of detection the current result is based on the lenght of the keypoints array (only the faces have keypoints)
  if(results.detections[0].keypoints.length == 6) {
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

    // if any objects have been detected...
    if (objects) {
      // loop through all objects
      for(let i = 0; i < objects.detections.length; i++) {
        const object = objects.detections[i];

        // draw bounding box
        const boundingBox = object.boundingBox
        const boundingBoxOrigin = p.createVector(p.width - boundingBox.originX - boundingBox.width,
          boundingBox.originY
        )
        const hue = p.map(i, 0, 10, 0, 360)
        p.stroke(hue, 100, 100)
        p.strokeWeight(4);
        p.noFill()
        p.rect(boundingBoxOrigin.x, boundingBoxOrigin.y, boundingBox.width, boundingBox.height)
        
        // draw category name
        const categoryName = object.categories[0].categoryName;
        const score = object.categories[0].score;
        p.noStroke();
        p.fill(hue, 0, 100)
        p.textSize(30)
        p.text(`${categoryName}, ${Math.round(parseFloat(score) * 100)}%`, p.width - boundingBox.originX - boundingBox.width, boundingBox.originY)
      }
    }

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
