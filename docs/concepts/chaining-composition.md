# Chaining and Composition Patterns

triode supports multiple composition styles. These patterns help keep sketches readable and reusable.

## Pattern 1: Texture-first material flow

Use Hydra chains to design texture behavior first, then apply to scene objects.

```js
const mat = osc(8, 0.1, 0.8)
  .modulate(noise(2), 0.1)
  .color(0.9, 0.7, 0.8)
  .phong();

stage().lights({ all: true }).mesh(geom.box(), mat).render();
```

Best for procedural looks and shader-driven motion.

## Pattern 2: Scene-first composition

Build geometry/camera/layout first, then swap materials/signals rapidly.

```js
const sc = stage()
  .lights({ all: true })
  .mesh(geom.sphere(), mat.meshPhong())
  .render();

update = () => {
  sc.at(0).rotation.y += 0.01;
};
```

Best for animation blocking and world design.

## Pattern 3: Render-to-texture bridge

Render one chain/scene to texture, reuse it in another scene.

```js
const pointTex = stage().points([200, 200], mat.dots()).tex(o1);
stage().mesh(geom.plane(2, 2), src(pointTex).lambert()).render();
```

Best for layered systems, portals, and feedback experiments.

## Pattern 4: Non-global embedding

Prefer namespaced calls in host applications.

```js
const triode = new Triode({ makeGlobal: false, detectAudio: false });
const H = triode.synth;
H.stage().mesh(H.geom.box(), H.osc().phong()).render();
```

Best for reliability in multi-instance or app-integrated contexts.

## Pattern 5: Data-driven textures

Build typed-array data, then map it to textures.

```js
const noiseData = arr.noise(512, 512, { type: "improved" });
const dataTex = tex.data(noiseData, { min: "linear", mag: "linear" });
stage().mesh(geom.plane(2, 2), src(dataTex).basic()).render();
```

Best for custom simulation and algorithmic image sources.

## Common pitfalls

- Avoid mixing many mutable globals in complex patches.
- Avoid hidden state coupling across outputs unless intentional.
- Avoid expensive post FX on every output when one composited pass is enough.
- Avoid using internal methods in production unless you accept API volatility.
