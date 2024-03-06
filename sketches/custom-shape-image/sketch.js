let img;

function preload() {
    img = loadImage('cat2.jpg');
}

function setup() {
    createCanvas(400, 400, WEBGL);
    background(127);

    
}

function draw() {
    clear();
    fill(0, 255, 0);

    push();
        translate(-width/2, -height/2);
        texture(img)
        textureMode(IMAGE);
        beginShape()
        vertex(10, 10, 0, 0);
        vertex(400, 10, img.width, 0);
        vertex(350, 100, img.width, img.height);
        vertex(300, 300, 0, img.height);
        endShape(CLOSE);
        vertex(300, 0, img.width, img.height/2);
    pop();
}