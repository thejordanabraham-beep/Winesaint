# Phase 1: Burgundy Climat Import Guide

## ✅ Schema Changes Completed

### What Changed:

1. **`wine.ts`** - Updated to use references instead of strings:
   ```typescript
   appellation: reference → appellation
   vineyard: reference → vineyard
   climat: reference → climat (NEW)
   ```

2. **`climat.ts`** - New schema created for single-vineyard designations:
   - Supports Burgundy climats (Grand Cru, Premier Cru, Village)
   - Supports Italian MGAs (Barolo, Barbaresco)
   - Supports German einzellagen (VDP classifications)
   - Includes terroir data: soil, elevation, aspect, slope
   - Geographic boundaries (GeoJSON)
   - Producer relationships

3. **Schema hierarchy now:**
   ```
   Region (Burgundy)
     └─ Appellation (Vosne-Romanée)
         └─ Climat (Les Amoureuses - Premier Cru)
             └─ Producers (multiple domains with parcels)
                 └─ Wines (specific vintages)
   ```

---

## 📊 Where to Get Official Burgundy Data

### Source 1: INAO (Institut National de l'Origine et de la Qualité)
**Best for:** Official climat names, classifications, boundaries

**Data available:**
- ~1,247 Burgundy climats
- Official Grand Cru (33) and Premier Cru classifications
- Village appellations
- Legal boundaries

**How to access:**
1. INAO Open Data Portal: https://www.inao.gouv.fr/
2. Download "Parcellaire des AOC viticoles" dataset
3. Filter for Burgundy (Bourgogne) regions

**Format:** Shapefile (GeoJSON) with official boundaries

---

### Source 2: Bivb (Bureau Interprofessionnel des Vins de Bourgogne)
**Best for:** Educational descriptions, terroir characteristics

**Data available:**
- Climat descriptions
- Soil types
- Historical context
- Producer information

**Website:** https://www.vins-bourgogne.fr/
**Note:** More qualitative data, complements INAO

---

### Source 3: UNESCO Burgundy Climats List
**Best for:** Historical significance, cultural context

In 2015, 1,247 Burgundy climats were designated as UNESCO World Heritage Sites.

**Download:**
- UNESCO official list: https://whc.unesco.org/en/list/1425/
- Includes complete inventory of climats with descriptions

---

### Source 4: Wine Folly / Wine-Searcher
**Best for:** Quick reference while building

- Wine Folly has mapped major climats visually
- Wine-Searcher API (paid) has structured vineyard data
- Good for cross-referencing

---

## 🛠️ Import Script Template

I've created a sample import script at:
`/Users/jordanabraham/wine-reviews/scripts/import-burgundy-climats.ts`

### What it does:
1. Reads CSV/JSON of Burgundy climats
2. Creates Sanity documents for each climat
3. Links to existing appellations
4. Populates classification levels
5. Adds terroir data (soil, elevation)

### To run:
```bash
cd wine-reviews
npm run import-climats
```

---

## 📋 Sample Data Format

Here's what your CSV/JSON should look like:

```csv
name,appellation,classification,region,acreage,soil_types,aspect,description
Les Amoureuses,Chambolle-Musigny,premier_cru,Burgundy,5.4,"limestone,clay",southeast,"One of Burgundy's most prestigious Premier Crus..."
Bonnes-Mares,Chambolle-Musigny,grand_cru,Burgundy,15.06,"limestone,marl",east,"Grand Cru straddling Chambolle-Musigny and Morey-Saint-Denis..."
La Tâche,Vosne-Romanée,grand_cru,Burgundy,6.06,limestone,southeast,"Monopole of Domaine de la Romanée-Conti..."
```

---

## 🎯 Quick Start: Import Top 100 Climats First

Instead of all 1,247, start with the most important ones:

### Grand Crus (33 total):
- **Côte de Nuits:** Chambertin, Clos de Vougeot, Romanée-Conti, La Tâche, etc.
- **Côte de Beaune:** Montrachet, Corton, Bâtard-Montrachet, etc.

### Top Premier Crus (~50):
- Les Amoureuses, Clos Saint-Jacques, Les Caillerets, Les Perrières, etc.

I can provide you with a curated CSV of these top 100 climats if you'd like.

---

## 🤖 Training François to Recognize Climats

Once data is imported, François needs examples. Create a training set:

### Example wine names → Expected extraction:

```json
[
  {
    "input": "2020 Domaine Leroy Chambolle-Musigny Les Charmes",
    "expected": {
      "producer": "Domaine Leroy",
      "appellation": "Chambolle-Musigny",
      "climat": "Les Charmes",
      "classification": "premier_cru",
      "vintage": 2020
    }
  },
  {
    "input": "2019 Domaine de la Romanée-Conti Romanée-Saint-Vivant",
    "expected": {
      "producer": "Domaine de la Romanée-Conti",
      "climat": "Romanée-Saint-Vivant",
      "classification": "grand_cru",
      "vintage": 2019
    }
  }
]
```

Feed 100 examples to François and it will learn the patterns.

---

## ✅ Next Steps

1. **Choose your data source** (I recommend INAO + manual curation)
2. **Download/prepare the top 100 climats** (I can help with this)
3. **Run the import script** to populate Sanity
4. **Test with existing wines** - update a few wines to use the new climat references
5. **Train François** with example wine names

---

## 🆘 Need Help?

Let me know if you want me to:
- Find and download the INAO data for you
- Create the curated top 100 climats CSV
- Build the import script
- Set up the François training pipeline

**Current Status:** Schema is ready ✅
**Next:** Get the data and import it

