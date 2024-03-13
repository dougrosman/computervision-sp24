let img;

function preload() {
    img = loadImage('bird.jpg');
}   

function setup() {
    const img_w = img.width;
    const img_h = img.height;
    createCanvas(img_w, img_h*2);

    // draw the unaltered image (top)
    image(img, 0, 0)
    
    // load the image pixels
    // we can now use the 'pixels' array in the img object
    img.loadPixels();

    // loop through each pixel in the image
    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {

            const index = (x + y * width) * 4;

            // store the r,g,b values of the current pixel
            const rVal = img.pixels[index];
            const gVal = img.pixels[index+1];
            const bVal = img.pixels[index+2];

            // swap the color channels
            img.pixels[index] = bVal;
            img.pixels[index+1] = rVal;
            img.pixels[index+2] = gVal;
        }
    }

    // update the pixels in the image with our changes
    img.updatePixels();

    // draw the update image (bottom)
    image(img, 0, height/2);
}