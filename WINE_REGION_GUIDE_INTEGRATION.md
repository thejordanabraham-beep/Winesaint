# Wine Region Guide - Website Integration Plan

## Overview

The Wine Region Guide Generator creates comprehensive, Jura Guide-style educational content for WineSaint. This document explains how to integrate generated guides into the website.

## Hierarchical Structure

```
Wine Region Guide
  └─ Country Pages (France, Italy, Spain, USA)
      ├─ Left Sidebar: Links to major regions
      └─ Content: Country overview (2,500-3,500 words)

  └─ Region Pages (Burgundy, Jura, Tuscany, Rioja)
      ├─ Left Sidebar: Links to sub-regions
      └─ Content: Comprehensive deep dive (3,500-5,000 words)

  └─ Sub-Region Pages (Côte de Nuits, Arbois, Chianti Classico)
      ├─ Left Sidebar: Optional links (Producers, Vineyards, Grapes)
      └─ Content: Focused terroir guide (1,500-2,500 words)
```

## File Organization

### Generated Guides Location
```
/Users/jordanabraham/wine-reviews/guides/
├── france-guide.md
├── burgundy-guide.md
├── cote-de-nuits-guide.md
├── italy-guide.md
├── piedmont-guide.md
└── generation-summary.json
```

### Website Location
```
/Users/jordanabraham/wine-reviews/app/regions/
├── [country]/
│   ├── page.tsx              (Country page)
│   └── [region]/
│       ├── page.tsx          (Region page)
│       └── [sub-region]/
│           └── page.tsx      (Sub-region page)
```

## Website Integration Steps

### Step 1: Create Country Page Structure

Example for France:

```typescript
// app/regions/france/page.tsx

import { client } from '@/sanity/lib/client';
import RegionLayout from '@/components/RegionLayout';

// Sidebar navigation for French regions
const FRENCH_REGIONS = [
  { name: 'Champagne', slug: 'champagne' },
  { name: 'Burgundy', slug: 'burgundy' },
  { name: 'Bordeaux', slug: 'bordeaux' },
  { name: 'Rhône Valley', slug: 'rhone-valley' },
  { name: 'Loire Valley', slug: 'loire-valley' },
  { name: 'Alsace', slug: 'alsace' },
  { name: 'Jura', slug: 'jura' },
  { name: 'Provence', slug: 'provence' },
  { name: 'Languedoc-Roussillon', slug: 'languedoc-roussillon' },
];

export default async function FrancePage() {
  return (
    <RegionLayout
      title="France"
      level="country"
      sidebarLinks={FRENCH_REGIONS}
      contentFile="france-guide.md"
    />
  );
}
```

### Step 2: Create Region Page Structure

Example for Burgundy:

```typescript
// app/regions/france/burgundy/page.tsx

import RegionLayout from '@/components/RegionLayout';

const BURGUNDY_SUB_REGIONS = [
  { name: 'Chablis', slug: 'chablis' },
  { name: 'Côte de Nuits', slug: 'cote-de-nuits' },
  { name: 'Côte de Beaune', slug: 'cote-de-beaune' },
  { name: 'Côte Chalonnaise', slug: 'cote-chalonnaise' },
  { name: 'Mâconnais', slug: 'maconnais' },
];

export default async function BurgundyPage() {
  return (
    <RegionLayout
      title="Burgundy"
      level="region"
      parentRegion="France"
      sidebarLinks={BURGUNDY_SUB_REGIONS}
      contentFile="burgundy-guide.md"
    />
  );
}
```

### Step 3: Create Sub-Region Page Structure

Example for Côte de Nuits:

```typescript
// app/regions/france/burgundy/cote-de-nuits/page.tsx

import RegionLayout from '@/components/RegionLayout';

const COTE_DE_NUITS_LINKS = [
  { name: 'Gevrey-Chambertin', slug: 'gevrey-chambertin', type: 'village' },
  { name: 'Morey-Saint-Denis', slug: 'morey-saint-denis', type: 'village' },
  { name: 'Chambolle-Musigny', slug: 'chambolle-musigny', type: 'village' },
  { name: 'Vougeot', slug: 'vougeot', type: 'village' },
  { name: 'Vosne-Romanée', slug: 'vosne-romanee', type: 'village' },
  { name: 'Nuits-Saint-Georges', slug: 'nuits-saint-georges', type: 'village' },
  { name: 'Top Producers', slug: 'producers', type: 'list' },
  { name: 'Grand Cru Vineyards', slug: 'vineyards', type: 'list' },
];

export default async function CoteDeNuitsPage() {
  return (
    <RegionLayout
      title="Côte de Nuits"
      level="sub-region"
      parentRegion="Burgundy"
      sidebarLinks={COTE_DE_NUITS_LINKS}
      contentFile="cote-de-nuits-guide.md"
    />
  );
}
```

## RegionLayout Component

Create a reusable layout component:

