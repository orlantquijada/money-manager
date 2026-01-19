# Detection Patterns Reference

## Unused File Detection

### Entry Points (never flag as unused)
```
apps/mobile/app/**/*.tsx          # Expo Router pages
apps/mobile/src/index.ts          # Mobile entry
apps/server/src/index.ts          # Server entry
packages/*/src/index.ts           # Package exports
*.config.ts                       # Config files
*.config.js
tailwind.config.js
drizzle.config.ts
metro.config.js
babel.config.js
```

### Import Patterns to Trace
```typescript
// ES imports
import X from './file'
import { X } from './file'
import * as X from './file'
import './file'  // side-effect import

// Dynamic imports
const X = await import('./file')
import('./file').then(...)

// Re-exports
export { X } from './file'
export * from './file'

// Type imports (still counts as usage)
import type { X } from './file'
```

## Stale Code Patterns

### Comment Markers
```
// TODO: remove
// TODO: delete
// FIXME: remove
// FIXME: delete
// DEPRECATED
// @deprecated - remove
// DEAD CODE
// UNUSED
```

### Dead Branch Patterns
```typescript
if (false) { ... }
if (0) { ... }
while (false) { ... }
if (process.env.NEVER) { ... }
if (__DEV__ && false) { ... }

// Feature flags that are always false
if (FEATURE_OLD_CHECKOUT) { ... }  // when FEATURE_OLD_CHECKOUT = false
```

### Large Comment Blocks
Flag blocks of 10+ consecutive comment lines:
```typescript
// ============================================
// OLD IMPLEMENTATION - KEEPING FOR REFERENCE
// ============================================
// function oldMethod() {
//   const x = something();
//   if (x > 10) {
//     doThing();
//   }
//   return x;
// }
// ============================================
```

## Orphaned Markdown Detection

### Always Keep
```
README.md
CLAUDE.md
CHANGELOG.md
LICENSE.md
CONTRIBUTING.md
CODE_OF_CONDUCT.md
```

### Link Patterns to Check
```markdown
[text](./path/to/file.md)
[text](/path/to/file.md)
[text](path/to/file.md)
```

### Index/Nav Files to Check for Links
```
README.md
docs/README.md
docs/index.md
.claude/*.md
```

## Stale Spec Detection

### Status Values
```json
{
  "status": "completed",    // Feature done, spec can be archived
  "status": "abandoned",    // Feature cancelled, spec can be deleted
  "status": "active",       // Keep - in progress
  "status": "planned"       // Keep - upcoming
}
```

### Age-Based Heuristics
- Specs with `completedAt` date > 30 days ago → suggest archival
- Specs with no recent git commits → may be stale

## Temp File Patterns

### Filename Patterns
```
*-notes.md
*-plan.md
*-wip.md
*-temp.md
*-draft.md
*-scratch.md
*-backup.md
todo-*.md
planning-*.md
```

### Directory Patterns
```
docs/agent/progress-*.md    # Old progress tracking files
.claude/scratch/            # Scratch files
tmp/                        # Temp directory
```

## False Positive Prevention

### Files to Never Flag
```
# Type definitions
*.d.ts

# Test files (unless they test deleted code)
*.test.ts
*.test.tsx
*.spec.ts
*.spec.tsx
__tests__/**

# Stories/Examples
*.stories.tsx
*.example.ts

# Generated files
*.generated.ts
.expo/**
node_modules/**
dist/**
build/**

# Git-related
.git/**
.gitignore
.gitattributes
```

### Preserve Comments
Files with these comments should be kept:
```typescript
// @preserve
// @keep
// @important
/* eslint-disable */ // at file top indicates intentional
```

## Verification Queries

Before deleting, verify:
1. **Not imported anywhere**: `grep -r "from ['\"].*filename['\"]" .`
2. **Not in tsconfig paths**: Check `tsconfig.json` for path aliases
3. **Not dynamically loaded**: `grep -r "import\\(['\"].*filename" .`
4. **Not referenced in package.json**: Check `main`, `exports`, `types` fields
