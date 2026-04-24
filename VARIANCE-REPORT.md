# Variance Report: Working Version (9b6a7bb) vs Current Payload

## Summary
- **Working version**: 2,439 regions
- **Current Payload**: 2,466 regions
- **In working but NOT in Payload**: 28 paths
- **In Payload but NOT in working**: 55 paths

---

## GERMANY/MOSEL: IDENTICAL
Both versions have exactly 133 paths under germany/mosel with the same structure:
- Mosel (parent)
- 5 subregions: mittelmosel, obermosel, ruwer, saar, terrassenmosel
- Each subregion has nested vineyards
- Plus ~79 direct vineyards under mosel/

**The hierarchy is correct. The issue was the sidebarLinks not being set.**

---

## PATHS IN WORKING VERSION BUT MISSING FROM PAYLOAD (28)

### France Rhone Structure Issue
The working version had multiple Rhone structures:
```
france/northern-rhone/chateau-grillet
france/northern-rhone/condrieu
france/northern-rhone/cornas
france/northern-rhone/cote-rotie
france/northern-rhone/crozes-hermitage
france/northern-rhone/hermitage
france/northern-rhone/saint-joseph
france/northern-rhone/saint-peray

france/southern-rhone/beaumes-de-venise
france/southern-rhone/cairanne
france/southern-rhone/chateauneuf-du-pape
france/southern-rhone/cotes-du-rhone-villages
france/southern-rhone/gigondas
france/southern-rhone/lirac
france/southern-rhone/luberon
france/southern-rhone/rasteau
france/southern-rhone/tavel
france/southern-rhone/vacqueyras
france/southern-rhone/ventoux
france/southern-rhone/vinsobres

france/rhone-valley/chateauneuf-du-pape
france/rhone-valley/condrieu
france/rhone-valley/cote-rotie
france/rhone-valley/hermitage

france/rhone/cornas
france/rhone/hermitage
```

### Other Missing
```
australia/eden-valley (standalone - should be australia/barossa-valley/eden-valley?)
```

---

## PATHS IN PAYLOAD BUT NOT IN WORKING VERSION (55)

### Orphan Regions (no parent path)
These appear to be wine import artifacts - regions without proper country prefix:
```
amador
arroyo-grande-valley
canberra-district
canterbury
carneros
castillon
contra-costa
contra-costa-county
diamond-mountain
edna-valley
green-valley-russian-river
happy-canyon-of-santa-barbara
kumeu
macedon-ranges
mendocino-county
moon-mountain
mosel                          <-- DUPLICATE: should be germany/mosel
mosel-saar                     <-- DUPLICATE: should be under germany/mosel
north-coast
san-luis-obispo
santa-barbara-county
santa-clara-valley
sonoma-coast
sonoma-county
spring-mountain
sta-rita-hills
stags-leap
waipara
```

### France Rhone Restructured Path
Payload has Rhone under rhone-valley with northern/southern nested:
```
france/rhone-valley/northern-rhone/chateau-grillet
france/rhone-valley/northern-rhone/condrieu
france/rhone-valley/northern-rhone/cornas
france/rhone-valley/northern-rhone/cote-rotie
france/rhone-valley/northern-rhone/crozes-hermitage
france/rhone-valley/northern-rhone/hermitage
france/rhone-valley/northern-rhone/saint-joseph
france/rhone-valley/northern-rhone/saint-peray

france/rhone-valley/southern-rhone/beaumes-de-venise
france/rhone-valley/southern-rhone/cairanne
france/rhone-valley/southern-rhone/chateauneuf-du-pape
france/rhone-valley/southern-rhone/cotes-du-rhone-villages
france/rhone-valley/southern-rhone/gigondas
france/rhone-valley/southern-rhone/lirac
france/rhone-valley/southern-rhone/luberon
france/rhone-valley/southern-rhone/rasteau
france/rhone-valley/southern-rhone/tavel
france/rhone-valley/southern-rhone/vacqueyras
france/rhone-valley/southern-rhone/ventoux
france/rhone-valley/southern-rhone/vinsobres
```

### Bordeaux Duplicates
Payload has these at france/bordeaux/ level (working version had them under left-bank/right-bank):
```
france/bordeaux/margaux
france/bordeaux/pauillac
france/bordeaux/pomerol
france/bordeaux/saint-emilion
france/bordeaux/saint-julien
```

### Australia Eden Valley
```
australia/barossa-valley/eden-valley  (Payload has it nested under Barossa)
```
vs working version had:
```
australia/eden-valley (standalone)
```

