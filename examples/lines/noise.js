// 400 lines of noise
const pos = solid(noise(1, 0.03).map(-1,1,-0.1,1.1), noise(2, 0.03).map(-1,1,-0.1,1.1));
const color = cnoise(1000).saturate(8);
const lineMaterial = mat.lines(pos, color);
stage()
    .lines([0,400], lineMaterial)
    .clear(0.5)
    .render()