```typescript
// components/RegionLayout.tsx

import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import Link from 'next/link';

interface RegionLayoutProps {
  title: string;
  level: 'country' | 'region' | 'sub-region';
  parentRegion?: string;
  sidebarLinks: Array<{ name: string; slug: string; type?: string }>;
  contentFile: string;
}

export default async function RegionLayout({
  title,
  level,
  parentRegion,
  sidebarLinks,
  contentFile
}: RegionLayoutProps) {
  // Read and parse markdown file
  const guidesDir = path.join(process.cwd(), 'guides');
  const filePath = path.join(guidesDir, contentFile);
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const processedContent = await remark()
    .use(html)
    .process(fileContent);

  const contentHtml = processedContent.toString();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Left Sidebar Navigation */}
        <aside className="w-64 flex-shrink-0">
          <div className="sticky top-8">
            <h3 className="font-bold text-lg mb-4">
              {level === 'country' ? 'Regions' :
               level === 'region' ? 'Sub-Regions' :
               'Explore'}
            </h3>
            <nav className="space-y-2">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.slug}
                  href={`/regions/${generateSlug(parentRegion, title, link.slug)}`}
                  className="block px-3 py-2 rounded hover:bg-[#722F37]/10 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600 mb-6">
            <Link href="/regions" className="hover:underline">Wine Region Guide</Link>
            {parentRegion && (
              <>
                {' / '}
                <Link href={`/regions/${parentRegion.toLowerCase()}`} className="hover:underline">
                  {parentRegion}
                </Link>
              </>
            )}
            {' / '}
            <span className="text-gray-900">{title}</span>
          </nav>

          {/* Generated Guide Content */}
          <article
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </main>
      </div>
    </div>
  );
}

function generateSlug(parentRegion?: string, currentRegion?: string, slug?: string): string {
  const parts = [
    parentRegion?.toLowerCase().replace(/\s+/g, '-'),
    currentRegion?.toLowerCase().replace(/\s+/g, '-'),
    slug
  ].filter(Boolean);
  return parts.join('/');
}
```

## Generation Workflow

### 1. Generate Priority 1 Guides (Countries)
```bash
npx tsx scripts/generate-all-guides.ts --priority 1
```
This creates: France, Italy, Spain, USA guides

### 2. Generate Priority 2 Guides (Major French Regions)
```bash
npx tsx scripts/generate-all-guides.ts --priority 2
```
This creates: Burgundy, Bordeaux, Champagne, Rhône, Loire, Alsace, Provence, Languedoc

### 3. Generate Priority 3-5 Guides (Italian/Spanish regions, Sub-regions)
```bash
npx tsx scripts/generate-all-guides.ts --priority 5
```

### 4. Review Generated Content
All guides saved to `/Users/jordanabraham/wine-reviews/guides/`

Check `generation-summary.json` for success/failure report

### 5. Create Website Pages
For each generated guide, create corresponding page.tsx file following the structure above

### 6. Test Navigation
Verify sidebar links work correctly and breadcrumbs are accurate

## Style Guidelines

### Markdown Styling
The generated guides use standard markdown. Your `prose` class should style:
- `# H1` → Main title (already in page, remove from markdown)
- `## H2` → Major sections (Geology, Climate, Grapes, etc.)
- `### H3` → Subsections
- Tables → Vintage charts
- Lists → Food pairings, appellations
- Bold → Emphasis
- Italic → Scientific names, French terms

### Custom Components (Optional)
Consider creating React components for:
- **VintageChart**: Interactive vintage table
- **FoodPairing**: Visual pairing suggestions
- **GrapeProfile**: Link to Grape Guide entries
- **ProducerList**: Link to producer pages (when available)

## François RAG Integration

### Current Status
François RAG API (`http://localhost:8000/search`) is not running during guide generation. Guides currently use Claude's base knowledge.

### When François is Running
The guide generator will automatically:
1. Query François for geology, climate, grapes, wines, vintages, producers
2. Incorporate RAG context into generation
3. Provide more specific vintage information, producer details, and regional nuances

### Starting François
```bash
cd /Users/jordanabraham/wine-rag/
# (Run François startup command here)
```

Once François is running, regenerate guides for enhanced content with specific vintage charts, producer information, and rare grape details from the 50,000+ chunk knowledge base.

## Cost Estimates

Using Claude Sonnet 4.5:
- **Country guide**: ~700 input tokens, ~8,000 output tokens = ~$0.06 per guide
- **Region guide**: ~700 input tokens, ~8,000 output tokens = ~$0.06 per guide
- **Sub-region guide**: ~700 input tokens, ~5,000 output tokens = ~$0.04 per guide

**Full roadmap (33 guides)**: ~$1.80 total

With François RAG active:
- **Region guide**: ~15,000 input tokens (with RAG context), ~8,000 output tokens = ~$0.15 per guide

## Next Steps

1. ✅ Guide Generator system built
2. ✅ Burgundy test guide generated (4,083 words, excellent quality)
3. ⏳ Generate Priority 1 guides (4 countries)
4. ⏳ Create RegionLayout component
5. ⏳ Build website page structure
6. ⏳ Test navigation and styling
7. ⏳ Start François RAG for enhanced guides
8. ⏳ Generate remaining guides (Priority 2-5)

## Contact Integration with Existing Pages

You already have:
- `/app/regions/france/page.tsx` with placeholder content

**Migration strategy**:
1. Keep existing page structure
2. Replace placeholder content with generated guide
3. Update sidebar links to match generated sub-regions
4. Maintain existing styling and components

No need to rebuild - just swap content and update navigation.
