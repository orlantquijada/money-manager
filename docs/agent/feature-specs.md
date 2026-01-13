# Feature Specs (Ralph Loop)

For complex features, create detailed specs in `docs/specs/` optimized for [Ralph Loop](https://ghuntley.com/ralph/) iteration.

## When to Create a Spec

- **Complexity**: Multiple screens, >3 files, or multi-day work
- **Uncertainty**: Design/UX decisions need documenting before coding

## File Structure Per Feature

### `{feature}.json` - PRD with Spec and Acceptance Criteria

See `docs/specs/_template.json` for the JSON structure containing:
- `feature`, `goal`, `spec` (overview, design, api, files)
- `items[]` with acceptance criteria and `passes` boolean

### `{feature}-progress.txt` - Context and Notes

- Quick reference links to key files
- Dated progress entries with `[FEAT-001]` IDs
- Blockers and key decisions

## Ralph Workflow

1. Read JSON, find items with `passes: false`
2. Implement highest priority incomplete item
3. Set `passes: true`, add entry to progress.txt
4. Commit (must pass types/tests)
5. Repeat until all items pass

## Lifecycle

Delete spec files after feature merges (git preserves history).
