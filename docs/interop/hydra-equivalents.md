# Hydra User Translation Layer

Use this map when translating familiar Hydra workflows into triode.

## Common equivalences

| In Hydra                    | In triode                            | Notes                                                 |
| --------------------------- | ------------------------------------ | ----------------------------------------------------- |
| `osc(...).render()`         | `osc(...).render()`                  | Still valid for signal-only output.                   |
| `src(o0)` feedback flow     | `src(o0)` and `.tex()` / `.texMat()` | triode adds direct texture/material bridge APIs.      |
| Final image chain           | Chain or scene pipeline              | Chain can become final output or a 3D material input. |
| Mostly UV-space composition | UV-space + scene graph space         | Scene APIs handle geometry, camera, lights, world.    |
| Global helper usage         | Global or non-global                 | `makeGlobal: false` recommended for apps.             |

## Typical migration examples

Hydra-style 2D chain:

```js
osc(10, 0.1, 0.7).modulate(noise(2), 0.2).render(o0);
```

triode scene material bridge:

```js
perspective([2, 2, 3], [0, 0, 0]);
stage().lights({ all: true }).mesh(geom.box(), osc(10).phong()).render(o0);
```

Hydra global workflow:

```js
const hydra = new Hydra({ makeGlobal: true });
osc().render();
```

triode host-safe workflow:

```js
const hydra = new Hydra({ makeGlobal: false });
const H = hydra.synth;
H.osc().render();
```

## Not the same

- triode runtime internals are Three.js-based, not regl-based.
- 3D API additions are first-class, not lightweight wrappers.
- Some defaults differ when `legacy` mode is off (`makeGlobal`, `liveMode`).
