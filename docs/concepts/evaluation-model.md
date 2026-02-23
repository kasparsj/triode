# Evaluation Model

triode supports two live-coding evaluation modes through `liveMode`:

- `"continuous"` (default unless `legacy: true`)
- `"restart"`

## Continuous mode

- A single runtime instance stays alive across evals.
- New code is evaluated into existing runtime state.
- Scene/object identity can be stabilized with explicit `key` values.

Use when you want fluid iterative livecoding without full runtime reset.

## Restart mode

- Runtime state is rebuilt on each eval cycle.
- Closest to older restart-every-run workflows.

Use when you prefer strict rerun determinism and can tolerate full reset cost.

## Identity guidance

In continuous mode:

- `key` on scene/group/object is the strongest identity anchor.
- `name` is descriptive unless `reuse: true` is set.
- triode can assign source-based auto identities, but explicit keys are recommended for major refactors.

See [Live-Key Migration](../reference/live-key-migration.md).

## Error routing

Runtime errors from `update`, `afterUpdate`, and `tick` are forwarded to `onError(error, context)` when provided.

Use this hook in host applications for centralized diagnostics.
