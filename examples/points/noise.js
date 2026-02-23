const pos = solid(noise(1, 0.03).map(-1,1,-0.1,1.1), noise(0.6, 0.03).map(-1,1,-0.1,1.1)); // map different scale noise to x and y
const size = noise(0.4).map(-1,1,1,10); // map size to noise and scake 1 to 10
const color = cnoise(1000); // map color to color noise
const pointMaterial = mat.dots(pos, size, color); // create dots material
// grid of 50x50 pixels, with trail effect (autoClear)
stage()
    .points([50,50], pointMaterial)
    .clear(0.05)
    .render()
