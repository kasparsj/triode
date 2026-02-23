# Quickstart

This is the shortest path to a visible 3D triode sketch.

## 1. Create a runtime

```js
const hydra = new Hydra({
  detectAudio: false,
  makeGlobal: true,
});
```

## 2. Set camera and scene

```js
perspective([2, 2, 3], [0, 0, 0], {
  controls: { enabled: true, modifier: "none" },
});

const sc = stage()
  .lights({ all: true })
  .mesh(geom.box(), osc(8, 0.1, 0.8).phong())
  .render();
```

## 3. Animate

```js
update = () => {
  const box = sc.at(0);
  if (!box) return;
  box.rotation.x += 0.01;
  box.rotation.y += 0.01;
};
```

## Next

- [First Patch](./first-patch.md)
- [Core Concepts](../concepts/index.md)
- [Common Recipes](../recipes/common-recipes.md)
