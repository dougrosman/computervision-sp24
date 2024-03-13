# Webcam Setup

1. [webcam-setup-basic](webcam-setup-basic/index.html)
2. [webcam-setup-canvas](webcam-setup-canvas/index.html)
3. [webcam-setup-canvas-responsive](webcam-setup-canvas-responsive/index.html)
4. [webcam-setup-image](webcam-setup-image/index.html)

There are two ways we'll view our webcam feed in a web page using p5.js:

1. **Showing a video element directly.** This will be our preferred method, as it optimizes our sketches to run a little bit faster, since we're not taking time to draw the camera feed to the canvas. This way, the Canvas element will be drawn on top of the video element, and we'll use CSS to position the canvas on top of the video. Using this method, we may also choose to hide the video, and still use the data we capture from it to manipulate whatever we're drawing to the canvas.

2. **Drawing the video to the Canvas using image(capture).** This approach will be necessary when we're directly manipulating the **pixels** of the capture video. So, if you're using capture.loadPixels() / capture.updatePixels(), you'll need to draw the resulting feed to the Canvas in order to see your changes. You'll want to use capture.hide() in setup, in this case.
