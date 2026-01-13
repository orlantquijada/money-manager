# Progress Tracking

Progress is tracked using two files:

## `.claude/status.json` - Structured Task Status

Machine-readable JSON with task statuses ("todo", "in_progress", "done"):
- Update task status when completing features
- Keep `currentFocus` accurate
- Update `lastUpdated` timestamp

## `PROGRESS.md` - Freeform Progress Notes

- Add dated entries for significant progress
- Document blockers and decisions
- Keep "Current Session" section updated

## Git Commits as Checkpoints

- Commit after completing meaningful chunks of work
- Commit messages should reference what was completed

## When Finishing a Task

1. Update `.claude/status.json` (change task status to "done")
2. Add a note to `PROGRESS.md`
3. Prompt the user to commit the checkpoint

## Reference Docs

- `PRD.md` - Product requirements (stable reference, rarely changes)
- `.claude/status.json` - Current task status (changes frequently)
- `PROGRESS.md` - Progress notes and context (changes frequently)
