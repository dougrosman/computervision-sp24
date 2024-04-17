import { subscribeToResults, w, h } from "./detection.js";

let objects;
subscribeToResults((results) => {
  objects = results;
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
      //console.log(objects)
      
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
  };
};

let myp5 = new p5(sketch);
