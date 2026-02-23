ortho(0, 0, {controls: true});

// grid of 50x50 pixels
// for 2d grid pos is equal to gradient
const pos = gradient();
const size = 5;
const color = gradient();
const pointMaterial = mat.squares(pos, size, color);
stage()
    .points([50,50], pointMaterial)
    .render()
