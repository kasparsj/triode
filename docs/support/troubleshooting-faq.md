# Troubleshooting + FAQ

## Quick diagnostics

1. Confirm browser runtime (not pure Node/SSR runtime execution).
2. Confirm `Hydra` construction succeeds and a canvas exists.
3. Check console for shader/runtime errors.
4. Temporarily reduce sketch complexity to isolate pipeline issues.

## FAQ

### Why do I get `global is not defined` with Vite?

Add:

```js
// @illustrative
define: {
  global: {},
}
```

Reference: <https://github.com/vitejs/vite/discussions/5912>

### Why are helpers like `osc` unavailable?

You are likely in non-global mode.

Use either:

- `new Hydra({ makeGlobal: true })`, or
- `const H = hydra.synth; H.osc(...)`.

### How do I preserve object identity while livecoding?

Use explicit `key` values in continuous mode (`liveMode: "continuous"`).
See [Live-Key Migration](../reference/live-key-migration.md).

### Why are camera controls not responding?

Check camera options:

- `controls: true` or `controls: { enabled: true }`
- Modifier requirement defaults to `alt` unless changed.
- Ensure the intended `domElement` receives pointer events.

### Why is performance unstable?

Review:

- [Advanced Performance Notes](../performance/advanced-performance.md)
- [Production Checklist](../production-checklist.md)

### How should host apps clean up?

Call `hydra.dispose()` before replacing runtime instances.
Also remove any external references to old runtime objects.
