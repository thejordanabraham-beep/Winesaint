# WineSaint Project Status & Roadmap

**Last Updated:** 2026-02-12
**Current Phase:** Content Generation & Feature Development

---

## 🎯 Project Overview

WineSaint is a comprehensive wine education platform combining:
- **1,656 region pages** with 5-level hierarchical navigation (Country → Region → Sub-region → Village → Vineyard)
- **François RAG system** - AI wine expert with vector database
- **Wine Education Guide (WEG)** - Comprehensive knowledge base
- **Wine Notes iOS App** - Mobile companion for tasting notes
- **Wine review system** with Sanity CMS integration

---

## 📊 Current Build State

### Content Inventory

#### Region Pages: 1,656 Total
- **France: 885 pages**
  - Burgundy: 480+ pages (complete vineyard hierarchy)
  - Bordeaux: 40+ pages
  - Alsace: 52 Grand Crus
  - Champagne: 60 Grand/Premier Cru villages
  - Beaujolais: 10 Crus
  - Rhône: 45 climats (Hermitage, Cornas)
  - Loire: 10 Muscadet Crus Communaux
  - Côte Chalonnaise: 138 Premier Crus

- **Germany: 409 pages**
  - Grosses Gewächs vineyards across all regions
  - Mosel, Rheingau, Rheinhessen, Pfalz, Nahe, etc.

- **Italy: 249 pages**
  - Barolo: 178 MGAs
  - Barbaresco: 66 MGAs
  - Other regions: Tuscany, Veneto, etc.

- **Other Countries: 113 pages**
  - US (15), Australia (13), New Zealand (10), Spain (14), Portugal (9)
  - 31 additional countries covered

#### Guides: 78 François-Generated
- Comprehensive regional guides (2,500-4,000 words each)
- **Missing: 1,578 vineyard/village guides** (needs content generation)

#### Data Files: 243
- Official classification data (Burgundy, Germany, Italy, France)
- GeoJSON boundaries
- Appellation details

#### Code Structure
- 1,711 TypeScript files
- 26 custom components
- 1,673 app pages
- RegionLayout component (unified page template)

### Technical Stack
- **Next.js 16.1.1** with App Router
- **Sanity CMS** for wine reviews and structured data
- **Tailwind CSS** for styling
- **François RAG** for AI-powered content
- **Wine Education Guide** vector database
- **React Native + Capacitor** for iOS app

---

## ✅ Completed Tasks

### Phase 1: Foundation (Complete)
- [x] 5-level hierarchical navigation system
- [x] RegionLayout component with classification grouping
- [x] guide-config.ts central configuration
- [x] Sanity schemas (wine, vineyard, climat, region, producer)
- [x] François RAG integration
- [x] Wine Education Guide setup

### Phase 2: Data Population (Complete)
- [x] All Barolo MGAs (178)
- [x] All Barbaresco MGAs (66)
- [x] All Burgundy Grand Crus (33)
- [x] All Burgundy Premier Crus (580+)
- [x] All German Grosses Gewächs (409)
- [x] All Alsace Grand Crus (52)
- [x] All Champagne classified villages (60)
- [x] Beaujolais Crus (10)
- [x] Rhône climats (45)
- [x] Muscadet Crus Communaux (10)
- [x] Chablis Grand/Premier Crus (17)

### Phase 3: Content Generation (In Progress)
- [x] 78 region guides generated via François
- [x] Build system functional and error-free
- [x] All parent pages updated with sidebar navigation
- [ ] **PENDING:** 1,578 vineyard/village guides (see below)

### Phase 4: Sub-Region Sidebar Navigation Fix (Complete)
- [x] Fixed 12 problematic sub-region sidebars (2024-02-02)
  - **Germany**: Mosel (39 villages in 4 sub-regions - hierarchical), Rheingau (23 villages)
  - **France**: Alsace (29 villages), Champagne (68 villages in 5 sub-regions - hierarchical)
  - **Spain**: Rioja (3 sub-regions), Ribera del Duero (10 towns)
  - **Austria**: Wachau (3 towns)
  - **Australia**: Barossa Valley (7 sub-regions), Yarra Valley (3 sub-regions), Margaret River (sidebar removed)
  - **Portugal**: Douro (3 sub-regions)
  - **Argentina**: Mendoza (5 departments/sub-regions)
- [x] Created village extraction script (`scripts/extract-villages-from-data.ts`)
- [x] Established sidebar guidelines (`docs/SUB_REGION_SIDEBAR_GUIDELINES.md`)
- [x] **Hierarchical sidebars implemented**: Champagne (5 regions) and Mosel (4 regions with villages)

