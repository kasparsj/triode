# Timing and State

triode exposes frame timing and mutable live state through `triode.synth`.

## Time and frame hooks

- `time`: seconds-like runtime clock advanced during `tick`.
- `update(dt)`: per-frame user callback.
- `afterUpdate(dt)`: post-render callback.
- `onFrame((dt, time) => {})`: helper that sets `update` with direct time access.

## Inputs and interaction

Input hooks are part of synth state:

- `click`, `mousedown`, `mouseup`, `mousemove`
- `keydown`, `keyup`

These are useful for parameter nudging and interaction-driven sketches.

## Global and non-global state

- `makeGlobal: true`: installs helpers on global scope.
- `makeGlobal: false`: keeps API under `triode.synth`.
- `liveGlobals(enable?)`: toggles this behavior at runtime.

For embedded apps and multi-instance reliability, prefer non-global mode.

## Stateful render behavior

Accumulation behavior is controlled by clear settings:

- Output level: `o0.clear(...)` / `o0.autoClear(...)`
- Scene/chain level: `stage().clear(...)`, `osc(...).clear(...)`

`amount < 1` keeps trails/fade accumulation; `amount >= 1` behaves as full clear.
