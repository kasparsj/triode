// circle
stage().lineLoop([100], mat.lineloop(solid(sin().add(0.5), cos().add(0.5)))).render();

// triangle
stage().lineLoop([3], mat.lineloop(solid(sin(1).add(0.5), cos(1).add(0.5)))).render();

// rectangle
stage().lineLoop([4], mat.lineloop(solid(sin(1).add(0.5), cos(1).add(0.5)))).render();

// pentagon
stage().lineLoop([5], mat.lineloop(solid(sin(1).add(0.5), cos(1).add(0.5)))).render();

// hexagon
stage().lineLoop([6], mat.lineloop(solid(sin(1).add(0.5), cos(1).add(0.5)))).render();

// heptagon
stage().lineLoop([7], mat.lineloop(solid(sin(1).add(0.5), cos(1).add(0.5)))).render();

// seed of life
stage().lineLoop([200], mat.lineloop(solid(sin(1).add(sin(7)).mult(0.5).add(0.5), cos(1).add(cos(7)).mult(0.5).add(0.5)))).render();

// additive animation
stage().lineLoop([300], mat.lineloop(solid(
    sin(1).add(sin([()=>time/2%1000])).mult(0.5).add(0.5),
    cos(1).add(cos([()=>time/2%1000])).mult(0.5).add(0.5)
))).render();
