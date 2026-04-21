# Legacy Files

These files are from the **Sanity CMS** build, before the migration to **Payload CMS**.

Kept for reference only. Not in active use.

## Contents

- `sanity.cli.ts` - Sanity CLI configuration
- `sanity.config.ts` - Sanity studio configuration
- `sanity/` - Sanity schema definitions
- `regions-pages-backup/` - Old region page components (before dynamic routing)

## Migration

The project migrated from Sanity to Payload CMS in early 2026. The active codebase now uses:

- Payload CMS (`payload.config.ts`, `collections/`)
- Dynamic region routing (`app/(main)/regions/[...slug]/`)
- JSON data files (`app/data/`)

## Safe to Delete

Once the Payload migration is confirmed stable and deployed, this entire `_legacy/` folder can be deleted.