**Key Improvement:** Replaced producer/vineyard names with proper geographic hierarchy (villages, towns, sub-regions)

**Advanced Implementation:** Champagne and Mosel feature custom hierarchical sidebars that group villages by official sub-regions (Montagne de Reims, Côte des Blancs, Saar, Bernkastel, etc.)

### Documentation (Complete)
- [x] WINESAINT_CURRENT_STATE_ASSESSMENT.md
- [x] WINESAINT_PITCH_DECK.md
- [x] PITCH_DECK_PROMPT_FOR_CLAUDE.txt
- [x] PROJECT_STATUS.md (this file)
- [x] SUB_REGION_SIDEBAR_GUIDELINES.md (navigation standards)

---

## 📋 TO-DO LIST

### Priority 1: Content Generation 🔥

#### A. Vineyard Guide Generation
**Status:** Ready to execute
**Estimated Cost:** $200-300 in API calls
**Estimated Time:** 3-4 hours runtime

**Tasks:**
- [ ] Generate guides for 580+ Burgundy Premier Crus
  - Côte de Nuits villages (189 vineyards)
  - Côte de Beaune villages (291 vineyards)
  - Côte Chalonnaise villages (138 vineyards)
- [ ] Generate guides for 244 Italian vineyards
  - Barolo MGAs (178)
  - Barbaresco MGAs (66)
- [ ] Generate guides for 409 German Grosses Gewächs
- [ ] Generate guides for 122 French classified vineyards
  - Alsace Grand Crus (52)
  - Champagne villages (60)
  - Beaujolais, Rhône, Loire, Chablis (55)

**Script:** `scripts/wine-region-guide-generator.ts`
**Command:**
```bash
npx tsx scripts/generate-all-guides.ts --level vineyard
npx tsx scripts/generate-all-guides.ts --level village
```

#### B. Wine Review Generation (Parallel Task)
**Status:** Ongoing - Continue from Geranium list
**Source:** Geranium wine inventory list

**Tasks:**
- [ ] Continue generating reviews from Geranium list
- [ ] Upload to Sanity CMS
- [ ] Link to vineyards/regions
- [ ] Add tasting notes and scores
- [ ] Tag with vintages

**Current Progress:** [Need to check existing reviews count]

---

### Priority 2: Core Features (User-Facing)

#### 1. Smart Content Connections ⭐
**Status:** Pending
**Impact:** High - Makes content discoverable

**Tasks:**
- [ ] Add "Related Vineyards" sections to vineyard pages
- [ ] Add "Wines from this Vineyard" section (query Sanity)
- [ ] Cross-link regions, villages, and vineyards
- [ ] Add "Similar Regions" recommendations
- [ ] Implement breadcrumb navigation with metadata

**Files to Modify:**
- `components/RegionLayout.tsx`
- `components/VineyardLayout.tsx` (new)
- `lib/sanity/queries.ts`

---

#### 2. Wine 101 Fundamentals Hub ⭐
**Status:** Pending design
**Impact:** High - Critical for novices

**Tasks:**
- [ ] Create `/learn` route structure
- [ ] Generate beginner content with François:
  - Wine basics (grapes, regions, styles)
  - How to taste wine
  - Wine storage and serving
  - Food pairing fundamentals
  - Reading wine labels
  - Understanding classifications
- [ ] Build interactive components:
  - Grape variety explorer
  - Style finder quiz
  - Region difficulty ladder
- [ ] Link from homepage and global nav

**Estimated Cost:** $50-75 for content generation
**Estimated Time:** 1-2 days development

---

#### 3. Wine Finder Search & Filters ⭐
**Status:** Pending architecture
**Impact:** High - Core discovery feature

**Tasks:**
- [ ] Design search architecture (Algolia vs native Next.js search)
- [ ] Implement filters:
  - Country/Region/Sub-region/Village/Vineyard
  - Classification (Grand Cru, Premier Cru, etc.)
  - Grape variety
  - Style (red, white, sparkling, etc.)
  - Price range
  - Rating/score
  - Vintage
- [ ] Build autocomplete search
- [ ] Add "Recently viewed" and "Popular" sections
- [ ] Integrate with Sanity wine reviews

**Tech Decision Needed:** Algolia ($0-100/mo) vs custom search

---

#### 4. Intelligent Guided Discovery Paths
**Status:** Pending design
**Impact:** Medium-High - Engages users

**Tasks:**
- [ ] Create guided learning paths:
  - "Master Burgundy" path (Grand Crus → Premier Crus → Villages)
  - "German Wine Demystified" path
  - "Bordeaux Classifications Explained" path
  - "Italian Terroir Deep Dive" path
