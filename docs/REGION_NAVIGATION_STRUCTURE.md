# Region Navigation Structure Reference

This document captures the hierarchical navigation structure for all wine regions in WineSaint, along with the principles and decisions made.

## Core Principles

1. **Geography over branding/classification** - Use actual places (towns, villages, geographic zones) rather than wine styles or quality classifications in navigation
2. **Follow how people discuss wine** - Structure should match real-world conversation patterns
3. **Know when to stop** - Not every region needs deep hierarchy; stop at the level that matters in practice
4. **Consistency within categories** - Similar regions (e.g., all US states, all Australian states) should follow the same pattern
5. **No style-based appellations** - Remove regional designations like Crémant, Macvin that can be made anywhere in a region

---

## FRANCE

### Burgundy (PINNED - TO BE FINALIZED)
**Status:** Structure proposed, needs final review

**Structure:**
- Main Burgundy page → 6 sub-regions (Chablis, Côte de Nuits, Côte de Beaune, Côte Chalonnaise, Mâconnais, Beaujolais)
- Côte de Nuits sub-page → Grouped by classification:
  - Grand Crus (Chambertin, Clos de Vougeot, Romanée-Conti, La Tâche, etc.)
  - Villages (Gevrey-Chambertin, Morey-Saint-Denis, Chambolle-Musigny, Vosne-Romanée, Nuits-Saint-Georges, etc.)
- Côte de Beaune sub-page → Same pattern (Grand Crus + Villages)
- Individual village pages → Sidebar shows all peer villages (NOT Premier Crus)

**Note:** Sidebar needs scrolling capability due to length

---

### Bordeaux
**Status:** APPROVED

**Structure:** Grouped by recognized geographic divisions
```typescript
{
  leftBank: [
    'Médoc', 'Pauillac', 'Saint-Julien', 'Margaux', 'Saint-Estèphe',
    'Pessac-Léognan', 'Graves', 'Sauternes', 'Barsac'
  ],
  rightBank: [
    'Pomerol', 'Saint-Émilion', 'Fronsac', 'Canon-Fronsac',
    'Côtes de Bourg', 'Côtes de Blaye'
  ],
  entreDeuxMers: [
    'Entre-Deux-Mers'
  ]
}
```

**Reasoning:** Traditional geography based on river divisions (Garonne/Dordogne). Côtes appellations belong to Right Bank geographically.

**Individual regions:** Flat guide pages (no further subdivisions)

---

### Champagne
**Status:** BUILT

**Structure:**
- Main Champagne page → 5 sub-regions
  - Montagne de Reims
  - Côte des Blancs
  - Vallée de la Marne
  - Côte de Sézanne
  - Côte des Bar
- Sub-region pages (e.g., Montagne de Reims) → Grouped by classification:
  - Grand Crus (9 villages)
  - Premier Crus (24 villages)
- Individual village pages → Built with guides

---

### Beaujolais
**Status:** BUILT

**Structure:** Flat list of 10 crus
- Brouilly, Chénas, Chiroubles, Côte de Brouilly, Fleurie, Juliénas, Morgon, Moulin-à-Vent, Régnié, Saint-Amour

---

### Rhône Valley

#### Northern Rhône
**Status:** BUILT

**Structure:** Flat list of 8 appellations
- Côte-Rôtie, Condrieu, Château-Grillet, Saint-Joseph, Hermitage, Crozes-Hermitage, Cornas, Saint-Péray

#### Southern Rhône
**Status:** BUILT

**Structure:** Flat list of 12 appellations
- Châteauneuf-du-Pape, Gigondas, Vacqueyras, Beaumes-de-Venise, Cairanne, Rasteau, Vinsobres, Lirac, Tavel, Ventoux, Luberon, Côtes du Rhône Villages

---

### Provence
**Status:** BUILT

**Structure:** Flat list of 9 appellations
- Côtes de Provence, Bandol, Cassis, Coteaux d'Aix-en-Provence, Coteaux Varois en Provence, Les Baux-de-Provence, Palette, Bellet, Pierrevert

---

### Jura
**Status:** BUILT (Style-based appellations removed)

**Structure:** Flat list of 4 geographic appellations
- Arbois, Château-Chalon, L'Étoile, Côtes du Jura

