## Testing Coverage Map

This map lists the current high-value targets and the behavior locked by automated tests.

| Target | Behaviors to lock | Edge cases | Test type |
| --- | --- | --- | --- |
| `src/package-entry.js` export contract (via `package.json`) | Main export path remains browser entrypoint and types/require map stays stable | Accidental export path drift | Unit |
| `src/triode-synth.js` API surface | Public methods remain present (`eval`, `stage`, `tick`, `dispose`, etc.) and Hydra alias remains equivalent | Breaking API removals/renames | Unit |
| `src/lib/mixins.js` source chaining | `out/render/tex/clear` keep chain semantics and option normalization | Render option object signatures (`to`, `target`, `css`) | Unit |
| `src/glsl-source.js` chain helpers | `material/basic/phong/lambert/st` return same chain object and preserve transform composition | `genType` transform coercion in `st(...)` | Unit |
| `src/format-arguments.js` parameter normalization | Defaults are applied consistently, scalar/vector coercion remains stable | `null`, `undefined`, `NaN`, render targets, `Output`/`Source` inputs, bad function return values | Unit |
| `src/lib/clock.js` deterministic runtime time | Time advancement and reset semantics are deterministic and finite-value safe | `NaN`, `Infinity`, invalid custom clocks | Unit |
| `src/three/runtime.js` runtime scoping | Runtime scoping and module binding semantics stay stable | Missing runtime, nested runtime scope restoration | Unit |
| `src/three/rnd.js` random determinism seam | Random helpers remain deterministic with injected generator | Cache behavior, integer bounds, gaussian helper input | Unit |
| `src/lib/runtime-adapters.js` constructor seam | Runtime creation dependencies remain injectable for renderer/audio/loop and graph setup | Partial adapter overrides and browser-only default paths | Unit |
| `src/canvas.js` hot runtime wiring | Canvas listeners are bound once and input events route to active runtime | Runtime replacement, disposed runtime no-op, HiDPI helper | Unit |
| `src/triode-synth.js` live-coding lifecycle | Continuous eval begin/end hooks, reset behavior, non-fatal tick/update error handling, dispose idempotency | Handler throws, invalid clear amount (`NaN`), repeated dispose calls | Integration-lite |
| `src/output.js` render adapter orchestration | Pass assembly, FX pass integration, CSS render routing, and offscreen texture flow stay stable | Explicit render targets, fade clears, stop/dispose edge cases | Unit |
| `src/three/scene.js` continuous live reconciliation | Untouched objects/scenes are pruned and removed resources are disposed after live cycles | Scene identity reuse, resource disposal on removal, stale-scene recreation | Unit |

## Current Coverage Gate Scope

Coverage thresholds currently gate the deterministic core modules listed in `vitest.config.mjs`:

- `src/triode-synth.js`
- `src/lib/clock.js`
- `src/format-arguments.js`
- `src/three/runtime.js`
- `src/three/rnd.js`

This keeps CI runtime fast while new tests are being added to larger WebGL-heavy modules.

## Threshold Ramp Plan

1. Add `src/output.js` and focused `src/three/scene.js` modules to coverage gate once branch density improves.
2. Add targeted tests for renderer/audio adapters in `src/lib/runtime-adapters.js`.
3. Expand integration coverage for multi-instance runtime behavior and browser entrypoint protections.
4. Raise coverage thresholds after each expansion milestone.
