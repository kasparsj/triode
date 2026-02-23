# Parameter Reference Tables

This page summarizes frequently used parameters and defaults for core public APIs.
For behavior-level edge cases (units, precedence, and internal/public boundaries), see
[`docs/reference/semantic-clarifications.md`](./semantic-clarifications.md).

## Hydra constructor options

| Option                | Type                             | Default            | Notes                                                                                                                                        |
| --------------------- | -------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `width`               | `number`                         | `1280`             | Initial canvas width.                                                                                                                        |
| `height`              | `number`                         | `720`              | Initial canvas height.                                                                                                                       |
| `canvas`              | `HTMLCanvasElement`              | auto-created       | Provide your own canvas for embedding.                                                                                                       |
| `makeGlobal`          | `boolean`                        | `false`            | Installs globals like `osc`, `stage`, `geom`, etc. Use `liveGlobals(true)` to opt in at runtime (`legacy: true` defaults this to `true`).    |
| `autoLoop`            | `boolean`                        | `true`             | Starts internal RAF loop automatically.                                                                                                      |
| `detectAudio`         | `boolean`                        | `true`             | Initializes audio analyzer (`a` bins).                                                                                                       |
| `numSources`          | `number`                         | `4`                | Number of source slots `s0..sN`.                                                                                                             |
| `numOutputs`          | `number`                         | `4`                | Number of output slots `o0..oN`.                                                                                                             |
| `webgl`               | `1 \| 2`                         | `2`                | Select WebGL renderer backend.                                                                                                               |
| `precision`           | `"lowp" \| "mediump" \| "highp"` | platform-dependent | Shader precision hint.                                                                                                                       |
| `onError`             | `(error, context) => void`       | unset              | Runtime hook for `update/afterUpdate/tick` failures.                                                                                         |
| `liveMode`            | `"restart" \| "continuous"`      | `"continuous"`     | Eval behavior: rebuild on each run vs persistent scene reconciliation (`legacy: true` defaults this to `"restart"`).                         |
| `legacy`              | `boolean`                        | `false`            | Compatibility mode: restores legacy constructor defaults and suppresses deprecation warnings for `rotate(...)` and underscore scene methods. |
| `enableStreamCapture` | `boolean`                        | `true`             | Enables `vidRecorder` capture setup.                                                                                                         |
| `extendTransforms`    | object/array                     | `{}`               | Registers custom transforms at startup.                                                                                                      |
| `css2DElement`        | `HTMLElement`                    | auto               | Target element for CSS2D renderer if used.                                                                                                   |
| `css3DElement`        | `HTMLElement`                    | auto               | Target element for CSS3D renderer if used.                                                                                                   |
| `pb`                  | `unknown`                        | `null`             | Legacy/peer stream source integration input.                                                                                                 |

## Scene composition methods

| Method                                  | Purpose                                                   | Typical usage                                                       |
| --------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------- |
| `stage()`                               | Create scene handle (`reuse: true` for name-based lookup) | `stage({ name: "main", key: "main" })`                              |
| `scene()`                               | Alias of `stage()`                                        | `scene({ name: "main", key: "main" })`                              |
| `.box(mat?, options)`                   | Add default box mesh                                      | `.box(osc().phong(), { key: "hero" })`                              |
| `.sphere(mat?, options)`                | Add default sphere mesh                                   | `.sphere(osc().lambert(), { key: "planet" })`                       |
| `.mesh(geom, mat, options)`             | Add mesh geometry                                         | `.mesh(geom.box(), osc().phong(), { key: "hero" })`                 |
| `.instanced(geom, mat, count, options)` | Add instanced mesh and return it                          | `.instanced(geom.box(), mat.meshPhong(), 4096, { key: "crowd" })`   |
| `.points(geom, mat, options)`           | Add points primitive                                      | `.points([100, 100], mat.dots())`                                   |
| `.lines(...)`                           | Add line segments                                         | `.lines([100], mat.lines())`                                        |
| `.lineStrip(...)`                       | Add connected line strip                                  | `.lineStrip([200], mat.linestrip())`                                |
| `.lineLoop(...)`                        | Add closed line loop                                      | `.lineLoop([200], mat.lineloop())`                                  |
| `.lights(options)`                      | Configure runtime lights group                            | `.lights({ all: true })`                                            |
| `.world(options)`                       | Configure sky/ground/fog helpers                          | `.world({ ground: true, fog: true })`                               |
| `.group(attrs)`                         | Create/attach subgroup                                    | `stage({ key: "main" }).group({ name: "cluster", key: "cluster" })` |
| `.render(output, options)`              | Bind scene to output pipeline                             | `.render(o0)`                                                       |
| `.out(output, options)`                 | Alias of `.render(...)`                                   | `.out(o0)`                                                          |
| `.texture(output, options)`             | Alias of `.tex(...)`                                      | `.texture(o1)`                                                      |
| `.clear(amount, color)`                 | Set accumulation clear behavior                           | `.clear(0.2)`                                                       |
| `.autoClear(amount, color)`             | Alias of `.clear(...)`                                    | `.autoClear(0.2)`                                                   |
| `.obj(index)`                           | Alias of `.at(index)`                                     | `.obj(0)`                                                           |

