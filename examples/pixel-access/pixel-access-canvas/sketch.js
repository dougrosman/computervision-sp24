// Pixel Access
// Directly access the canvas pixels and manipulate them directly

function setup() {
    createCanvas(512, 512)
    
    // load the canvas pixels
    // we can now use the 'pixels' array
    loadPixels();

    // loop through each pixel, setting their color based on the
    // x and y values in the loop
    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {

            // because each pixel has 4 channels (R, G, B, A), have to access each channel individually
            const index = (x + y * width) * 4;
            pixels[index] = x;
            pixels[index + 1] = y;
            pixels[index + 2] = 255;
            pixels[index + 3] = 255;
        }
    }

    updatePixels();
}