**Removed:** Crémant du Jura, Macvin du Jura (style-based, not geographic)

---

### Roussillon
**Status:** BUILT

**Structure:** Flat list including VDN regions
- Côtes du Roussillon, Côtes du Roussillon Villages, Collioure, Banyuls, Banyuls Grand Cru, Maury, Maury Sec, Rivesaltes, Muscat de Rivesaltes

**Note:** Banyuls, Maury, Rivesaltes ARE geographic (specific towns/areas), not just style-based like Crémant

---

### Loire Valley
**Status:** BUILT (Structure to be reviewed)

**Current structure:** 4 sub-regions with 42 appellations total
- Anjou-Saumur (12 appellations)
- Centre-Loire (11 appellations)
- Pays Nantais (7 appellations)
- Touraine (12 appellations)

**Note:** User acknowledged this is "a lot of stuff" and there's "definitely a better way to do the Loire" - structure may be revised in future

---

### Alsace
**Status:** APPROVED

**Structure:**
- Main Alsace page → 2 departments (Haut-Rhin, Bas-Rhin)
- Haut-Rhin sub-page → List of Grand Crus in Haut-Rhin
- Bas-Rhin sub-page → List of Grand Crus in Bas-Rhin

**Action needed:** Create individual Grand Cru pages (51 total across both departments)

---

## ITALY

### Piedmont
**Status:** APPROVED

**Structure:**
- Main Piedmont page → Flat list of major regions
  - Barolo, Barbaresco, Alto Piemonte, Roero, Langhe, Gavi, Barbera d'Asti, Barbera d'Alba, Dolcetto d'Alba
- Barolo sub-page → Flat list of 11 communes
  - Barolo, La Morra, Monforte d'Alba, Serralunga d'Alba, Castiglione Falletto, Novello, Verduno, etc.
- Barbaresco sub-page → Flat list of 3 villages
  - Barbaresco, Neive, Treiso
- Alto Piemonte sub-page → Flat list of appellations
  - Gattinara, Ghemme, Lessona, Bramaterra, Boca, Carema, etc.

**Reasoning:** Alto Piemonte grouped as a sub-region because its multiple appellations are discussed as a collective zone

---

### Tuscany
**Status:** APPROVED

**Structure:** Flat list using how people talk about wine
- Chianti (discusses Chianti Classico DOCG within the guide text)
- Brunello di Montalcino (NOT "Montalcino" - the wine identity is the DOCG)
- Vino Nobile di Montepulciano (same reasoning)
- Bolgheri
- Carmignano

**Principle:** "Geography and we can always talk about a specialized zone in text not section" BUT with nuance - use what's meaningful in actual wine conversation

---

### Veneto
**Status:** APPROVED

**Structure:** Single flat guide page (no subdivisions)

**Reasoning:** Veneto guide discusses all appellations (Valpolicella, Soave, Prosecco, Bardolino, Lugana, etc.) in the text rather than creating separate pages

---

### Friuli
**Status:** APPROVED

**Structure:** Single flat guide page (no subdivisions)

---

### Sicily
**Status:** APPROVED

**Structure:** List of 4 major regions
- Etna, Cerasuolo di Vittoria, Marsala, Pantelleria

---

### Campania
**Status:** APPROVED

**Structure:** List of 6 regions (4 DOCGs + 2 notable DOCs)
- Taurasi, Fiano di Avellino, Greco di Tufo, Aglianico del Taburno, Falerno del Massico, Lacryma Christi del Vesuvio

---

### Lombardy
**Status:** APPROVED

**Structure:** List of 4 major regions
- Franciacorta, Valtellina (with sub-zones: Sassella, Grumello, Inferno, Valgella), Oltrepò Pavese, Lugana

---

### Trentino-Alto Adige
**Status:** APPROVED

**Structure:** Split into two flat pages
- Alto Adige, Trentino

---

### Abruzzo
**Status:** APPROVED

**Structure:** Single flat guide page

---

### Umbria
**Status:** APPROVED

**Structure:** List of 3 DOCs
- Montefalco, Orvieto, Torgiano

---

### Marche
**Status:** APPROVED

**Structure:** List of 5 regions (DOCGs + notable DOCs)
- Verdicchio dei Castelli di Jesi, Verdicchio di Matelica, Conero, Lacrima di Morro d'Alba, Rosso Piceno