Legacy aliases `linestrip(...)` and `lineloop(...)` remain available for compatibility.

Deprecation guidance:

- `rotate(...)` still works, but warns once and points to `rotateDeg(...)` / `rotateRad(...)`.
- Direct underscore scene helpers (for example `_mesh(...)`) warn once and point to public equivalents.
- Set constructor option `legacy: true` to suppress these compatibility warnings.

Identity note for live coding:

- `stage({ key: "main" })` (or `scene({ key: "main" })`), `.group({ key: "cluster" })`, and primitive `options.key` provide stable object reuse keys in `liveMode: "continuous"` when line order changes between evals.
- Cross-function/cross-file structural rewrites are intentionally not inferred for identity; use explicit `key` when you need hard identity guarantees.
- Name-based reuse is explicit: pass `reuse: true` on scenes/groups/primitives when you intentionally want `name` to resolve existing objects.
- Migration helper: [`docs/reference/live-key-migration.md`](./live-key-migration.md) and `npm run migrate:report-live-keys`.

## Module namespace aliases

Long-form aliases are available alongside short module names:

| Canonical short | Friendly alias | Notes                                                                        |
| --------------- | -------------- | ---------------------------------------------------------------------------- |
| `tx`            | `tex`          | Texture loaders/FBO/data helpers.                                            |
| `gm`            | `geom`         | Geometry constructors/utilities.                                             |
| `mt`            | `mat`          | Material constructors/utilities.                                             |
| `cmp`           | `compose`      | Composition/pipeline utilities.                                              |
| `rnd`           | `random`       | Random helpers.                                                              |
| `nse`           | `noiseUtil`    | Noise utility module alias; `noise()` remains the shader generator function. |

Runtime scope note:

- Use runtime-bound module APIs (`H.mat`, `H.geom`, `H.tex`, etc. or global helpers when enabled) instead of unscoped internal module imports, so helper calls resolve to the intended Hydra instance.

## Stage helper config

`stage(config)` is a readability-first scene bootstrap helper. It calls `scene(...)` under the hood and applies optional presets:

| `stage` option                                | Type                                                            | Notes                                                                           |
| --------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `reuse`                                       | `boolean`                                                       | Enables name-based scene reuse when `name` is provided.                         |
| `camera`                                      | `false \| "perspective" \| "ortho" \| "orthographic" \| object` | Camera preset or full camera config (`type`, `eye`, `target`, camera options).  |
| `lights`                                      | `false \| "basic" \| "studio" \| object`                        | `basic` uses default lights, `studio` maps to `{ all: true }`.                  |
| `world`                                       | `false \| "ground" \| "atmosphere" \| object`                   | `ground` enables ground, `atmosphere` enables ground + fog.                     |
| `clear` / `autoClear`                         | `number \| { amount, color, ... }`                              | Configures scene accumulation clear behavior.                                   |
| `output`                                      | `unknown`                                                       | Optional output target when rendering from config.                              |
| `render` / `out`                              | `boolean \| { to?, target?, css?, fx?, ... }`                   | If `true`, stage invokes `.render(...)`; object form maps to `render({ ... })`. |
| `cssRenderer`, `renderTarget`, `fx`, `layers` | varied                                                          | Forwarded to render options when auto-render is enabled.                        |

