# Archived Scripts

This folder contains deprecated/test scripts that should NOT be used for production.

## Scripts in Archive

### `test-import-30-wines.ts`
- **Status:** Deprecated - replaced by `import-wines-from-excel.ts`
- **Purpose:** Was used for initial testing of wine import system
- **Why archived:** Test version only imported 30 random wines. Production script now handles full imports with better options.

---

## Production Script

Use this instead: `scripts/import-wines-from-excel.ts`

```bash
# Import all wines from all sheets
npx tsx scripts/import-wines-from-excel.ts

# Import with options
npx tsx scripts/import-wines-from-excel.ts --sheets California --limit 100
```

See the main script file for full documentation.
