// Hand detection with mediapipe
// https://google.github.io/mediapipe/solutions/hands.html
// Adapted from "Multiple Hands Detection in p5.js" by Kazuki Umeda (https://www.youtube.com/watch?v=BX8ibqq0MJU)

let sketch = function(p) {

  let font;

  p.preload = function() {
    font = p.loadFont("Poppins-Medium.ttf");
  }

  p.setup = function() {
    p.createCanvas(cam_w, cam_h, p.WEBGL);
    p.setAttributes({alpha: true})
    p.textFont(font);
    p.textSize(16)
  }

  p.draw = function() {
    p.clear(0);
    p.translate(-p.width/2, -p.height/2);

    if(detections != undefined) {
      if(detections.multiHandLandmarks != undefined) {
        p.drawHands();
      }
    }
  }

  p.drawHands = function() {
    p.stroke(0);
    p.strokeWeight(8);

    

    for(let i = 0; i < detections.multiHandLandmarks.length; i++) {
      
      const INDEX_FINGER = detections.multiHandLandmarks[0][8];
      p.fill(255, 0, 0);
      p.ellipse(p.width-(INDEX_FINGER.x * p.width), INDEX_FINGER.y * p.height, 40, 40);
      console.log(INDEX_FINGER);

      for(let j = 0; j < detections.multiHandLandmarks[i].length; j++) {

        const x = p.width-(detections.multiHandLandmarks[i][j].x * p.width);
        const y = detections.multiHandLandmarks[i][j].y * p.height;
        const z = detections.multiHandLandmarks[i][j].z;
        
        p.point(x, y, z);
        

        p.text(z.toFixed(3), x, y, z);


        // calculate how far the hand is from the camera by calculating the distance between keypoints 9 and 13 (base of middle and ring finger)
        if(j == 9 || j == 13) {
          const palm1 = detections.multiHandLandmarks[0][9]
          const palm2 = detections.multiHandLandmarks[0][13]
      
          const palm1Pos = p.createVector(palm1.x, palm1.y);
          const palm2Pos = p.createVector(palm2.x, palm2.y);
      
          const distance = palm1Pos.dist(palm2Pos)
      
          console.log(distance);
        }
         
      }
    }
  }
}

let myp5 = new p5(sketch)