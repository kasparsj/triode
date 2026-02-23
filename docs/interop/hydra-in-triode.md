# Hydra in triode

triode keeps Hydra's chain language while changing the render backend and expanding scene APIs.

## What stays familiar

- `Triode` constructor entrypoint (`Hydra` remains as a compatibility alias).
- Generators and transform chaining (`osc`, `noise`, `src`, `solid`, `modulate`, etc.).
- Output flow (`render`, `out`, `o0..oN`, `s0..sN`).
- Livecoding-oriented eval loops.

## What is new

- Three.js-based scene graph (`stage`, `scene`, `group`, `mesh`, `points`, `lines`).
- Camera helpers (`perspective`, `ortho`, coordinate-space helpers).
- Material bridge methods (`.basic()`, `.lambert()`, `.phong()`, `.tex()`, `.texMat()`).
- Runtime modules for geometry/material/texture/composition utilities.

## Important compatibility boundary

triode is Hydra-flavored, not a strict binary-equivalent drop-in for all internals.

- Avoid relying on upstream regl internals when targeting triode.
- Prefer public APIs documented in [API Reference](../api.md) and [Semantic Clarifications](../reference/semantic-clarifications.md).
- See [Hydra compatibility + architecture differences](../upstream-differences.md) for details.
