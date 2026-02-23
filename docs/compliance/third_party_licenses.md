# Third-party license inventory

Generated: 2026-02-23T13:31:12.524Z

This inventory is generated from:
- `package.json` (direct runtime + dev dependencies)
- `package-lock.json` (lockfile package metadata)

## Direct runtime dependencies

| Package | Declared range | Resolved license | Evidence |
| --- | --- | --- | --- |
| `gl-mat4` | `^1.2.0` | `Zlib` | `node_modules/gl-mat4/package.json` |
| `glsl-film-grain` | `^1.0.4` | `MIT` | `node_modules/glsl-film-grain/package.json` |
| `meyda` | `^5.6.3` | `MIT` | `node_modules/meyda/package.json` |
| `raf-loop` | `^1.1.3` | `MIT` | `node_modules/raf-loop/package.json` |
| `three` | `^0.157.0` | `MIT` | `node_modules/three/package.json` |

## Direct development dependencies

| Package | Declared range | Resolved license | Evidence |
| --- | --- | --- | --- |
| `@types/node` | `^25.3.0` | `MIT` | `node_modules/@types/node/package.json` |
| `eslint` | `^10.0.1` | `MIT` | `node_modules/eslint/package.json` |
| `glslify` | `^7.1.1` | `MIT` | `node_modules/glslify/package.json` |
| `playwright` | `1.56.1` | `Apache-2.0` | `node_modules/playwright/package.json` |
| `prettier` | `^3.5.3` | `MIT` | `node_modules/prettier/package.json` |
| `typescript` | `^5.7.3` | `Apache-2.0` | `node_modules/typescript/package.json` |
| `vite` | `^6.4.1` | `MIT` | `node_modules/vite/package.json` |

## Lockfile scan summary

- Total lockfile package entries (excluding root): 250
- Entries with an explicit `license` field: 146
- Entries missing a `license` field: 104
- Entries with `SEE LICENSE IN ...`: 0
- Entries with explicit unknown/unlicensed markers: 0
- Entries matching non-OSS risk markers: 0

## Flags

### Missing lockfile license field (risk: metadata gap)
- `node_modules/@choojs/findup`
- `node_modules/acorn`
- `node_modules/babel-plugin-add-module-exports`
- `node_modules/bl`
- `node_modules/buffer-alloc`
- `node_modules/buffer-alloc-unsafe`
- `node_modules/buffer-fill`
- `node_modules/buffer-from`
- `node_modules/commander`
- `node_modules/concat-stream`
- `node_modules/core-util-is`
- `node_modules/dct`
- `node_modules/debug`
- `node_modules/deep-is`
- `node_modules/duplexify`
- `node_modules/end-of-stream`
- `node_modules/escodegen`
- `node_modules/escodegen/node_modules/source-map`
- `node_modules/esprima`
- `node_modules/estraverse`
- `node_modules/esutils`
- `node_modules/events`
- `node_modules/falafel`
- `node_modules/fast-levenshtein`
- `node_modules/fftjs`
- `node_modules/from2`
- `node_modules/fsevents`
- `node_modules/gl-mat4`
- `node_modules/glsl-film-grain`
- `node_modules/glsl-inject-defines`
- `node_modules/glsl-noise`
- `node_modules/glsl-resolve`
- `node_modules/glsl-resolve/node_modules/resolve`
- `node_modules/glsl-resolve/node_modules/xtend`
- `node_modules/glsl-token-assignments`
- `node_modules/glsl-token-defines`
- `node_modules/glsl-token-depth`
- `node_modules/glsl-token-descope`
- `node_modules/glsl-token-inject-block`
- `node_modules/glsl-token-properties`
- `node_modules/glsl-token-scope`
- `node_modules/glsl-token-string`
- `node_modules/glsl-token-whitespace-trim`
- `node_modules/glsl-tokenizer`
- `node_modules/glsl-tokenizer/node_modules/isarray`
- `node_modules/glsl-tokenizer/node_modules/readable-stream`
- `node_modules/glsl-tokenizer/node_modules/string_decoder`
- `node_modules/glsl-tokenizer/node_modules/through2`
- `node_modules/glslify`
- `node_modules/glslify-bundle`
- `node_modules/glslify-deps`
- `node_modules/graceful-fs`
- `node_modules/has`
- `node_modules/inherits`
- `node_modules/is-core-module`
- `node_modules/is-extglob`
- `node_modules/is-glob`
- `node_modules/isarray`
- `node_modules/isexe`
- `node_modules/levn`
- `node_modules/map-limit`
- `node_modules/map-limit/node_modules/once`
- `node_modules/minimist`
- `node_modules/ms`
- `node_modules/murmurhash-js`
- `node_modules/node-getopt`
- `node_modules/once`
- `node_modules/optionator`
- `node_modules/path-parse`
- `node_modules/performance-now`
- `node_modules/prelude-ls`
- `node_modules/process-nextick-args`
- `node_modules/raf`
- `node_modules/raf-loop`
- `node_modules/raf-loop/node_modules/events`
- `node_modules/readable-stream`
- `node_modules/readable-stream/node_modules/isarray`
- `node_modules/readable-stream/node_modules/safe-buffer`
- `node_modules/readable-stream/node_modules/string_decoder`
- `node_modules/resolve`
- `node_modules/right-now`
- `node_modules/safe-buffer`
- `node_modules/shallow-copy`
- `node_modules/stack-trace`
- `node_modules/static-eval`
- `node_modules/stream-parser`
- `node_modules/stream-parser/node_modules/debug`
- `node_modules/stream-parser/node_modules/ms`
- `node_modules/stream-shift`
- `node_modules/supports-preserve-symlinks-flag`
- `node_modules/three`
- `node_modules/through2`
- `node_modules/type-check`
- `node_modules/typedarray`
- `node_modules/util-deprecate`
- `node_modules/wav`
- `node_modules/wav/node_modules/debug`
- `node_modules/wav/node_modules/isarray`
- `node_modules/wav/node_modules/ms`
- `node_modules/wav/node_modules/readable-stream`
- `node_modules/wav/node_modules/string_decoder`
- `node_modules/word-wrap`
- `node_modules/wrappy`
- `node_modules/xtend`

### `SEE LICENSE IN ...`
- None

### Explicit unknown/unlicensed markers
- None

### Potential non-OSS markers
- None

## Notes

- A missing lockfile `license` field does not automatically mean the package is unlicensed; some lock entries omit this metadata.
- Before a production release, verify missing entries against each package's published license files when required.