- [ ] Track user progress
- [ ] Award badges/achievements
- [ ] Generate personalized recommendations

**Estimated Time:** 3-5 days development

---

#### 5. Interactive Comparison Tools
**Status:** Pending design & scope
**Impact:** Medium - Differentiator feature

**Tasks:**
- [ ] Region comparison tool (side-by-side climate, soil, styles)
- [ ] Vintage comparison (performance across regions)
- [ ] Classification system comparison (Burgundy vs Bordeaux vs Germany)
- [ ] Producer comparison
- [ ] Visual charts and data visualization

**Tech Stack:** Chart.js or Recharts
**Estimated Time:** 2-3 days development

---

### Priority 3: Wine Region Guide - Design & UX Enhancements 🎨

#### 6. Visual Content & Maps ⭐
**Status:** Pending implementation
**Impact:** High - Dramatically improves guide usability and engagement

**Visual Content Tasks:**
- [ ] **Regional Overview Maps**
  - Clean, minimal vector maps for each country/region page
  - Show sub-region locations and boundaries
  - Interactive: hover vineyard name in sidebar → highlight on map
- [ ] **Hero Images**
  - Add single hero image to region/sub-region pages (~800px wide)
  - Documentary photography showing terroir (slopes, rivers, vineyards)
  - Examples: Mosel river bends, Sonnenuhr sundial + slate slopes
- [ ] **Vineyard Photography**
  - 2-3 photos per individual vineyard page:
    - Landscape showing slope/aspect
    - Close-up of soil/geology
    - Optional: harvest/cellar work
  - Helps visualize technical descriptions (70% slope, blue slate, etc.)

**Design Philosophy:** Educational, not promotional. Documentary photography, wine book cartography style.

---

#### 7. Functionality & Navigation Improvements ⭐
**Status:** Pending implementation
**Impact:** High - Improves navigation and information discovery

**Sidebar Enhancements:**
- [ ] **Search/Filter within Sidebar**
  - Essential for pages with 50+ vineyards (Rheingau, Pfalz)
  - Filter by classification (Grosse Lage / Erste Lage)
  - Instant filtering as user types
- [ ] **Jump-to-Classification Sticky Nav**
  - Quick navigation between Grand Cru / Premier Cru sections
  - Sticky header showing current section
- [ ] **Collapsible Sections** (optional)
  - For very long vineyard lists (Pfalz 55, Rheingau 54)
  - Expand/collapse classification groups
- [ ] **Visual Classification Indicators**
  - Colored dots/icons next to vineyard names:
    - 🔴 Grosse Lage (wine-red)
    - 🟡 Erste Lage (amber/gold)
  - Quick visual scanning

**Quick Facts Sidebar:**
- [ ] Add sticky "At a Glance" card:
  - Climate (cool/moderate/warm)
  - Primary grape varieties
  - Total hectares
  - Key soil types
  - Classification system used
- Provides orientation without reading full guide

**Comparison Tools:**
- [ ] Add comparison table for multi-sub-region pages
  - Climate differences
  - Soil types
  - Wine styles
  - Famous vineyards
- Collapsible "Compare Sub-Regions" accordion

---

#### 8. Content Structure & Readability ⭐
**Status:** Pending implementation
**Impact:** Medium-High - Makes dense guides more scannable

**Content Sectioning:**
- [ ] **Visual Hierarchy Improvements**
  - Section headers with icons (🌡️ Climate, 🪨 Geology, 🍇 Wines)
  - Pull quotes for key facts ("70-degree slopes of 400-million-year-old slate")
  - Highlighted stat boxes for numbers (8,800 hectares, 50°N latitude)
- [ ] **Key Takeaways Box**
  - 3-4 bullet summary at top of each guide
  - Quick orientation before deep dive
  - Example: "Mosel produces crystalline Riesling from extreme slate slopes at Germany's northern limit"
- [ ] **Related Vineyards Section**
  - Bottom of vineyard pages: "Similar Vineyards" or "Compare to Neighbors"
  - "If you're interested in Wehlener Sonnenuhr, also explore: Graacher Domprobst, Erdener Prälat"
  - With tiny thumbnail map showing proximity

**Typography:**
- [ ] Stronger heading hierarchy
- [ ] Consider serif font for guide headings (differentiate from UI)
- [ ] More whitespace around section breaks

---

#### 9. Data Visualization & Infographics
**Status:** Pending design & implementation
**Impact:** Medium - Enhances technical understanding

