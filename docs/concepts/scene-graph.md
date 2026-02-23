# Scene Graph Guide

triode scene APIs are a chainable layer over a Three.js scene graph.

## Scene creation

```js
const sc = stage({ name: "main", background: 0x101014 });
```

- `stage()` creates or reuses a scene handle (`scene()` remains as an alias).
- named scenes can be looked up/reused by runtime internals.
- scenes are runtime-scoped, which matters in multi-instance setups.

## Building structure

Use chain methods for common object types:

```js
sc.lights({ all: true })
  .mesh(geom.box(), mat.meshPhong())
  .points([100, 100], mat.dots())
  .render();
```

Groups are useful for transformations and layout:

```js
const g = sc.group({ name: "cluster" });
g.mesh(geom.sphere(), mat.meshLambert());
g.mesh(geom.box(), mat.meshPhong());
compose.circle(g, 2.0);
```

## Querying objects

- `sc.at(index)` returns object by display order (excluding world/light helper groups).
- `sc.find(filter)` returns matching children.
- `sc.empty()` reports whether the scene has children.

## Camera and coordinate helpers

Scene and output chains can both use camera helpers:

- `perspective(eye, target, options)`
- `ortho(eye, target, options)`
- `screenCoords(w, h)`
- `normalizedCoords()`
- `cartesianCoords(w, h)`

## World and lights

- `sc.lights(options)` manages grouped runtime lights.
- `sc.world(options)` manages sky/ground/fog helpers.

These are additive scene utilities, not separate renderers.

## CSS overlays

You can attach DOM objects in 3D or screen-projected space:

- `css2d(element, attrs)`
- `css3d(element, attrs)`

Useful for labels, debugging overlays, and hybrid UI/art pieces.

## Lifecycle and cleanup

A `Triode` instance owns the runtime graph state.

- `triode.dispose()` cleans outputs, sources, renderer state, and scene runtime stores.
- for production embedding, always dispose old runtimes before replacing instances.