---

### Puglia
**Status:** APPROVED

**Structure:** List of 6 major DOCs
- Primitivo di Manduria, Salice Salentino, Castel del Monte, Gioia del Colle, Locorotondo, Copertino

---

### Sardinia
**Status:** APPROVED

**Structure:** Single flat guide page

---

### Emilia-Romagna
**Status:** APPROVED

**Structure:** Single flat guide page

---

### Basilicata
**Status:** APPROVED

**Structure:** Single flat guide page

---

### Liguria
**Status:** APPROVED

**Structure:** Single flat guide page

---

### Calabria
**Status:** APPROVED

**Structure:** Single flat guide page

---

### Molise
**Status:** APPROVED

**Structure:** Single flat guide page

---

## GERMANY (PINNED - TO BE FINALIZED)

### Mosel
**Status:** APPROVED with grouping

**Structure:** Grouped by traditional river sections
```typescript
{
  mittelmosel: [  // Middle Mosel - famous heart
    'Bernkastel', 'Wehlen', 'Graach', 'Erden', 'Ürzig', 'Piesport'
  ],
  saar: [  // Saar tributary
    'Ockfen', 'Wiltingen', 'Saarburg'
  ],
  ruwer: [  // Ruwer tributary
    'Kasel', 'Mertesdorf'
  ]
}
```

**Reasoning:** Saar and Ruwer are recognized as distinct sub-regions with different terroir; grouping helps users understand Mosel structure

**OPEN QUESTION:** Should village pages show einzellagen (individual vineyards) like Wehlener Sonnenuhr? This is the same hierarchy question as Burgundy Premier Crus.

---

### Rheingau
**Status:** PROPOSED (flat list)

**Structure:** Flat list of 10-15 villages
- Rüdesheim, Geisenheim, Johannisberg, Winkel, Oestrich, Hattenheim, Erbach, Rauenthal, Kiedrich, Eltville

**Reasoning:** Smaller and more homogeneous than Mosel; no clear sub-divisions

**OPEN QUESTION:** Same einzellagen question applies

---

### Other German Regions
**Status:** APPROVED - All flat pages for now

**Regions to create:**
- Rheinhessen (flat page)
- Pfalz (flat page)
- Nahe (flat page)
- Baden (flat page)
- Franken (flat page)
- Württemberg (flat page)
- Ahr (flat page)
- Mittelrhein (flat page)
- Saale-Unstrut (flat page)
- Sachsen (flat page)

**Note:** Village/einzellagen structure deferred until Burgundy/Germany hierarchy decisions are finalized

---

## SPAIN

### Rioja
**Status:** APPROVED with grouping

**Structure:** Grouped by official sub-regions
```typescript
{
  riojaAlta: [...],      // Villages in Rioja Alta
  riojaAlavesa: [...],   // Villages in Rioja Alavesa
  riojaOriental: [...]   // Villages in Rioja Oriental (formerly Baja)
}
```

**Individual sub-region pages:** Flat guide pages (NO village subdivisions)

**Reasoning:** The three sub-regions (Alta, Alavesa, Oriental) are the endpoint - villages don't matter in Rioja conversation the way they do in Burgundy. People discuss "Rioja Alta" character, not individual towns.

---

### Priorat
**Status:** APPROVED

**Structure:** Flat guide page (no village subdivisions)

**Reasoning:** Regional identity is more important than individual villages in wine conversation

---

### Ribera del Duero
**Status:** APPROVED

**Structure:** Flat guide page (no subdivisions)

---

### Spain - Complete Structure
**Status:** APPROVED - Keep existing structure, fill in missing pages

**Current structure (24 regions):**
All flat pages organized by geographic area in sidebar:
- Northern Spain: Rioja, Navarra, Txakoli
- Castilla y León: Ribera del Duero, Toro, Rueda, Bierzo, Cigales
- Galicia: Rías Baixas, Ribeiro, Valdeorras
- Catalonia: Priorat, Montsant, Penedès, Cava
- Aragón: Somontano, Calatayud
- Central Spain: La Mancha
- Levante: Jumilla, Yecla, Alicante, Valencia
- Andalusia: Jerez, Montilla-Moriles, Málaga

