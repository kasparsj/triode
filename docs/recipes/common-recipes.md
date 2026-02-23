# Common Creative Recipes

These recipes are short, practical starting points for creative coding workflows in triode.

Use the interactive playground to edit these patterns live:

- [`playground/index.html`](../../site/playground/index.html) (local source)
- `https://kasparsj.github.io/triode/playground/index.html` (published site)

## 1) Animated textured box

Playground preset:
[Textured Box](https://kasparsj.github.io/triode/playground/index.html?example=textured-box)

```js
perspective([2, 2, 3], [0, 0, 0], { controls: true });

const sc = stage()
  .lights({ all: true })
  .mesh(geom.box(), osc(8, 0.1, 0.8).rotateDeg(noise(1).mult(45)).phong())
  .render();

update = () => {
  const box = sc.at(0);
  box.rotation.x += 0.01;
  box.rotation.y += 0.01;
};
```

## 2) Particle field with trail fade

Playground preset:
[Points Trail](https://kasparsj.github.io/triode/playground/index.html?example=points-trail)

```js
ortho([0, 0, 1], [0, 0, 0]);

const pos = solid(
  noise(1).map(-1, 1, -0.1, 1.1),
  noise(2).map(-1, 1, -0.1, 1.1),
);
const size = noise(0.5).map(-1, 1, 2, 12);
const col = cnoise(1000).saturate(6);

stage()
  .points([300, 300], mat.dots(pos, size, col))
  .clear(0.04)
  .render();
```

## 3) Texture bridge: scene to scene

Playground preset:
[Scene Texture Bridge](https://kasparsj.github.io/triode/playground/index.html?example=scene-texture-bridge)

```js
const mapTex = stage()
  .points([150, 150], mat.squares(gradient(), 4, cnoise(100)))
  .tex(o1);

stage()
  .lights({ all: true })
  .mesh(geom.sphere(0.8, 64, 32), src(mapTex).phong())
  .render(o0);
```

## 4) Ground displacement from procedural height

Playground preset:
[Terrain Displacement](https://kasparsj.github.io/triode/playground/index.html?example=terrain-displacement)

```js
shadowMap();
ortho([0, 4, 3], [0, 0, 0], { controls: true });

const heightMap = fbm(0.8, [0.2, 0.5, 0.1]).tex(o2);

stage()
  .lights({ all: true })
  .mesh(
    geom.plane(2, 2, 200, 200).rotateX(-Math.PI / 2),
    mat.meshPhong({ displacementMap: heightMap, displacementScale: 1.5 }),
  )
  .render();
```

## 5) Non-global host-safe runtime

Playground note:
this recipe targets host-app integration (`makeGlobal: false`), so use local examples instead of the playground runtime shell.

```js
const hydra = new Hydra({ makeGlobal: false, detectAudio: false });
const H = hydra.synth;

H.perspective([2, 1.5, 2.5], [0, 0, 0]);
H.stage().lights({ all: true }).mesh(H.geom.box(), H.osc(5).phong()).render();
```

## 6) Datadriven texture from typed arrays

```js
const pixels = arr.random(512, 512, { type: "uint8" });
const dataTex = tex.data(pixels, { min: "nearest", mag: "nearest" });

stage().mesh(geom.plane(2, 2), src(dataTex).basic()).render();
```

## Recipe tips

- Start with one output and one scene; add complexity gradually.
- Favor named scenes/groups in larger sketches.
- Use non-global mode for host apps and multi-instance setups.
- Use `.tex()` to build modular pipelines and reusable texture stages.