---

## ISSUES TO FIX

### 1. Orphan Regions (28 regions)
Delete these orphan paths that have no country prefix - they were created from wine imports:
- amador, arroyo-grande-valley, canberra-district, canterbury, carneros, castillon, etc.
- mosel, mosel-saar (duplicates of germany/mosel)

### 2. France Rhone Structure
Decide on ONE structure:
- **Working version**: france/northern-rhone/, france/southern-rhone/
- **Payload**: france/rhone-valley/northern-rhone/, france/rhone-valley/southern-rhone/

### 3. Bordeaux Structure
Working version had:
- france/bordeaux/left-bank/margaux
- france/bordeaux/right-bank/pomerol

Payload has both:
- france/bordeaux/left-bank/margaux (correct)
- france/bordeaux/margaux (duplicate at wrong level)

### 4. Australia Eden Valley
Pick one:
- australia/eden-valley (working)
- australia/barossa-valley/eden-valley (Payload)

---

## BROKEN PARENT RELATIONSHIPS (58 total)

These regions have paths with slashes but their parent_region_id doesn't match:

### france/rhone/* - Missing parents (46 regions)
The `france/rhone/cornas` and `france/rhone/hermitage` parents don't exist, so their children are orphaned:
```
france/rhone/cornas/chaillot -> parent: NULL
france/rhone/cornas/champelrose -> parent: NULL
... (21 Cornas climats total)

france/rhone/hermitage/chante-alouette -> parent: NULL
france/rhone/hermitage/les-bessards -> parent: NULL
... (21 Hermitage climats total)
```

### france/loire/muscadet - Missing parent (1 region)
```
france/loire/muscadet -> parent: NULL (expected: france/loire)
```

### france/rhone-valley/* - Wrong parent path (11 regions)
These have `full_slug` at one level but `parent_region_id` points to a different path:
```
france/rhone-valley/chateauneuf-du-pape/chateau-de-beaucastel
  -> parent: france/rhone-valley/southern-rhone/chateauneuf-du-pape
  -> expected: france/rhone-valley/chateauneuf-du-pape

france/rhone-valley/hermitage/domaine-jean-louis-chave
  -> parent: france/rhone-valley/northern-rhone/hermitage
  -> expected: france/rhone-valley/hermitage
```

---

## SIDEBAR LINKS STATUS

The Germany/Mosel hierarchy paths are IDENTICAL. The problem was that Mosel's sidebarLinks weren't set, so the page showed all 133 children instead of just the 5 subregions.

**Fixed earlier**: Set Mosel's sidebarLinks to show only:
- Mittelmosel
- Obermosel
- Ruwer
- Saar
- Terrassenmosel

---

## COMPLETE FIX LIST

### Priority 1: Delete Orphan Regions (28)
Regions without country prefix that came from wine imports:
- amador, arroyo-grande-valley, canberra-district, canterbury, carneros, castillon
- contra-costa, contra-costa-county, diamond-mountain, edna-valley
- green-valley-russian-river, happy-canyon-of-santa-barbara, kumeu
- macedon-ranges, mendocino-county, moon-mountain, mosel, mosel-saar
- north-coast, san-luis-obispo, santa-barbara-county, santa-clara-valley
- sonoma-coast, sonoma-county, spring-mountain, sta-rita-hills, stags-leap, waipara

### Priority 2: Fix France Rhone Structure
Choose ONE canonical path and consolidate:
- Option A: france/northern-rhone/ and france/southern-rhone/ (working version)
- Option B: france/rhone-valley/northern-rhone/ and france/rhone-valley/southern-rhone/ (Payload)

Then delete the duplicate paths and fix parent relationships.

### Priority 3: Fix Bordeaux Duplicates
Delete duplicate paths at france/bordeaux/ level:
- france/bordeaux/margaux (keep france/bordeaux/left-bank/margaux)
- france/bordeaux/pauillac (keep france/bordeaux/left-bank/pauillac)
- france/bordeaux/pomerol (keep france/bordeaux/right-bank/pomerol)
- france/bordeaux/saint-emilion (keep france/bordeaux/right-bank/saint-emilion)
- france/bordeaux/saint-julien (keep france/bordeaux/left-bank/saint-julien)

### Priority 4: Fix Australia Eden Valley
Choose one:
- australia/eden-valley (working version - standalone)
- australia/barossa-valley/eden-valley (Payload - nested)

### Priority 5: Set sidebarLinks for regions with mixed children
Any region that has both subregions AND direct children needs explicit sidebarLinks to show only the subregions.
