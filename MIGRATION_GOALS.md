# WineSaint Migration: Goals & Architecture

## Why We're Migrating

### The Problem with the Old System

The original architecture had **two disconnected systems**:

| System | Data Source | Problem |
|--------|-------------|---------|
| Region Pages | Static markdown + JSON config | Can't query, can't cross-link |
| Wine Reviews | Sanity CMS | Expensive at scale (~$99/mo for 100K records) |

**Critical limitations:**
- **No cross-linking**: Can't click a vineyard on a wine review and see all wines from that vineyard
- **Brittle extraction**: Converting 2,400 custom pages to JSON threw away classification groupings, sidebar descriptions, and nested hierarchies
- **Silent failures**: Pages load but navigation is broken - no errors, just missing links
- **Two sources of truth**: Regions in files, wines in Sanity, no connection between them

### What Broke

When we tried to consolidate to a catch-all route + JSON config:
- 533 pages lost classification-based navigation (Grand Cru, Premier Cru, Grosse Lage, etc.)
- Complex data structures (nested objects, grouped vineyards) weren't captured
- Sidebar descriptions were lost
- Entire branches of hierarchy became unreachable

## The Vision

**"Wikipedia for Wine"** - A fully interconnected wine knowledge base where:
- Click a vineyard → see the vineyard page with all wines from there
- Click a producer → see all their wines across regions
- Click a grape → see all wines using that grape
- Everything links to everything else naturally

## New Architecture

```
┌─────────────────────────────────────────────────┐
│              Next.js App                        │
│    (dynamic routes, server components)          │
└─────────────────────┬───────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ Payload  │  │Typesense │  │  Vercel  │
  │   CMS    │  │ (Search) │  │   Blob   │
  │(Postgres)│  │          │  │ (images) │
  └──────────┘  └──────────┘  └──────────┘
```

### Why Payload CMS + PostgreSQL

- **Relational data model** = cross-linking is trivial (`SELECT * FROM wines WHERE region_id = X`)
- **Admin UI** for content editing without code
- **API access** for dynamic queries
- **~$25/mo** vs Sanity's $99+ at scale
- **One source of truth** for all content

### Data Model

```
regions ←→ wines ←→ reviews
   ↓         ↓
vineyards  grapes
   ↓
producers
```

All entities have proper foreign keys enabling bidirectional queries.

## Migration Status

### Completed ✓

- [x] Set up Payload CMS with PostgreSQL
- [x] Created Regions collection with hierarchy support
- [x] Migrated 2,443 regions from JSON config
- [x] Established parent relationships (2,403 regions)
- [x] Migrated 2,151 markdown guides into database
- [x] Fixed layout structure for admin panel
- [x] All on branch: `payload-migration-v1`

### Database Stats

| Metric | Count |
|--------|-------|
| Total regions | 2,443 |
| Regions with content | 2,151 |
| Parent relationships | 2,403 |
| Countries | 37 |

### Still Needed

- [ ] Create Wines collection with region relationships
- [ ] Create Reviews collection linked to wines
- [ ] Create Producers collection
- [ ] Create Grapes collection
- [ ] Import 60K+ wine reviews
- [ ] Set up Typesense for search
- [ ] Integrate map into main app
- [ ] Build cross-linking queries (wines by region, etc.)

## Cost Comparison at Scale (100K reviews)

| Service | Current Path | New Architecture |
|---------|--------------|------------------|
| Vercel | $20/mo | $20/mo |
| Database | Sanity ~$99/mo | PostgreSQL ~$25/mo |
| Search | Typesense $30/mo | Typesense $30/mo |
| **Total** | **~$150/mo** | **~$75/mo** |

## Key Principles

1. **One source of truth** - All content in PostgreSQL via Payload
2. **Relational by design** - Everything can link to everything
3. **Editable without code** - Admin panel for content updates
4. **Scalable** - Handles 100K+ records efficiently
5. **Cost-effective** - Half the cost of the fragmented approach

## Files Reference

- `payload.config.ts` - Payload CMS configuration
- `payload/collections/Regions.ts` - Regions schema
- `app/(main)/data/region-configs.json` - Original static config (kept for reference)
- `guides/` - Original markdown files (migrated to database)

---

*Last updated: April 15, 2026*
*Branch: payload-migration-v1*
