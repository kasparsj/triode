## triode

triode is a three.js-powered live coding engine for 3D scene APIs while keeping Hydra-style live coding workflows.

### Project status

- Experimental, actively maintained.
- API goal: remain compatible with core Hydra patterns and add 3D-specific capabilities.

## Hydra Compatibility

- triode can be used as a drop-in runtime replacement for `hydra-synth` in Hydra editor/REPL-style setups.
- Replace the loaded runtime bundle with triode's `dist/triode.js`. `Triode` is the primary global entrypoint and `Hydra` remains available as a compatibility alias.
- This repository includes Hydra-compatible runtime pieces, but the main product direction is 3D live coding through triode's Three.js API.
- Non-3D Hydra-language delta (core Hydra vs triode Hydra extensions): [`HYDRA_EXTENSIONS.md`](./HYDRA_EXTENSIONS.md).

## Upstream Attribution

- triode builds on work from the Hydra ecosystem, especially `hydra-synth`.
- Original Hydra / hydra-synth authors include `ojack` (Olivia Jack) and project contributors.
- Upstream projects:
  - Hydra: <https://github.com/hydra-synth/hydra>
  - hydra-synth: <https://github.com/hydra-synth/hydra-synth>
- Repository-level provenance details are tracked in [`NOTICE`](./NOTICE).

## Project Site

- GitHub Pages publishes docs and runnable examples from this repository.
- Interactive playground: `https://kasparsj.github.io/triode/playground/index.html`
- Versioned docs are published under `/docs/latest/` and `/docs/vX.Y.Z/`.
- Local site build output: `site-dist/`
- Build locally:

```bash
npm run build
npm run site:build
npm run site:build:versioned
```

## Example

```javascript
// setup perspective camera, enabling camera controls
// default modifier is "alt"; use modifier:"none" for no-key live coding
perspective([2, 2, 3], [0, 0, 0], {
  controls: { enabled: true, modifier: "none" },
});

// create geometry and material
const boxMaterial = osc().rotateDeg(noise(1).mult(45)).phong();

// compose scene
const sc = stage().lights().box(boxMaterial).render();

update = () => {
  const box = sc.obj(0);
  box.rotation.x += 0.01;
  box.rotation.y += 0.01;
};
```

More examples: [`examples/README.md`](./examples/README.md)

## 3D APIs (summary)

### Camera + coordinate helpers

- `perspective(eye, target, options)`
- `ortho(eye, target, options)`
- `screenCoords(w, h)`, `normalizedCoords()`, `cartesianCoords(w, h)`

### Scene composition

- `stage(config)` is the readability-first scene entry point (`scene(config)` remains available as an alias).
- Core object methods: `.box()`, `.sphere()`, `.quad()`, `.mesh()`, `.instanced()`.
- Line/point methods: `.points()`, `.lines()`, `.lineStrip()`, `.lineLoop()`.
- Scene utilities: `.group()`, `.lights()`, `.world()`, `.clear()`, `.render()` (`.out()` alias).
- Query helpers: `.at()`/`.obj()`, `.find()`, `.empty()`.
- Compatibility aliases remain available: `.linestrip()` and `.lineloop()`.

### Namespaces

- Geometry API is exposed under `geom` (`gm` alias), e.g. `geom.box()`.
- Material API is exposed under `mat` (`mt` alias), e.g. `mat.meshPhong()`, `mat.meshStandard()`.
- Texture API is exposed under `tex` (`tx` alias), e.g. `tex.load(...)`, `tex.fbo(...)`.

For full signatures and options, see [`docs/reference/parameter-reference.md`](./docs/reference/parameter-reference.md) and [`docs/api.md`](./docs/api.md).


## 10-minute quickstart

### Option A: Browser script tag (fastest)

Use jsDelivr from this repository:

