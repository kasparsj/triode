# Release Notes

triode release notes are tracked in `CHANGELOG.md`.

## Current release metadata

- Package version source: `package.json`
- Docs version manifest: `docs/versions.json`
- Generated versioned docs output: `site-dist/docs/latest/` and `site-dist/docs/vX.Y.Z/`

## Read release notes

- [Changelog](../../CHANGELOG.md)

## Release process

- [Release Process](../release.md)
- GitHub workflow: `.github/workflows/release-verify.yml`

## Versioned docs

Versioned docs are generated with:

```bash
npm run site:build:versioned
```

Published versions are listed in:

- `docs/versions.json` (source)
- `site-dist/docs/versions.json` (generated output)