**Charts & Diagrams:**
- [ ] **Climate Charts**
  - Simple temperature/rainfall charts for regions
  - Compare growing seasons (Mosel vs Rheingau)
  - Static images or Chart.js visualizations
- [ ] **Soil Cross-Section Diagrams**
  - Show slope angle, soil depth, bedrock type, root penetration
  - Especially valuable for technical sites (Mosel slate, Burgundy limestone)
- [ ] **Vintage Charts** (optional)
  - Quality ratings by year
  - Drinking windows
  - Integrate with existing vintage data

**Tech Stack:** Chart.js or Recharts for visualizations

---

#### 10. Color Coding & Visual Design (Optional)
**Status:** Pending design review
**Impact:** Medium - Aesthetic polish

**Optional Enhancements:**
- [ ] **Subtle Regional Color Tints**
  - Background tints for different wine regions:
    - Mosel: cool slate blue-gray
    - Burgundy: warm burgundy tint
    - Bordeaux: deep purple-red
  - Very subtle (5-10% opacity)
- [ ] **Classification Color System**
  - Consistent colors across all regions:
    - Grand Cru: Amber/gold
    - Premier Cru: Wine-red
    - Village: Gray
    - VDP Grosse Lage: Wine-red
    - VDP Erste Lage: Amber

---

### Priority 4: Technical Improvements

#### 11. Fix Map GeoJSON & AVA/AOP Organization 🔧
**Status:** Known issue
**Impact:** Medium - Visual polish

**Tasks:**
- [ ] Debug GeoJSON rendering issues
- [ ] Verify AVA/AOP boundary accuracy
- [ ] Fix region shape display
- [ ] Add interactive map tooltips
- [ ] Link map regions to pages

**Files to Check:**
- `components/VineyardMap.tsx`
- GeoJSON data files in `/data`

---

#### 12. Mobile-First Experience Overhaul 📱
**Status:** Pending audit
**Impact:** High - 60%+ mobile traffic expected

**Tasks:**
- [ ] Audit mobile responsiveness
- [ ] Optimize sidebar navigation for mobile
- [ ] Improve touch targets
- [ ] Optimize image loading
- [ ] Test on iOS/Android devices
- [ ] PWA implementation (offline access)

**Estimated Time:** 2-3 days

---

#### 13. Content Gaps Integration
**Status:** Pending
**Impact:** Medium - Content quality

**Tasks:**
- [ ] Add placeholder messaging for missing guides
- [ ] Create "Request Guide" feature
- [ ] Prioritize guide generation based on page views
- [ ] Add "Last updated" timestamps
- [ ] Implement content freshness indicators

---

### Priority 5: Advanced Features (Nice to Have)

#### 14. Practical Tools for Collectors
**Status:** Explore carefully
**Impact:** Medium - Niche audience

**⚠️ Note:** Avoid wine valuation/investment features (speculative)

**Safe Tools to Build:**
- [ ] Cellar inventory tracker (simple list)
- [ ] Drinking window calculator (based on region/vintage)
- [ ] Food pairing suggestions
- [ ] Serving temperature guide
- [ ] Decanting recommendations

**Avoid:**
- ❌ Price tracking/valuation
- ❌ Investment scores
- ❌ Marketplace features

---

### Priority 6: Business Model

#### 15. Explore 501(c)(3) Nonprofit vs Minimal Monetization
**Status:** Decision needed
**Impact:** Strategic

**Options to Evaluate:**

**A. Nonprofit Educational Model (501c3)**
- Grant funding for content generation
- Educational partnerships
- Donation-based support
- Tax-deductible contributions

**B. Minimal Monetization**
- Affiliate links to wine retailers (ethical disclosure)
- Premium features ($5-10/mo):
  - Advanced search/filters
  - Cellar management
  - Personalized recommendations
  - Ad-free experience
- Sponsored educational content (clearly marked)

**C. Hybrid Model**
- Core content free and educational
- Premium tools for serious collectors
- Ethical affiliate partnerships

**Next Steps:**
- [ ] Consult with lawyer on nonprofit formation
- [ ] Research wine education nonprofit landscape
- [ ] Survey potential users on willingness to pay
- [ ] Define ethical guidelines for monetization

---

## 🔄 Parallel Ongoing Tasks

### Wine Review Generation (Continuous)
**Source:** Geranium wine list
**Script:** [Need to identify/create review generation script]
**Cadence:** Ongoing - generate in batches

**Tasks:**
- [ ] Continue processing Geranium list
- [ ] Generate tasting notes via François
- [ ] Upload to Sanity
- [ ] Link to regions/vineyards
- [ ] Add imagery and metadata
- [ ] Quality check reviews

