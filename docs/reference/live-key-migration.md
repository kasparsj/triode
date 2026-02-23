# Live-Key Migration (Continuous Mode)

Use this guide when a sketch runs with `liveMode: "continuous"` and you want stable object identity across reruns.

## Why migrate

In continuous mode, unnamed objects now receive source-based auto IDs that reduce reorder drift. Explicit `key` values are still the most stable option across major refactors, extracted helpers, and structural rewrites.

## Quick recipe

1. Add a scene key:

```js
const sc = stage({ key: "main-scene" }).render();
```

2. Add keys to groups and primitives:

```js
const group = sc.group({ name: "orbit-group", key: "orbit-group" });
group.mesh(geom.box(), mat.meshPhong(), { key: "orbit-box-0" });
```

3. Keep keys deterministic:

- Good: `"orbit-box-" + i` for looped objects.
- Avoid random keys if you want reuse across reruns.

4. Keep names for readability, keys for identity:

```js
sc.mesh(geom.box(), mat.meshPhong(), {
  name: "hero",
  key: "hero-mesh",
});
```

## Automated audit helper

Run:

```bash
npm run migrate:report-live-keys
```

This scans `examples/` and `site/playground/` for unkeyed calls to:

- `stage(...)` / `scene(...)`
- `.group(...)`
- `.mesh(...)`
- `.points(...)`
- `.lines(...)`
- `.line(...)`
- `.lineLoop(...)` / `.lineloop(...)`
- `.lineStrip(...)` / `.linestrip(...)`

Use custom paths:

```bash
node ./scripts/migrate/find-unkeyed-live-calls.mjs src examples/my-set.js
```

Machine-readable output:

```bash
node ./scripts/migrate/find-unkeyed-live-calls.mjs --json
```

CI-style fail on findings:

```bash
node ./scripts/migrate/find-unkeyed-live-calls.mjs --strict
```

Targeted gate for playground presets:

```bash
npm run migrate:check-live-keys:playground
```

## Notes

- The helper reports likely unkeyed call sites; it does not rewrite files automatically.
- Dynamic option objects (for example, `const opts = { ... }; stage(opts)`) are treated conservatively and may require manual review.
