# 🛠️ TECHNICAL DOCUMENTATION - WINESAINT 2.0

**Complete technical reference for the new features**

---

## 📁 FILE STRUCTURE

```
wine-reviews/
├── app/
│   ├── explore/
│   │   └── page.tsx                 # ⭐ NEW: Main exploration hub
│   └── grapes/
│       └── page.tsx                 # EXISTING: Grape database
│
├── components/
│   ├── guides/
│   │   └── EnhancedGuideRenderer.tsx    # ⭐ NEW: Beautiful guide rendering
│   ├── regions/
│   │   ├── InteractiveRegionExplorer.tsx # ⭐ NEW: Hierarchical navigation
│   │   ├── RegionComparisonTool.tsx     # ⭐ NEW: Side-by-side comparison
│   │   └── VintageChart.tsx              # ⭐ NEW: Vintage quality visualization
│   ├── learning/
│   │   └── LearningPathCard.tsx          # ⭐ NEW: Educational paths
│   ├── grapes/
│   │   └── GrapeVarietyCard.tsx          # ⭐ NEW: Grape profiles
│   └── food/
│       └── FoodPairingGuide.tsx          # ⭐ NEW: Wine & food pairings
│
├── lib/
│   ├── guide-config.ts              # ⭐ Central region configuration (77 regions)
│   ├── api-costs.ts                 # ⭐ Cost tracking & estimation
│   ├── validators/
│   │   └── guide-validator.ts       # ⭐ Content quality validation
│   └── queue/
│       └── parallel-queue.ts        # ⭐ Parallel generation engine
│
├── scripts/
│   ├── wine-region-guide-generator.ts    # ENHANCED: Now with validation & costs
│   ├── generate-all-guides.ts            # ENHANCED: Parallel + dashboard
│   ├── generate-page-template.ts         # ⭐ NEW: Auto page generation
│   ├── validate-guides.ts                # ⭐ NEW: Validation CLI
│   └── status-dashboard.ts               # ⭐ NEW: Coverage tracking
│
├── guides/                          # 57+ markdown guides (was 35)
├── tailwind.config.ts              # ENHANCED: Wine color palette
└── DOCUMENTATION/
    ├── GOOD_MORNING_SUMMARY.md
    ├── WINESAINT_2.0_BUILD_LOG.md
    └── TECHNICAL_DOCUMENTATION.md   # This file
```

---

## 🎨 COMPONENT API REFERENCE

### EnhancedGuideRenderer

**Location:** `components/guides/EnhancedGuideRenderer.tsx`

**Purpose:** Renders wine region guides with enhanced UX

**Props:**
```typescript
interface EnhancedGuideRendererProps {
  content: string;              // HTML content from markdown
  title: string;                // Region name
  level: 'country' | 'region' | 'sub-region';
  quickFacts?: {
    climate?: string;
    primaryGrapes?: string[];
    wineStyles?: string[];
    notableProducers?: string[];
  };
}
```

**Features:**
- Auto-generated TOC from H2/H3 headers
- Reading progress bar (0-100%)
- Smooth scroll navigation
- Active section highlighting
- Quick facts sidebar
- Enhanced prose typography

**Usage:**
```tsx
<EnhancedGuideRenderer
  content={htmlContent}
  title="Burgundy"
  level="region"
  quickFacts={{
    climate: "Continental",
    primaryGrapes: ["Pinot Noir", "Chardonnay"],
    wineStyles: ["Red", "White"]
  }}
/>
```

---

### InteractiveRegionExplorer

**Location:** `components/regions/InteractiveRegionExplorer.tsx`

**Purpose:** Visual exploration of wine region hierarchy

**Props:** None (uses guide-config.ts)

**Features:**
- 3-column layout (Countries → Regions → Sub-regions)
- Click-through navigation
- Real-time filtering
- Region count badges
- Direct links to guides

**Data Source:** `getAllRegions()` from `lib/guide-config.ts`

**Usage:**
```tsx
<InteractiveRegionExplorer />
```

---

### RegionComparisonTool

**Location:** `components/regions/RegionComparisonTool.tsx`

**Purpose:** Side-by-side region comparison

**Props:** None (self-contained)

**Features:**
- Add up to 3 regions
- Compare: climate, soils, grapes, styles, prices, vintages
- Interactive table
- Add/remove regions dynamically

**Data Structure:**
```typescript
interface RegionData {
  name: string;
  slug: string;
  climate: string;
  soilTypes: string[];
  primaryGrapes: string[];
  wineStyles: string[];
  avgPrice: string;
  bestVintages: number[];
}
```

**Usage:**
```tsx
<RegionComparisonTool />
```

---

### LearningPathCard

**Location:** `components/learning/LearningPathCard.tsx`

**Purpose:** Displays structured learning paths

