// setup perspective camera, enabling camera controls (alt+click to rotate, alt+scroll to zoom)
perspective([2,2,3], [0,0,0], {controls: true});

// create geometry and material
const boxGeometry = geom.box(); // cube geometry
const boxMaterial = osc().rotateDeg(noise(1).mult(45)).phong(); // use a triode texture mapped onto a phong material

// compose scene
const sc = stage({ key: "box-scene" })
    .lights() // default lighting setup
    .mesh(boxGeometry, boxMaterial, { key: "box-mesh" }) // add mesh to scene
    .render();

update = () => {
    const box = sc.at(0);
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;
}
