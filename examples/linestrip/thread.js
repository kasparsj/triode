// dancing thread
const pos = solid(noise(1).x, noise(2).y, noise(3).y).map(-1,1,0,1);
pos.render(o1); // output debug to o1 for debug purposes
const lineMaterial = mat.linestrip(pos); // create linestrip material
stage()
    .lineStrip([100], lineMaterial)
    .render();
