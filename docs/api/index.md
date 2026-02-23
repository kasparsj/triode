# API Reference Overview

triode API docs are split into generated signatures and practical reference guides.

## Primary references

- [Generated API Reference](../api.md)
- [Parameter Reference](../reference/parameter-reference.md)
- [Semantic Clarifications](../reference/semantic-clarifications.md)

## API shape

- `HydraRenderer` constructor and runtime lifecycle methods.
- `hydra.synth` livecoding API (`stage`, `scene`, generators, helpers).
- Scene graph composition methods (`mesh`, `points`, `group`, `render`, etc.).
- Transform chain methods (`out`, `render`, `tex`, material bridges).
- Module namespaces: `tx/tex`, `gm/geom`, `mt/mat`, `cmp/compose`, `rnd/random`, `nse/noiseUtil`, `arr`, `el`, `gui`, `math`.

## Suggested reading order

1. Generated signatures in [API Reference](../api.md)
2. Parameter-level details in [Parameter Reference](../reference/parameter-reference.md)
3. Behavior edge cases in [Semantic Clarifications](../reference/semantic-clarifications.md)
