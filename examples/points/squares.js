// sky
solid(0)
    .layer(
        stage().points([500], mat.squares(solid(tex.data(arr.random(500, 500, {max: 255})), tex.data(arr.random(500, 500, {max: 255}))), noise().mult(10)))
    )
    .st(scrollY(0, -0.1))
    .render();