**Note:** Rioja already has sub-region structure (Alta/Alavesa/Oriental) approved earlier. Structure can be reorganized later if needed - just need to build missing pages for now.

---

## PORTUGAL

### Douro
**Status:** APPROVED

**Structure:** Flat guide page (no subdivisions)

**Reasoning:** While Douro has sub-regions (Baixo Corgo, Cima Corgo, Douro Superior), they're not commonly discussed in wine conversation

---

### Portugal - Complete Structure
**Status:** APPROVED - Keep existing structure, fill in missing pages

**Current structure (15 regions):**
All flat pages organized by geographic area in sidebar:
- Northern Portugal: Vinho Verde, Douro, Porto, Trás-os-Montes
- Central Portugal: Dão, Bairrada, Távora-Varosa, Beira Interior, Lisboa, Tejo
- Southern Portugal: Alentejo, Setúbal, Algarve
- Islands: Madeira, Açores

**Note:** Structure can be reorganized later if needed - just need to build missing pages for now

---

## AUSTRIA

### Wachau
**Status:** APPROVED (flat page for now)

**Structure:** Flat guide page

**Note:** Villages exist (Dürnstein, Weißenkirchen, Spitz) and famous vineyards exist (Achleiten, Kellerberg), but pinned for later decision along with Germany einzellagen question

---

## UNITED STATES

### General Structure
**Principle:** Organize by state (mirrors Australia state structure)

---

### California - Napa Valley
**Status:** APPROVED

**Structure:** Flat list of all 16 sub-AVAs
- Oakville, Rutherford, Stags Leap District, Yountville, Howell Mountain, Mount Veeder, Diamond Mountain District, Spring Mountain District, Atlas Peak, Calistoga, St. Helena, Coombsville, etc.

**No grouping** by valley floor vs. mountains - use actual AVAs only

---

### California - Sonoma
**Status:** APPROVED

**Structure:** Flat list of all Sonoma AVAs
- Russian River Valley, Alexander Valley, Dry Creek Valley, Sonoma Coast, Fort Ross-Seaview, Chalk Hill, Knights Valley, Bennett Valley, Carneros, etc.

---

### California - Other Regions
**Status:** BUILT, structure confirmed good
- Santa Barbara, Central Coast, Paso Robles

---

### Oregon - Willamette Valley
**Status:** BUILT

**Structure:** Flat list of sub-AVAs
- Chehalem Mountains, Dundee Hills, Eola-Amity Hills, Laurelwood District, Lower Long Tom, McMinnville, Mount Pisgah Polk County, Ribbon Ridge, Tualatin Hills, Van Duzer Corridor, Yamhill-Carlton

---

### Washington
**Status:** BUILT, needs individual region pages

**Current structure:** Columbia Valley, Puget Sound, Columbia Gorge

**Note:** Structure is good, just needs pages built for the sub-regions

---

## AUSTRALIA

### General Structure
**Status:** APPROVED

**Principle:** Organize by state (mirrors US structure)

**Structure:**
- Australia main page → Lists states:
  - South Australia, Victoria, Western Australia, New South Wales, Tasmania
- State pages → List regions within that state
- Individual regions → Flat guide pages (no further subdivisions)

---

### South Australia
**Structure:**
- Barossa Valley (flat page)
- Eden Valley (flat page - peer to Barossa, not under it)
- McLaren Vale, Clare Valley, Adelaide Hills, Coonawarra

**Note:** Earlier structure showed towns under Barossa (Greenock, Lyndoch, etc.) - these should be removed. Only Barossa and Eden Valley as peers.

---

### Victoria
**Structure:**
- Yarra Valley (flat page)
- Mornington Peninsula, Heathcote, Geelong

**Note:** Earlier structure showed Central/Lower/Upper Yarra subdivisions - decision pending on whether these matter

---

### Western Australia
**Structure:**
- Margaret River, Great Southern

---

### New South Wales
**Structure:**
- Hunter Valley

---

### Tasmania
**Structure:**
- Tasmania (standalone)

---

## NEW ZEALAND

**Status:** APPROVED

**Structure:** Flat list of regions (NO North/South Island grouping)
- Marlborough, Central Otago, Hawke's Bay, Martinborough, Auckland/Waiheke, Gisborne, Canterbury, Nelson

