# First Patch: Hydra Signal + 3D Scene

Use this patch to understand triode's two-layer model: signal chains and scene graph.

```js
perspective([2, 2, 3], [0, 0, 0], {
  controls: { enabled: true, modifier: "none" },
});

const material = osc(6, 0.08, 0.7)
  .modulate(noise(2), 0.08)
  .rotateDeg(noise(1).mult(20))
  .phong({ shininess: 20 });

const sc = stage({ name: "main", reuse: true })
  .lights({ all: true })
  .world({ ground: true, fog: true })
  .mesh(geom.box(), material, { key: "hero-box" })
  .render();

update = () => {
  const box = sc.find({ key: "hero-box" })[0] || sc.at(0);
  if (!box) return;
  box.rotation.x += 0.008;
  box.rotation.y += 0.012;
};
```

## Why this patch matters

- `osc(...).phong()` bridges Hydra signals into a Three material.
- `stage()` gives a chainable scene handle.
- `key` helps object identity in `liveMode: "continuous"` during iterative edits.

## Next

- [Hydra to 3D Mental Model](../concepts/hydra-to-3d-mental-model.md)
- [Evaluation Model](../concepts/evaluation-model.md)
- [Hydra Equivalents](../interop/hydra-equivalents.md)
