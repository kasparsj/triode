## triode

triode is a three.js-powered live coding engine for 3D scene APIs while keeping Hydra-style live coding workflows.

### Project status

- Experimental, actively maintained.
- API goal: remain compatible with core Hydra patterns and add 3D-specific capabilities.

## Hydra Compatibility

- triode can be used as a drop-in runtime replacement for `hydra-synth` in Hydra editor/REPL-style setups.
- Replace the loaded runtime bundle with triode's `dist/triode.js`. `Triode` is the primary global entrypoint and `Hydra` remains available as a compatibility alias.
- This repository includes Hydra-compatible runtime pieces, but the main product direction is 3D live coding through triode's Three.js API.

## Distribution Model

- Official distribution is via GitHub tags and release artifacts from this repository.
- CDN usage should reference a pinned tag in this repository.
- Package name is `triode`.
- `package.json` remains `private: true` so releases stay on Git tags and GitHub artifacts.
- Install triode from this repository tag: `npm i github:kasparsj/triode#v1.0.0 three`.
- Install upstream Hydra separately with `npm i hydra-synth` only if you explicitly want upstream behavior.

## Runtime Contract

- Runtime target is browser execution (WebGL + DOM APIs required).
- The ESM package entry is browser-only; importing in pure Node/SSR without a browser-like runtime is unsupported.
- For server-side build pipelines, run triode code in browser contexts and publish artifacts from CI.

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

## 10-minute quickstart

### Option A: Browser script tag (fastest)

Use jsDelivr from this repository:

```html
<script src="https://cdn.jsdelivr.net/gh/kasparsj/triode@v1.0.0/dist/triode.js"></script>
<script>
  const triode = new Triode({ detectAudio: false });
  osc(8, 0.1, 0.8).render();
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

If you want upstream Hydra instead, install `npm i hydra-synth`. For this repository, import `triode`.

```js
import Triode from "triode";

const triode = new Triode({
  detectAudio: false,
  makeGlobal: true,
});

osc(8, 0.1, 0.8).render();
```

Non-global mode is also supported:

```js
import Triode from "triode";

const triode = new Triode({
  detectAudio: false,
  makeGlobal: false,
});

const H = triode.synth;
H.osc(8, 0.1, 0.8).render();
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

GUI note:

- `gui.init()` now tries local vendored `dat.gui` first (`/vendor/dat.gui.min.js`, `vendor/dat.gui.min.js`), then CDN fallback.
- If all script loads fail, it falls back to a no-op GUI object so runtime code does not crash.

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

### Camera

- `perspective(eye, target, options)`
- `ortho(eye, target, options)`

### Scene

- `stage()` is the readability-first scene handle entry point (`scene()` remains available as an alias).

### Geometry

- Geometry functions are exposed under `geom` (`gm` remains available for compatibility).
- Example: `geom.box()`.

### Material

- Material functions are exposed under `mat` (`mt` remains available for compatibility).
- Example: `mat.meshPhong()`.

## Production guidance

Use these docs before shipping:

- Getting started: [`docs/getting-started.md`](./docs/getting-started.md)
- API reference (generated from source): [`docs/api.md`](./docs/api.md)
- Hydra -> 3D mental model: [`docs/concepts/hydra-to-3d-mental-model.md`](./docs/concepts/hydra-to-3d-mental-model.md)
- Scene graph guide: [`docs/concepts/scene-graph.md`](./docs/concepts/scene-graph.md)
- Rendering pipeline guide: [`docs/concepts/rendering-pipeline.md`](./docs/concepts/rendering-pipeline.md)
- Chaining patterns: [`docs/concepts/chaining-composition.md`](./docs/concepts/chaining-composition.md)
- Parameter reference tables: [`docs/reference/parameter-reference.md`](./docs/reference/parameter-reference.md)
- Semantic clarifications: [`docs/reference/semantic-clarifications.md`](./docs/reference/semantic-clarifications.md)
- Common creative recipes: [`docs/recipes/common-recipes.md`](./docs/recipes/common-recipes.md)
- Playground guide: [`docs/playground.md`](./docs/playground.md)
- Advanced performance notes: [`docs/performance/advanced-performance.md`](./docs/performance/advanced-performance.md)
- Hydra compatibility + architecture differences: [`docs/upstream-differences.md`](./docs/upstream-differences.md)
- Production checklist: [`docs/production-checklist.md`](./docs/production-checklist.md)
- Release process: [`docs/release.md`](./docs/release.md)
- Security policy: [`SECURITY.md`](./SECURITY.md)
- Contribution guide: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- Issue templates: [`.github/ISSUE_TEMPLATE`](./.github/ISSUE_TEMPLATE)

## Trust signals

- CI runs build + smoke + package checks on Node 20 and 22.
- CI runs real Chromium and Firefox smoke tests of `examples/quickstart.html` on Node 20.
- CI runs non-global and multi-instance 3D browser smoke tests on Chromium and Firefox.
- CI validates all source examples for syntax integrity and runs generated examples + playground preset browser smoke coverage in Chromium.
- Release tags (`v*`) run version/changelog/tag metadata verification and attach tarball + checksum artifacts.
- GitHub Pages deploys generated docs and runnable examples from repository sources on every push to `main`.

## License

AGPL-3.0-only (see [`LICENSE`](./LICENSE)).