```html
<script src="https://cdn.jsdelivr.net/gh/kasparsj/triode@v1.0.0/dist/triode.js"></script>
<script>
  const triode = new Triode({ detectAudio: false, makeGlobal: true });
  perspective([2, 2, 3], [0, 0, 0], {
    controls: { enabled: true, modifier: "none" },
  });
  stage()
    .lights({ all: true })
    .mesh(geom.box(), osc(8, 0.1, 0.8).rotateDeg(noise(1).mult(45)).phong())
    .render();
</script>
```

For production, pin to a release tag or commit (do not use floating refs).
For Hydra editor/REPL embeddings, this bundle is intended as a drop-in runtime replacement for `hydra-synth`.

Success criteria:

- You see animated output immediately.
- `Triode` is available on `window` (`Hydra` alias is also available for compatibility).

### Option B: npm + bundler

```bash
npm i github:kasparsj/triode#v1.0.0 three
```

For this repository, import `triode`.

```js
import Triode from "triode";

const triode = new Triode({
  detectAudio: false,
  makeGlobal: true,
});

perspective([2, 2, 3], [0, 0, 0], {
  controls: { enabled: true, modifier: "none" },
});
stage()
  .lights({ all: true })
  .mesh(geom.box(), osc(8, 0.1, 0.8).rotateDeg(noise(1).mult(45)).phong())
  .render();
```

Non-global mode is also supported:

```js
import Triode from "triode";

const triode = new Triode({
  detectAudio: false,
  makeGlobal: false,
});

const H = triode.synth;
H.perspective([2, 2, 3], [0, 0, 0], {
  controls: { enabled: true, modifier: "none" },
});
H.stage()
  .lights({ all: true })
  .mesh(H.geom.box(), H.osc(8, 0.1, 0.8).rotateDeg(H.noise(1).mult(45)).phong())
  .render();
```

#### Vite note

If Vite reports `ReferenceError: global is not defined`, add:

```js
// @illustrative
define: {
  global: {},
}
```

Refs:

- <https://github.com/vitejs/vite/discussions/5912#discussioncomment-1724947>
- <https://github.com/vitejs/vite/discussions/5912#discussioncomment-2908994>

## Local development

```bash
npm ci
npm run dev
```

This starts a Vite live-reload dev server using `dev/index.html` and `dev/index.js`.

Useful checks:

```bash
npm run ci:check
npm run lint
npm run typecheck
npx playwright install chromium firefox
npm run test:smoke:browser
npm run site:build
```

## Tests

Run the unit and integration-lite test suite:

```bash
npm test
```

Watch mode for local development:

```bash
npm run test:watch
```

Run with coverage:

```bash
npm run test:coverage
```

CI-focused run (coverage + concise reporter):

```bash
npm run test:ci
```

Coverage reports:

- Terminal summary is printed on every coverage run.
- HTML report is generated at `coverage/index.html`.
- LCOV output is generated at `coverage/lcov.info`.

Test conventions:

- Place tests under `tests/` mirroring `src/` paths where practical.
- Prefer pure unit tests for deterministic logic and state transitions.
- Use jsdom only for browser/event wiring behavior.
- Avoid real GPU/WebGL in unit tests; test adapter interactions instead.
- Lock public API behavior explicitly (exports, method surface, chain semantics).
- Prefer injecting `clock` and `adapters` options in `Triode` tests for deterministic runtime coverage.

Coverage map and ramp plan: [`docs/testing-plan.md`](./docs/testing-plan.md).

GUI note:

- `gui.init()` now tries local vendored `dat.gui` first (`/vendor/dat.gui.min.js`, `vendor/dat.gui.min.js`), then CDN fallback.
- If all script loads fail, it falls back to a no-op GUI object so runtime code does not crash.

## License (AGPL-3.0)

- triode is licensed `AGPL-3.0-only` (see [`LICENSE`](./LICENSE)).
- triode includes portions derived from Hydra / hydra-synth; see [`NOTICE`](./NOTICE) and [`docs/compliance/agpl_audit.md`](./docs/compliance/agpl_audit.md).
- Third-party dependency license inventory: [`docs/compliance/third_party_licenses.md`](./docs/compliance/third_party_licenses.md).