**Reasoning:** Only 8-10 major regions, manageable as flat list. North/South Island division doesn't carry wine identity weight like Australian states do. Regional identity (especially Marlborough) is stronger than island identity.

---

## SOUTH AFRICA

**Status:** APPROVED - Keep existing structure, fill in missing pages

**Current structure (10 districts):**
All flat pages, no grouping:
- Stellenbosch, Franschhoek, Paarl, Constantia, Swartland, Walker Bay, Hemel-en-Aarde, Elgin, Robertson, Tulbagh

**Note:** No Western Cape grouping - regions stand on their own

---

## ARGENTINA

### Mendoza
**Status:** BUILT, structure approved

**Current structure:** Lists departments and Uco Valley
- Luján de Cuyo, Maipú, San Martín, San Rafael, Uco Valley

**Note:** Argentina structure stays as is - departments are meaningful subdivisions

---

## CHILE

**Status:** BUILT, no changes planned

**Note:** User comment: "Chilean wine is bad" - low priority for optimization

---

## GREECE

**Status:** APPROVED

**Structure:** Hybrid - standalone famous regions + geographic groupings

**Main Greece page lists 8 major regions:**
1. Santorini (flat page)
2. Crete (flat page)
3. Cephalonia (flat page)
4. Samos (flat page)
5. Northern Greece (sub-page with: Naoussa, Amyndeon, Drama as individual pages)
6. Peloponnese (sub-page with: Nemea, Mantinia, Patras as individual pages)
7. Rapsani (flat page)
8. Attica (flat page)

---

## REGIONS NOT YET DISCUSSED

- Israel (skipped for now)
- Canada (skipped for now)
- Switzerland (has Grand Cru system but not applicable yet)

---

## PENDING DECISIONS

### High Priority - Complex Hierarchy Regions

1. **Burgundy** - Need to finalize Grand Cru/Premier Cru/Village structure and sidebar behavior
2. **Germany (all regions)** - Need to decide on einzellagen (individual vineyard) display
3. **Alsace** - Need to decide on department vs. village vs. Grand Cru structure
4. **Loire Valley** - User acknowledged current structure has too many appellations, needs better organization

### Medium Priority

5. **Austria (Wachau)** - Linked to Germany einzellagen decision
6. **Australia (Yarra Valley)** - Confirm whether Central/Lower/Upper Yarra subdivisions matter
7. **Australia (Barossa)** - Remove town subdivisions, keep only Barossa + Eden Valley as peers

---

## STYLE-BASED APPELLATIONS TO AVOID

These should NOT appear in navigation (can be discussed in guide text):
- ❌ Crémant de [Region] - sparkling style appellations
- ❌ Macvin du Jura - fortified style appellations
- ❌ Any regional designation that can be made anywhere in the region

**Exception:** VDN regions like Banyuls, Maury, Rivesaltes ARE geographic (specific towns), not style-based

---

## IMPLEMENTATION NOTES

### Sidebar Scrolling
All regions with long lists (15+ items) need independent sidebar scrolling:
```typescript
<div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-2">
```

### Classification Grouping Pattern
When grouping by classification (Grand Cru/Premier Cru, Left Bank/Right Bank, etc.):
```typescript
const REGION_STRUCTURE = {
  categoryA: [
    { name: 'Place 1', slug: 'place-1' },
    { name: 'Place 2', slug: 'place-2' },
  ],
  categoryB: [
    { name: 'Place 3', slug: 'place-3' },
  ]
}
```

Currently only Champagne sub-regions (Montagne de Reims, etc.) use this pattern in the codebase. Will need to implement for: Burgundy (Côte de Nuits/Beaune), Bordeaux, Rioja, Mosel.

---

## FUTURE WORK NEEDED

1. **Build out approved structures** that aren't yet implemented (Bordeaux, Tuscany, etc.)
2. **Finalize complex hierarchy decisions** (Burgundy, Germany, Alsace)
3. **Implement classification grouping UI** for regions that need it
4. **Review and optimize Loire Valley** structure
5. **Generate guides** for all approved regions once François data is ready
6. **Clean up Australia** region pages (remove town subdivisions from Barossa, clarify Yarra Valley)

---

*Document created: 2026-02-11*
*Last updated: 2026-02-11*
