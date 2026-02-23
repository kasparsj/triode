# Hydra Core vs Triode Hydra Extensions (Non-3D)

This file tracks **Hydra-language/runtime differences** between upstream Hydra core (`hydra-synth`) and triode that are **not** 3D scene API features.

If you want architecture + 3D differences, see [`docs/upstream-differences.md`](./docs/upstream-differences.md).

## Scope and baseline

- Scope: signal-chain language, transform set, and Hydra-compatible runtime semantics.
- Excluded: `stage/scene/mesh/camera/lights` and other Three.js scene APIs.
- Upstream baseline reference for triode lineage: hydra-synth `1.4` (see `CHANGELOG.md`).

## Added Hydra-language functions in triode

Defined in [`src/glsl/glsl-functions.js`](./src/glsl/glsl-functions.js), absent in upstream `hydra-synth/src/glsl/glsl-functions.js`.

- Noise generators: `snoise`, `pnoise`, `wnoise`, `cnoise`, `fbm`
- Color constructors: `solid2`, `solid3`, `hex`
- Generic (`genType`) operators: `map`, `sin`, `cos`, `tan`, `atan`, `pow`
- Raw shader expression transform: `glsl`
- Explicit rotation helpers: `rotateDeg`, `rotateRad`

Related generated API listing: [`docs/api.md`](./docs/api.md).

## Hydra-compatible behavior differences (non-3D)

- Rotation semantics:
  - `rotate(angle, speed)` remains degree-based compatibility behavior.
  - `rotateDeg(...)` and `rotateRad(...)` make unit intent explicit.
  - See [`docs/reference/semantic-clarifications.md`](./docs/reference/semantic-clarifications.md).
- `src()` includes `glsl300` variant support in triode.
  - See [`docs/upstream-differences.md`](./docs/upstream-differences.md).
- Runtime defaults differ when not using legacy mode:
  - Current default is `makeGlobal: false`, `liveMode: "continuous"`.
  - `legacy: true` restores Hydra-compat defaults (`makeGlobal: true`, `liveMode: "restart"`).
  - See [`docs/reference/semantic-clarifications.md`](./docs/reference/semantic-clarifications.md).

## Compatibility boundary

triode remains Hydra-flavored but not a strict internal/runtime clone of upstream hydra-synth.

- Prefer public APIs and documented semantics over relying on upstream internals.
- For migration context, see [`docs/interop/hydra-equivalents.md`](./docs/interop/hydra-equivalents.md).
