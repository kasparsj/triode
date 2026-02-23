# Documentation Checklist

Use this checklist before merging documentation updates.

## Accuracy

- Confirm behavior against source (`src/`) or generated API (`npm run docs:generate`).
- Avoid implying Hydra compatibility where behavior differs.
- Keep examples aligned with current API names (`stage`, `geom`, `mat`, `tex`, etc.).

## Structure and discoverability

- Add or update entries in the docs IA when introducing new topics.
- Link new guides from at least one index page (`docs/index.md`, `docs/reference/index.md`, or section index).
- Ensure new pages have clear "next step" links.

## Quality gates

- Run `npm run docs:generate`.
- Run `npm run docs:verify-sync`.
- Run `npm run docs:verify-coverage`.
- Run `npm run docs:check-links`.
- Run `npm run site:build`.

## Snippets

- Prefer runnable snippets that match repository APIs.
- If a snippet is conceptual only, mark it as illustrative.
- Keep snippets short and focused on one idea.

## Release and maintenance

- Add changelog notes for user-visible docs changes when relevant.
- If API behavior changed, update both conceptual guides and reference pages.
- Verify docs versioning and landing links still route correctly after site build.
