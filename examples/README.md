## Examples

These scripts are grouped by visual primitive or workflow.

### General
- `box.js` - [Run](https://kasparsj.github.io/triode/examples/box.html)
- `box-tex.js` - [Run](https://kasparsj.github.io/triode/examples/box-tex.html)
- `box-instanced-grid.js` - [Run](https://kasparsj.github.io/triode/examples/box-instanced-grid.html)
- `tex-map.js` - [Run](https://kasparsj.github.io/triode/examples/tex-map.html)
- `cmp-noise.js` - [Run](https://kasparsj.github.io/triode/examples/cmp-noise.html)
- `cmp-stack.js` - [Run](https://kasparsj.github.io/triode/examples/cmp-stack.html)

### Line loop
- `lineloop/lineloop.js` - [Run](https://kasparsj.github.io/triode/examples/lineloop/lineloop.html)
- `lineloop/sphere.js` - [Run](https://kasparsj.github.io/triode/examples/lineloop/sphere.html)
- `lineloop/thread.js` - [Run](https://kasparsj.github.io/triode/examples/lineloop/thread.html)

### Lines
- `lines/lines.js` - [Run](https://kasparsj.github.io/triode/examples/lines/lines.html)
- `lines/noise.js` - [Run](https://kasparsj.github.io/triode/examples/lines/noise.html)

### Line strip
- `linestrip/thread.js` - [Run](https://kasparsj.github.io/triode/examples/linestrip/thread.html)

### Points
- `points/dots.js` - [Run](https://kasparsj.github.io/triode/examples/points/dots.html)
- `points/grid.js` - [Run](https://kasparsj.github.io/triode/examples/points/grid.html)
- `points/noise.js` - [Run](https://kasparsj.github.io/triode/examples/points/noise.html)
- `points/noise-flow.js` - [Run](https://kasparsj.github.io/triode/examples/points/noise-flow.html)
- `points/squares.js` - [Run](https://kasparsj.github.io/triode/examples/points/squares.html)

## Running examples locally

1. Start the local dev server:

```bash
npm ci
npm run dev
```

2. Edit `dev/index.js` to load one of these files, or paste snippets into your host app using the same APIs.

For an immediate zero-edit sanity check, open `examples/quickstart.html` in a static server that serves the repository root (it expects `../dist/triode.js`).