**Current Status:** [Check Sanity for existing review count]

---

### Content Quality & SEO
**Ongoing maintenance tasks:**
- [ ] Add meta descriptions to all pages
- [ ] Optimize page titles for SEO
- [ ] Add structured data (Schema.org)
- [ ] Internal linking optimization
- [ ] Image optimization and alt text
- [ ] Performance monitoring (Core Web Vitals)

---

## 📈 Success Metrics

### Content Goals
- [x] 1,500+ region pages (✅ 1,656)
- [ ] 1,500+ vineyard guides (78/1,656 = 5%)
- [ ] 500+ wine reviews (Check current count)
- [ ] 100+ educational articles

### Technical Goals
- [x] Sub-3s page load time
- [x] TypeScript error-free build
- [ ] 90+ Lighthouse score
- [ ] PWA-ready
- [ ] Mobile-optimized

### User Engagement (Future)
- [ ] 10k monthly visitors (target)
- [ ] 5+ pages per session
- [ ] 3+ minute avg session
- [ ] 30% returning visitor rate

---

## 💰 Budget & Resources

### Completed Spend
- François guide generation: ~$150 (78 guides @ ~$2 each)
- Development time: ~40 hours
- **Total: ~$150 cash + dev time**

### Upcoming Costs

#### Immediate (Next 30 Days)
- **Vineyard guide generation:** $200-300 (1,578 guides @ $0.10-0.20 each)
- **Wine 101 content:** $50-75
- **Wine reviews (ongoing):** $100-200/month
- **Total:** $350-575

#### Medium-term (90 Days)
- **Hosting:** $20-50/month (Vercel Pro if needed)
- **Sanity CMS:** $0-99/month (depends on usage)
- **François API:** $200-400/month (review generation)
- **Search (if Algolia):** $0-100/month
- **Total:** ~$220-650/month

#### Long-term Investment
- **Complete content library:** $500-1,000 (all guides)
- **Custom features development:** 100-200 hours ($0 if in-house)
- **Mobile app updates:** Ongoing
- **Total:** $500-1,000 + dev time

---

## 🎯 Next Immediate Actions

1. **Generate missing vineyard guides** (Priority 1A)
   - Run batch generation scripts
   - ~$250 cost, 3-4 hours runtime
   - Gets content library to 95%+ complete

2. **Continue Geranium review generation** (Parallel task)
   - Process next batch from list
   - Upload to Sanity
   - Target: 50-100 reviews/week

3. **Build Wine 101 hub** (Priority 2)
   - High impact for user acquisition
   - Generates SEO-friendly beginner content
   - ~2 days development

4. **Implement Wine Finder search** (Priority 3)
   - Critical for discoverability
   - Decide on search architecture
   - ~3-5 days development

5. **Fix mobile experience** (Priority 7)
   - Audit and fix responsive issues
   - ~2-3 days development

---

## 📚 Related Documentation

- **[WINESAINT_CURRENT_STATE_ASSESSMENT.md](./WINESAINT_CURRENT_STATE_ASSESSMENT.md)** - Full build inventory & competitive analysis
- **[WINESAINT_PITCH_DECK.md](./WINESAINT_PITCH_DECK.md)** - Investor presentation (13 slides)
- **[PITCH_DECK_PROMPT_FOR_CLAUDE.txt](./PITCH_DECK_PROMPT_FOR_CLAUDE.txt)** - Claude Desktop template for slides
- **[fancy-munching-fiddle.md](~/.claude/plans/fancy-munching-fiddle.md)** - Original implementation plan

---

## 🤝 Team & Roles

**Current:** Solo development + Claude Code
**Future Needs:**
- Wine content expert (François QA)
- Designer (UI/UX polish)
- Marketing/SEO specialist
- Community manager

---

## 📝 Notes & Decisions

### Key Architectural Decisions
- ✅ Use Next.js App Router (not Pages Router)
- ✅ RegionLayout component for all hierarchy levels
- ✅ Sanity CMS for structured content
- ✅ François RAG for AI-generated content
- ✅ Static generation with ISR for performance
- ⚠️ Search architecture TBD (Algolia vs custom)
- ⚠️ Business model TBD (nonprofit vs minimal monetization)

### Content Strategy
- François generates initial guides (80% quality)
- Human review and enhancement (optional)
- Community contributions (future)
- Regular content updates with vintage data

### User Acquisition Strategy (TBD)
- SEO-first approach
- Wine community partnerships
- Social media presence
- Email newsletter
- Reddit/wine forums engagement

---

**Last Updated:** 2026-02-12
**Next Review:** Weekly during active development
