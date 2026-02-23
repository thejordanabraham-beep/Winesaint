# Bordeaux Elegance Theme - Color & Font Reference

## Quick Revert Instructions
To revert to the old theme, in `app/globals.css`:
1. Uncomment the OLD FONTS import line
2. Uncomment the OLD COLORS section in :root
3. Uncomment the OLD FONTS in @theme inline
4. Comment out all the new Bordeaux values

Then globally replace colors in components:
- `#722F37` → `#e63946`
- `#FAF7F2` → `#fffbf5`
- `#1C1C1C` → `#1a1a1a`
- `#8B9D83` → `#123524`
- `#A64253` → `#d62839`
- `#6B7F5C` → `#0d2518`

---

## New Bordeaux Elegance Color Palette

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Linen** (background) | `#FAF7F2` | Main background, card backgrounds |
| **Deep Ink** (foreground) | `#1C1C1C` | Primary text, borders |
| **Bordeaux** (primary) | `#722F37` | Primary buttons, links, accents, announcement bar |
| **Copper** (secondary) | `#B8926A` | Highlights, badges, premium elements |
| **Sage** (accent) | `#8B9D83` | Search dropdown button, secondary actions |
| **Berry** (highlight) | `#A64253` | Hover states, lighter wine accents |
| **Muted Gray** | `#6B6B6B` | Secondary text, muted info |
| **Dark Sage** (hover) | `#6B7F5C` | Sage button hover states |

---

## Old Theme Colors (for reference)

| Old Color Name | Hex Code | New Replacement |
|----------------|----------|-----------------|
| Cream background | `#fffbf5` | `#FAF7F2` (Linen) |
| Dark text | `#1a1a1a` | `#1C1C1C` (Deep Ink) |
| Red accent | `#e63946` | `#722F37` (Bordeaux) |
| Green button | `#123524` | `#8B9D83` (Sage) |
| Red hover | `#d62839` | `#A64253` (Berry) |
| Green hover | `#0d2518` | `#6B7F5C` (Dark Sage) |

---

## Typography

### New Fonts
- **Logo/Display**: Crimson Pro (serif) - italic, weights 400, 600, 700
- **Headings**: Josefin Sans (sans-serif) - weights 400, 600, 700
- **Body**: Nunito Sans (sans-serif) - weights 400, 600, 700

### Old Fonts (to revert)
- **Serif**: Playfair Display
- **Sans**: Inter

---

## Files Modified

1. `app/globals.css` - Color variables, font imports, custom classes
2. `components/layout/Header.tsx` - All color references
3. `components/search/SearchFilters.tsx` - All color references

---

## Design Philosophy

**Bordeaux Elegance** evokes:
- Wine culture (burgundy tones, oak barrel copper)
- Terroir and nature (vineyard sage green)
- Premium quality (warm neutrals, sophisticated serif)
- Approachability (soft backgrounds, readable sans-serif body)

---

**Created:** January 23, 2026
**Theme:** Bordeaux Elegance
**Status:** Active - easy to revert if needed