## Camera helper options

| Method                              | Inputs                                | Notes                                   |
| ----------------------------------- | ------------------------------------- | --------------------------------------- |
| `perspective(eye, target, options)` | tuple eye/target + camera options     | Good default for 3D exploration.        |
| `ortho(eye, target, options)`       | tuple eye/target + ortho bounds hints | Useful for design, line art, and grids. |
| `screenCoords(w, h)`                | width/height                          | Pixel-space style coordinate framing.   |
| `normalizedCoords()`                | none                                  | 0..1 style framing helper.              |
| `cartesianCoords(w, h)`             | width/height                          | Centered cartesian framing helper.      |

### Camera controls options

`perspective(..., options)` and `ortho(..., options)` accept `options.controls` as either:

- `true` to enable defaults (`alt` modifier required for pointer/wheel orbit controls).
- `false` to disable/dispose controls on the camera.
- object config for explicit behavior.

| Control option               | Type                                   | Default         | Notes                                                   |
| ---------------------------- | -------------------------------------- | --------------- | ------------------------------------------------------- |
| `controls.enabled`           | `boolean`                              | `true`          | Set `false` to disable controls explicitly.             |
| `controls.modifier`          | `"none" \| "alt" \| "shift" \| "meta"` | `"alt"`         | Keyboard modifier for pointer/wheel input.              |
| `controls.domElement`        | `HTMLElement`                          | `document.body` | DOM target receiving pointer/wheel events.              |
| top-level control attributes | `unknown`                              | n/a             | Backward-compatible; still forwarded to orbit controls. |

## Transform chain material helpers

| Method                               | Output                           | Notes                                                                        |
| ------------------------------------ | -------------------------------- | ---------------------------------------------------------------------------- |
| `.basic(options)`                    | MeshBasic-style Hydra material   | Lighting-independent shading path.                                           |
| `.lambert(options)`                  | MeshLambert-style Hydra material | Diffuse light response.                                                      |
| `.phong(options)`                    | MeshPhong-style Hydra material   | Specular + shininess response.                                               |
| `.material(typeOrOptions, options?)` | custom material properties       | Use `"basic"`, `"lambert"`, `"phong"` presets or pass object props directly. |
| `.tex(output, options)`              | Texture                          | Render chain to texture for reuse.                                           |
| `.texture(output, options)`          | Texture                          | Alias of `.tex(...)`.                                                        |
| `.texMat(output, options)`           | Material                         | Material with rendered map attached.                                         |

## Output render options

| Option         | Scope                   | Notes                                         |
| -------------- | ----------------------- | --------------------------------------------- |
| `cssRenderer`  | `.render(..., options)` | `"2d"`, `"3d"`, renderer aliases, or `false`. |
| `renderTarget` | compiled pass options   | Route pass output into explicit target.       |
| `autoClear`    | output/scene/chain      | `1` = clear, `<1` = accumulation fade.        |
| `fx`           | output/scene/chain      | Adds post-processing passes.                  |

Object-style render shorthand is also supported:

- `render({ to, target, css, fx, ... })`
- `out({ to, target, css, fx, ... })`

Mappings:

- `to` -> render output
- `target` -> `renderTarget`
- `css` -> `cssRenderer`

## Runtime hooks

| Hook                                         | Purpose                                            |
| -------------------------------------------- | -------------------------------------------------- |
| `update(dt)`                                 | user animation/update function each frame interval |
| `onFrame((dt, time) => void)`                | convenience helper to bind `update` with `time`    |
| `afterUpdate(dt)`                            | post-render callback                               |
| `click`, `mousedown`, `mouseup`, `mousemove` | input event hooks routed from canvas               |
| `keydown`, `keyup`                           | keyboard hooks routed from document                |
| `onError(error, { context, time })`          | centralized runtime error handling                 |
| `liveGlobals(enable?)`                       | toggles runtime global helper installation         |
