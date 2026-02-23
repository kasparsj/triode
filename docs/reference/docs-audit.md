# Documentation Audit

Audit date: 2026-02-23

## Toolchain and entry points

- Site generator: custom Node script at `scripts/site/build-site.mjs`
- Versioned site build: `scripts/site/build-versioned-site.mjs`
- Runtime bundle build dependency for site examples: `npm run build` (`scripts/build/prepare-dist.mjs` + Vite)
- API docs generation from source types/exports: `scripts/docs/generate-api-docs.mjs`
- Docs quality gates:
  - `scripts/docs/verify-doc-coverage.mjs`
  - `scripts/docs/check-links.mjs`
  - `scripts/docs/check-snippets.mjs`

Package scripts:

- `npm run docs:generate`
- `npm run docs:verify-sync`
- `npm run docs:verify-coverage`
- `npm run docs:check-snippets`
- `npm run docs:check-links`
- `npm run site:build`
- `npm run site:build:versioned`

## Content locations

- Primary docs markdown: `docs/**/*.md`
- Generated API artifacts: `docs/api.md`, `docs/.generated/api-manifest.json`, `docs/.generated/transforms.json`
- Examples source: `examples/**/*.js`, `examples/README.md`
- Playground source: `site/playground/index.html`, `site/playground/playground.js`, `site/playground/examples.js`
- Site CSS/theme: `site/static/site.css`

## Deployment and CI

- CI checks: `.github/workflows/ci.yml`
  - includes docs sync, coverage, snippets, link checks, lint, typecheck, build, site build
- Pages deploy: `.github/workflows/pages.yml`
  - builds runtime + versioned site and deploys `site-dist/` to GitHub Pages

## Example hosting model

- During site build, examples are auto-discovered from `examples/**/*.js`
- Runnable HTML pages are generated into `site-dist/examples/**/*.html`
- Playground is copied from `site/playground/` to `site-dist/playground/`

## Gap report (vs Hydra docs intent)

This gap list reflects the pre-upgrade docs shape that this change set targets.

- Onboarding was present but concentrated in one long page; no explicit first-patch flow.
- No dedicated docs landing page routing users to quickstart + core concepts.
- Sidebar navigation was flat and ungrouped; discoverability dropped as page count grew.
- No next/previous navigation between docs pages.
- No built-in local docs search.
- API generated docs were mostly symbol lists without full signatures and explanatory notes.
- No explicit Hydra translation layer page for "same vs different" workflow mapping.
- Troubleshooting/FAQ and glossary pages were missing.
- No reference index and no examples index page in docs IA.
- Docs contributor checklist was missing.
