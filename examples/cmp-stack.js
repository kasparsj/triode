// enable shadow map
shadowMap();

// configure orthographic camera
ortho([3,3,3], [0,1,0], {height: 5, controls: true, autoRotate: true})

// toggle gui on/off
const gui = true;

// create scene with default lights config and default world config (ground plane and fog)
const sc = stage()
    .lights({gui, all: true})
    .world({gui})
    .render();

// create a group with two meshes
const group = sc.group();
group.mesh(geom.box(), mat.meshPhong());
group.mesh(geom.sphere(), mat.meshPhong());

// layout (position) the meshes of the group in a stack composition
compose.stack(group)
