---
name: codemap-updater
description: Clean dead code and loose markdown files from the codebase
version: 1.0.0
---

# Codemap Updater

Scan and remove dead code, orphaned markdown, and stale files.

## Workflow

### Phase 1: Detection

Run these checks in parallel:

#### 1. Unused Files
Trace imports starting from entry points:
- `apps/mobile/app/` (Expo Router pages)
- `apps/server/src/index.ts`
- `packages/*/src/index.ts`

A file is unused if:
- Not imported by any other file
- Not an entry point itself
- Not a config file (`.config.ts`, `tailwind.config.js`, etc.)

Use grep to find all imports, then diff against file list.

#### 2. Stale Code Blocks
Grep for patterns indicating dead code:
- `// TODO: remove`, `// FIXME: delete`
- Commented blocks >10 consecutive lines
- `if (false)`, `if (0)`, `while (false)`
- Feature flag checks that are always false

#### 3. Orphaned Markdown
Glob all `**/*.md` files, then check if linked from:
- `README.md`, `CLAUDE.md`
- Any nav/index file
- Other markdown files

Exclude from orphan detection:
- `README.md`, `CLAUDE.md`, `CHANGELOG.md`
- Files in `node_modules/`

#### 4. Stale Specs
Read each `docs/specs/*.json` file and check for:
```json
{ "status": "completed" }
{ "status": "abandoned" }
```
These are candidates for archival/deletion.

#### 5. Temp Planning Files
Match patterns:
- `*-notes.md`
- `*-plan.md`
- `*-wip.md`
- `*-temp.md`
- `*-draft.md`
- `docs/agent/progress-*.md` (old progress files)

### Phase 2: Report

Present findings grouped by category:

```
## Dead Code Detection Results

### Unused Files (3 found)
- src/components/OldFeature.tsx
- src/utils/deprecated.ts
- src/hooks/useObsolete.ts

### Stale Code Blocks (2 found)
- src/lib/auth.ts:45-67 (commented block)
- src/utils/api.tsx:120 (if false block)

### Orphaned Markdown (2 found)
- docs/old-architecture.md
- docs/migration-notes.md

### Stale Specs (1 found)
- docs/specs/feature-x.json (status: completed)

### Temp Planning Files (1 found)
- docs/agent/progress-2024-01.md
```

### Phase 3: Confirmation

Use AskUserQuestion to confirm deletion. Offer options:
1. **Delete all** - Remove everything listed
2. **Delete by category** - Choose which categories to clean
3. **Review individually** - Confirm each file one by one
4. **Cancel** - Exit without deleting

### Phase 4: Cleanup

For confirmed items:
1. Delete the files using Bash `rm`
2. For stale code blocks, use Edit tool to remove the block
3. Report summary of deleted items

### Phase 5: Summary

```
## Cleanup Complete

Deleted:
- 3 unused files
- 2 stale code blocks removed
- 2 orphaned markdown files
- 1 stale spec

Freed: ~450 lines of dead code
```

## Detection Commands

```bash
# Find all TypeScript/JavaScript files
find apps packages -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules

# Find imports in a file
grep -E "^import .* from ['\"]" file.ts

# Find all markdown files
find . -name "*.md" -not -path "*/node_modules/*"

# Check for large comment blocks (10+ lines starting with //)
grep -n "^[[:space:]]*//" file.ts | awk -F: 'NR==1{start=$1;prev=$1;next} $1==prev+1{prev=$1;next} {if(prev-start>=10)print start"-"prev; start=$1;prev=$1} END{if(prev-start>=10)print start"-"prev}'

# Find if-false patterns
grep -rn "if\s*(false)" apps packages --include="*.ts" --include="*.tsx"
```

## Safety Rules

1. **Never delete without confirmation**
2. **Never delete entry points** (`app/`, `index.ts`, config files)
3. **Never delete recently modified files** without extra confirmation (< 7 days)
4. **Preserve git history** - files are deleted, not purged from history
5. **Skip files with `@preserve` or `@keep` comments**

## Edge Cases

- **Circular imports**: May cause false positives; verify manually
- **Dynamic imports**: `import()` expressions may not be detected
- **Re-exports**: Files that only re-export may appear unused
- **Test files**: `*.test.ts`, `*.spec.ts` are not imports but should be kept
- **Type-only files**: `.d.ts` files may appear unused but are needed

When uncertain, ask user rather than auto-delete.
