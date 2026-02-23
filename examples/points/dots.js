let pos, size, color, pointMaterial;

// smearing color
pos = solid(pnoise(0.4, 0.1).map(-1,1,-0.1,1.1), noise(0.6, 0.03).map(-1,1,-0.1,1.1));
size = noise(0.4).mult(20);
color = cnoise(100).saturate(()=>time%2.0);
pointMaterial = mat.dots(pos, size, color);
stage()
    .points([500, 500], pointMaterial)
    .clear(0.001)
    .render()

pointMaterial = mat.dots(solid(noise(1, 0.01).map(-1,1,-0.2,1.2).scrollX(0, 0.01), noise(2, 0.01).map(-1,1,-0.2,1.2)), noise(1).mult(3), solid(1,1,1));
stage()
    .points([800, 800], pointMaterial)
    .clear(0.05)
    .render()

// storm
solid(0)
    .layer(
        stage().points([20, 20], mat.dots(solid(noise(100).map(-1,1,0,1), tex.data(arr.random(50, 50, {max: 255}))), noise().mult(10), cnoise(1000, 0.1)
            .brightness()))
    )
    .st(scrollY(0, -0.1))
    .render();

// circle
pointMaterial = mat.dots(solid(sin().add(0.5), cos().add(0.5)), 3, cnoise(1000).rotateDeg(0, 1).saturate(8));
stage().points([100,1], pointMaterial).render();

// japan flag
solid(1, 1, 1, 1).layer(stage().points([1], mat.dots(0.5, 500, solid(1)))).render()
