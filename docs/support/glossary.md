# Glossary

## Hydra and triode terms

- **Chain**: A composable sequence of generators/transforms that compiles to shader/passes.
- **Output (`o0`, `o1`, ... )**: Render target pipeline endpoint.
- **Source (`s0`, `s1`, ... )**: Input texture/media slots.
- **Continuous mode**: Live eval mode that keeps one runtime instance and reconciles edits.
- **Restart mode**: Live eval mode that rebuilds runtime state on each eval.
- **Global mode**: Helpers installed on global scope (`osc`, `stage`, etc.).
- **Non-global mode**: API accessed via `hydra.synth` namespace.
- **Stage**: triode helper that creates a scene and can apply camera/lights/world/render presets.
- **Scene graph**: Hierarchical object model used for 3D composition.
- **Render-to-texture**: Rendering a chain/scene into a texture for reuse (`.tex()`).
- **Material bridge**: Converting chain output into a material (`.basic()`, `.lambert()`, `.phong()`, `.texMat()`).
- **Auto clear / accumulation**: Clear behavior controlling trail/fade persistence between frames.
- **Runtime modules**: Namespaced helper APIs such as `geom`, `mat`, `tex`, `compose`, `random`.