**Props:**
```typescript
interface LearningPathCardProps {
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  modules: LearningModule[];
  totalDuration: string;
  icon: string;
}

interface LearningModule {
  title: string;
  description: string;
  duration: string;
  slug: string;
  completed?: boolean;
}
```

**Features:**
- Progress tracking (% complete)
- Module preview (first 3)
- Color-coded by level
- Duration estimates
- CTA button (Start/Continue)

**Usage:**
```tsx
<LearningPathCard
  title="French Classics"
  description="Master the great wines of France"
  level="intermediate"
  icon="🇫🇷"
  totalDuration="6 hours"
  modules={[...]}
/>
```

---

### VintageChart

**Location:** `components/regions/VintageChart.tsx`

**Purpose:** Visual vintage quality ratings

**Props:**
```typescript
interface VintageChartProps {
  region: string;
  vintages: VintageData[];
}

interface VintageData {
  year: number;
  rating: number;  // 1-5 scale
  notes?: string;
}
```

**Features:**
- Color-coded quality (Exceptional → Fair)
- Horizontal bar chart
- Hover notes
- Rating legend

**Rating Scale:**
- 4.5-5.0: Exceptional (Emerald)
- 4.0-4.5: Excellent (Green)
- 3.5-4.0: Very Good (Yellow)
- 3.0-3.5: Good (Orange)
- <3.0: Fair (Gray)

**Usage:**
```tsx
<VintageChart
  region="Burgundy"
  vintages={[
    { year: 2019, rating: 4.5, notes: "Exceptional vintage" },
    { year: 2018, rating: 4.0 },
    // ...
  ]}
/>
```

---

### FoodPairingGuide

**Location:** `components/food/FoodPairingGuide.tsx`

**Purpose:** Interactive wine & food pairing education

**Props:** None (self-contained)

**Features:**
- 4 categories (Meat, Seafood, Cheese, Pasta)
- Interactive category switching
- "Why it works" explanations
- Pairing principles education

**Data Structure:**
```typescript
interface PairingCategory {
  name: string;
  icon: string;
  pairings: Array<{
    food: string;
    wine: string;
    why: string;  // Educational explanation
  }>;
}
```

**Usage:**
```tsx
<FoodPairingGuide />
```

---

## 🔧 UTILITY FUNCTIONS

### Guide Configuration (`lib/guide-config.ts`)

**Core Functions:**

```typescript
// Get region by slug
getRegionConfig(slug: string): RegionConfig | null

// Get URL path (e.g., "france/burgundy/chablis")
getRegionPath(slug: string): string

// Get all regions (optionally filtered by level)
getAllRegions(level?: 'country' | 'region' | 'sub-region'): RegionConfig[]

// Get sub-regions of a parent
getSubRegions(parentSlug: string): RegionConfig[]

// Get sidebar links for a region
getSidebarLinks(regionSlug: string): Array<{ name: string; slug: string }>

// Convert name to URL-safe slug
nameToSlug(name: string): string

// Get parent region
getParentRegion(regionSlug: string): RegionConfig | null
```

**Usage Example:**
```typescript
import { getRegionConfig, getSubRegions } from '@/lib/guide-config';

const burgundy = getRegionConfig('burgundy');
const subRegions = getSubRegions('burgundy');
// Returns: [Chablis, Côte de Nuits, Côte de Beaune, ...]
```

---

### Cost Calculation (`lib/api-costs.ts`)

**Core Functions:**

```typescript
// Calculate cost from token usage
calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): CostBreakdown

// Estimate batch cost
estimateCost(guides: Array<{ level: string }>): CostEstimate

// Format cost as "$0.45"
formatCost(cost: number): string

// Calculate statistics
calculateStatistics(results: Array<{ level: string; cost: CostBreakdown }>): CostStatistics
```

**Pricing (as of Jan 2025):**
```typescript
const API_PRICING = {
  'claude-sonnet-4-5-20250929': {
    inputPerMillion: 3.00,    // $3 per 1M tokens
    outputPerMillion: 15.00,  // $15 per 1M tokens
  }
}
```

---

### Content Validation (`lib/validators/guide-validator.ts`)

**Core Functions:**

```typescript
// Validate guide content
validateGuide(content: string, level: string): ValidationResult

// Check for duplicates
checkDuplicateContent(
  newContent: string,
  existingPaths: string[]
): DuplicateCheckResult

// Format validation results
formatValidationResult(result: ValidationResult, regionName: string): string
```

**Validation Rules:**
- **Country:** 2,500-4,000 words
- **Region:** 3,500-6,000 words, must have GEOLOGY, CLIMATE, GRAPES, WINES sections
- **Sub-region:** 1,500-3,000 words, at least one ## section
- **Uniqueness:** Unique word ratio > 0.40

---

### Parallel Queue (`lib/queue/parallel-queue.ts`)

**Core Functions:**

