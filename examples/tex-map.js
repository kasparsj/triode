// enable shadow map
shadowMap();

// configure orthographic camera
ortho([0,5,3], 0, {controls: true, autoRotate: true})

// render 500x500 blue dots to a texture and output to o1 (for debug)
const dotsPos = solid(snoise(10), snoise(20)).map(-1,1,0,1);
const dotsSize = 2;
const dotsColor = [0,0,1];
const dotsMat = mat.dots(dotsPos, dotsSize, dotsColor);
const dotsTex = stage({background: color(1,1,1), key: "tex-map-dots-scene"})
    .points([500, 500], dotsMat, { key: "tex-map-dots-points" })
    .tex(o1);

// const tex = solid(1, 1, 1).layer(lines(0.003, 0.001, solid(0,0,1))).tex(o1, {mag: 'linear', min: 'mipmap', width: 4096, height: 4096});

// render FBM noise to a texture and output to o2 (for debug)
const heightMap = fbm(0.7, [0.5,-2]).tex(o2);

// toggle gui on/off
const gui = false;

// create scene with default lighting and world (ground plane and fog)
const sc = stage({ key: "tex-map-main-scene" })
    .lights({all: true, intensity: 2.5, gui})
    .world({gui})
    .render();

// create a plane mesh with height map displacement and dots texture
sc.mesh(
    geom.plane(2,2,250,250).rotateX(-Math.PI/2), // rotateX -90 deg to make displacementMap work on Y axis
    mat.meshPhong({displacementMap: heightMap, displacementScale: 2, map: dotsTex}),
    { key: "tex-map-main-plane" },
);
