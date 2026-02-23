# Livecoding Workflow

triode supports both quick in-browser sketching and host-application embedding.

## Recommended loop

1. Start in a fast sketch context (global mode or playground).
2. Move to named scenes/objects and explicit keys for stable iteration.
3. Transition to non-global mode for host integration and multi-instance reliability.

## Runtime modes

- `liveMode: "continuous"`: persistent runtime; best for live editing.
- `liveMode: "restart"`: full reset each eval; best for strict reruns.
- Per-eval override: `triode.eval(code, { mode, reset, hush })`.

## Global vs non-global

Hydra-style global sketching:

```js
const triode = new Triode({ makeGlobal: true, detectAudio: false });
osc(8, 0.1, 0.8).render();
```

Host-safe embedding:

```js
const triode = new Triode({ makeGlobal: false, detectAudio: false });
const H = triode.synth;
H.stage().mesh(H.geom.box(), H.osc(8).phong()).render();
```

## Playground usage

Use the interactive playground for fast recipe edits and sharable links:

- [Playground Guide](../playground.md)
- Published page: `https://kasparsj.github.io/triode/playground/index.html`

## Lifecycle hygiene

- Call `triode.dispose()` when replacing runtime instances.
- In host apps, keep one clear owner of runtime lifecycle.
- Route `onError` to application logging/telemetry.
- Use `triode.freeze()`, `triode.step()`, and `triode.resume()` for deterministic live patching.
- Use `triode.reset({ scene, time, hooks, outputs, sources })` for granular panic/reset flows.