```typescript
// Create parallel execution queue
new ParallelQueue<T>(config: QueueConfig)

// Add task
queue.add(task: QueueTask<T>)

// Run all tasks
queue.run(): Promise<QueueResult<T>[]>

// Retry with exponential backoff
withRetry<T>(fn: () => Promise<T>, config: RetryConfig): Promise<T>
```

**Configuration:**
```typescript
interface QueueConfig {
  concurrency?: number;        // Default: 2
  rateLimit?: number;          // Default: 50 req/min
  timeout?: number;            // Default: 300000ms (5 min)
  retryConfig?: RetryConfig;
}
```

**Usage Example:**
```typescript
const queue = new ParallelQueue({ concurrency: 3 });

queue.add({
  id: 'burgundy',
  name: 'Burgundy',
  fn: async () => generateRegionGuide('Burgundy', 'region')
});

const results = await queue.run();
```

---

## 🎨 DESIGN SYSTEM

### Color Palette

**Wine Red:**
```css
wine-50:  #fdf2f4
wine-100: #fce7eb
wine-200: #fad1d9
wine-300: #f6a9b8
wine-400: #f0778f
wine-500: #e53e66
wine-600: #d11d4f  /* Primary */
wine-700: #b01442
wine-800: #93133e
wine-900: #7c1339
wine-950: #45071b
```

**Amber (White Wines):**
```css
amber-50:  #fffbeb
amber-100: #fef3c7
amber-200: #fde68a
amber-300: #fcd34d
amber-400: #fbbf24
amber-500: #f59e0b  /* Primary */
amber-600: #d97706
amber-700: #b45309
amber-800: #92400e
amber-900: #78350f
amber-950: #451a03
```

### Typography

**Font Families:**
- Sans: `Inter, system-ui, sans-serif`
- Serif: `Merriweather, Georgia, serif`

**Prose Styling:**
- Max width: none (full width)
- Base color: `#374151` (gray-700)
- Links: `wine-600` → `wine-700` on hover
- Headings: `gray-900`, bold

---

## 🚀 DEPLOYMENT

### Build Commands

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Type check
npx tsc --noEmit
```

### Environment Variables

```env
ANTHROPIC_API_KEY=your_key_here
```

---

## 📊 SCRIPTS REFERENCE

### Status Dashboard
```bash
npx tsx scripts/status-dashboard.ts

# JSON output
npx tsx scripts/status-dashboard.ts --json
```

### Validate Guides
```bash
# Single guide
npx tsx scripts/validate-guides.ts guides/burgundy-guide.md

# All guides
npx tsx scripts/validate-guides.ts --all

# Errors only
npx tsx scripts/validate-guides.ts --all --errors-only

# JSON export
npx tsx scripts/validate-guides.ts --all --json > report.json
```

### Generate Page Templates
```bash
# Single page
npx tsx scripts/generate-page-template.ts burgundy

# All pages
npx tsx scripts/generate-page-template.ts --all

# Dry run
npx tsx scripts/generate-page-template.ts --all --dry-run

# With backup
npx tsx scripts/generate-page-template.ts burgundy --force --backup
```

### Generate Guides
```bash
# Dry run
npx tsx scripts/generate-all-guides.ts --level region --dry-run

# Actual generation
npx tsx scripts/generate-all-guides.ts --only "burgundy,bordeaux" --concurrency 2

# All missing guides
npx tsx scripts/generate-all-guides.ts --level region
```

---

## 🔍 TROUBLESHOOTING

### Common Issues

**1. TypeScript Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

**2. Generation Fails**
- Check François is running: `http://localhost:8000`
- Verify API key in `.env.local`
- Check rate limits (50 req/min)

**3. Missing Guides**
```bash
# Check status
npx tsx scripts/status-dashboard.ts

# Regenerate specific guide
npx tsx scripts/generate-all-guides.ts --only "burgundy" --force
```

---

## 📈 PERFORMANCE METRICS

### Load Times (Target)
- Homepage: < 2s
- Guide pages: < 1.5s
- Interactive components: < 500ms

### Optimization
- Static generation for guides
- Image optimization (Next.js Image)
- Code splitting
- Lazy loading for heavy components

---

## 🔐 SECURITY

### Content Security
- Markdown sanitization via remark
- No inline scripts
- XSS protection

### API Security
- Rate limiting (50 req/min)
- API key in environment variables
- No client-side API calls

---

## 🎯 TESTING

### Manual Testing Checklist
- [ ] Navigation works on mobile
- [ ] All guides render correctly
- [ ] TOC scrolls smoothly
- [ ] Comparison tool functional
- [ ] Learning paths display
- [ ] Search works (if implemented)

### Validation
```bash
# Run all validations
npm run validate
```

---

*Built with ❤️ by Claude & François*
*Technical documentation v2.0*
