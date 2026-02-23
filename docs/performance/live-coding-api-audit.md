# Live-Coding API Audit Implementation

Date: 2026-02-23
Status: Implemented in code + tests

## Scope

This document tracks implementation of the live-coding API hardening items identified in the audit.

## Implemented Changes

### 1) `liveMode: "restart"` now enforces reset semantics

- Updated `eval` to accept per-call options and honor reset behavior:
  - `eval(code, { mode?: "auto" | "continuous" | "restart", reset?: boolean, hush?: boolean })`
  - Default behavior now resets runtime for restart mode unless `reset: false` is passed.
- File: `src/triode-synth.js`

### 2) Runtime error policy with dedupe/rate limiting

- Added configurable runtime error policy:
  - `maxPerSecond`
  - `dedupeWindowMs`
  - `verbose`
  - `pauseOnError`
- Added `_shouldReportRuntimeError` gating and structured warning format:
  - `[triode:<context>] <message>`
- Runtime error callbacks (`onError`) are still supported.
- Files:
  - `src/triode-synth.js`
  - `src/index.d.ts`

### 3) Compile error diagnostics for shader output

- `sourceMixin.out` now routes compile failures to runtime error handling when available (`context: "compile"`) and includes chain context.
- Fallback path logs compile-prefixed warning with actionable summary.
- File: `src/lib/mixins.js`

### 4) Argument coercion hardening (null/NaN safety)

- Hardened number formatting and parsing for shader args.
- Added sampler null/default guard to prevent hard failures.
- Prevented null dereference in texture coercion branch.
- Files:
  - `src/format-arguments.js`
  - `src/glsl/glsl-functions.js` (`map` defaults changed from `NaN` sentinels to explicit vector defaults)

### 5) Reduced hidden side effects in non-global mode

- `detectAudio` default now follows `makeGlobal` when not explicitly set:
  - non-global defaults to disabled
  - global mode defaults to enabled
- Audio globals `a0..aN` are only attached when `makeGlobal: true`.
- Added `a.bin(index, scale, offset)` helper for non-global access.
- Files:
  - `src/triode-synth.js`
  - `src/lib/audio.js`

### 6) Lazy CSS renderer creation

- Added constructor option `cssRenderers: "lazy" | "eager" | false`.
- CSS2D/CSS3D renderers are lazy by default and created only when needed.
- Output path now requests renderer creation on demand when `cssRenderer` is used.
- Files:
  - `src/triode-synth.js`
  - `src/output.js`
  - `src/index.d.ts`

### 7) Chain-consistent scene additions + read touch control

- Added chain-safe helpers:
  - `instancedAdd(...)`
  - `layerAdd(...)`
- Added read helper options:
  - `at(index, { touch?: boolean })`
  - `find(filter, { touch?: boolean })`
  - `obj(index, { touch?: boolean })`
- Files:
  - `src/three/scene.js`
  - `src/index.d.ts`

### 8) Live transport and reset controls

- Added runtime controls:
  - `reset(options?)`
  - `freeze(time?)`
  - `resume()`
  - `step(dtMs?)`
- `resetRuntime` now accepts granular flags (`scene/time/hooks/outputs/sources`).
- `hush` now accepts granular flags (`hooks/outputs/sources`).
- Files:
  - `src/triode-synth.js`
  - `src/index.d.ts`

### 9) Stage camera control modifier default for helper path

- `stage({ camera: { controls: true } })` now defaults control modifier to `"none"` unless explicitly provided.
- File: `src/triode-synth.js`

### 10) `geom.text()` now surfaces explicit behavior

- Added one-time warning for unimplemented `gm.text()` instead of silent behavior.
- File: `src/three/gm.js`

## Type Surface Updates

- Added new option and API types:
  - `TriodeRuntimeErrorPolicy`
  - `TriodeArgPolicy`
  - `TriodeEvalOptions`
  - `TriodeResetOptions`
  - `TriodeCssRenderersMode`
  - `TriodeArrayHelpersMode`
- Added Hydra aliases for these types.
- File: `src/index.d.ts`

## Test Coverage Added/Updated

- Updated and expanded tests to lock new behavior:
  - `tests/src/triode-synth.test.ts`
  - `tests/src/triode-synth-constructor.test.ts`
  - `tests/src/lib/mixins.test.ts`
  - `tests/src/format-arguments.test.ts`
  - `tests/src/public-api.test.ts`
  - `tests/src/three/scene-api.test.ts` (new)

## Verification

- `npm test` passes (63 tests).
- `npm run lint` passes.
- `npm run typecheck` passes.

## Remaining Follow-Up (Not in this implementation)

- Generated explicit transform/module TS typings (autocomplete hardening at scale).
- First-class MIDI/WebSocket runtime adapters.
- Full text geometry implementation for `gm.text()`.
- Snapshot/restore runtime checkpoints.
