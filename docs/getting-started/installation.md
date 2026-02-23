# Installation

triode is distributed from this repository (Git tags and release artifacts).

## Browser script tag

```html
<script src="https://cdn.jsdelivr.net/gh/kasparsj/triode@v1.0.0/dist/triode.js"></script>
<script>
  const triode = new Triode({ detectAudio: false, makeGlobal: true });
  osc(8, 0.1, 0.8).render();
</script>
```

## npm + bundler

```bash
npm i github:kasparsj/triode#v1.0.0 three
```

```js
import Triode from "triode";

const triode = new Triode({
  detectAudio: false,
  makeGlobal: false,
});

const H = triode.synth;
H.osc(8, 0.1, 0.8).render();
```

## Runtime expectations

- Browser runtime only (`window` + `document` are required at runtime).
- For host apps and multiple instances, prefer `makeGlobal: false`.
- For rapid sketching, use `makeGlobal: true`.

## Verify install

- You see animated output on a canvas.
- No runtime errors in the browser console.
- `Triode` exists on `window` in script-tag mode (`Hydra` alias remains available).
