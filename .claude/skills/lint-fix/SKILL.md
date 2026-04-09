---
name: lint-fix
description: Run ESLint auto-fix on the CompliancePro project. Use when the user says "lint", "fix lint", "lint-fix", or wants to clean up code quality issues.
---

# Lint Fix

Run ESLint to check and auto-fix code quality issues.

## Commands

### Check only (no changes)
```bash
npm run lint
```

### Auto-fix
```bash
npx eslint . --fix
```

### Fix specific file or directory
```bash
npx eslint src/components/portal/ --fix
npx eslint src/lib/airtable.js --fix
```

## ESLint Configuration

- ESLint 9 flat config (`eslint.config.js`)
- Plugins: `react-hooks`, `react-refresh`
- No TypeScript linting in frontend — only `.js` and `.jsx` files

## Workflow

1. Run `npm run lint` to see current issues
2. Run `npx eslint . --fix` to auto-fix what's possible
3. Manually fix any remaining issues
4. Run `npm run lint` again to confirm all issues resolved
