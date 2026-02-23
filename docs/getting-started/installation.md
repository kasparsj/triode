# Installation

triode is distributed from this repository (Git tags and release artifacts).

## Browser script tag

```html
<script src="https://cdn.jsdelivr.net/gh/kasparsj/triode@v1.0.0/dist/triode.js"></script>
<script>
  const hydra = new Hydra({ detectAudio: false, makeGlobal: true });
  osc(8, 0.1, 0.8).render();
</script>
```

## npm + bundler

```bash
npm i github:kasparsj/triode#v1.0.0 three
```

```js
import Hydra from "triode";

const hydra = new Hydra({
  detectAudio: false,
  makeGlobal: false,
});

const H = hydra.synth;
H.osc(8, 0.1, 0.8).render();
```

## Runtime expectations

- Browser runtime only (`window` + `document` are required at runtime).
- For host apps and multiple instances, prefer `makeGlobal: false`.
- For rapid sketching, use `makeGlobal: true`.

## Verify install

- You see animated output on a canvas.
- No runtime errors in the browser console.
- `Hydra` exists on `window` in script-tag mode.
