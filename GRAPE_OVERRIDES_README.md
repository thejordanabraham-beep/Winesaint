# Grape Guide - Name and Essential Status Management

This document explains how to edit grape names and control which grapes appear in the "Essential" toggle on the Grape Guide page.

## Overview

The Grape Guide uses two data sources:
1. **`/app/data/grapes.json`** - Main grape data (218 grapes total)
2. **`/app/data/grape-overrides.json`** - Your customizations for names and essential status

## How to Edit Grape Names

To change how a grape name appears in the Grape Guide:

1. Open `/app/data/grape-overrides.json`
2. Add or edit entries in the `name_overrides` object
3. Use the original name (from grapes.json) as the key, and your preferred display name as the value

### Example: Changing grape names

```json
{
  "name_overrides": {
    "AGLIANICO": "Aglianico",
    "CABERNET SAUVIGNON": "Cabernet Sauvignon",
    "PINOT NOIR": "Pinot Noir"
  }
}
```

This will change how these grapes are displayed on the Grape Guide page. The original data in `grapes.json` remains unchanged.

## How to Control Essential Status

To remove a grape from the "Essential" list or add one:

1. Open `/app/data/grape-overrides.json`
2. Add or edit entries in the `essential_overrides` object
3. Use the grape's ID (from grapes.json) as the key, and `true` or `false` as the value
   - `false` = Remove from Essential list
   - `true` = Add to Essential list

### Finding a Grape's ID

Grape IDs follow the pattern `grape_[lowercase-name]`. For example:
- Aglianico → `grape_aglianico`
- Cabernet Sauvignon → `grape_cabernet_sauvignon`
- Pinot Noir → `grape_pinot_noir`

You can also search in `/app/data/grapes.json` to find the exact ID.

### Example: Removing grapes from Essential

```json
{
  "essential_overrides": {
    "grape_aglianico": false,
    "grape_grenache": false,
    "grape_tempranillo": false
  }
}
```

This will remove Aglianico, Grenache, and Tempranillo from the Essential list, even if they're marked as essential in the original data.

### Example: Adding grapes to Essential

```json
{
  "essential_overrides": {
    "grape_pinotage": true,
    "grape_gruner_veltliner": true
  }
}
```

This will add Pinotage and Grüner Veltliner to the Essential list, even if they're not marked as essential in the original data.

## Complete Example

Here's a complete example of `/app/data/grape-overrides.json`:

```json
{
  "name_overrides": {
    "AGLIANICO": "Aglianico",
    "CABERNET SAUVIGNON": "Cabernet Sauvignon",
    "PINOT NOIR": "Pinot Noir",
    "CHARDONNAY": "Chardonnay"
  },
  "essential_overrides": {
    "grape_aglianico": false,
    "grape_grenache": false,
    "grape_pinotage": true,
    "grape_gruner_veltliner": true
  },
  "_instructions": {
    "name_overrides": "Maps original grape names (as they appear in grapes.json) to custom display names",
    "essential_overrides": "Maps grape IDs to boolean values. Set to false to remove from Essential list, true to add to Essential list"
  }
}
```

## How It Works

The system uses a utility function (`/app/utils/grapeOverrides.ts`) that:
1. Loads the main grape data from `grapes.json`
2. Applies your customizations from `grape-overrides.json`
3. Recalculates the essential grapes count
4. Returns the modified data to the Grape Guide page

The original `grapes.json` file is never modified, so you can always revert changes by editing or clearing the overrides file.

## Testing Your Changes

After editing `/app/data/grape-overrides.json`:

1. Save the file
2. Rebuild the site: `npm run build`
3. Check the Grape Guide page to see your changes

## Notes

- Changes only affect the display in the Grape Guide
- The original data in `grapes.json` is never modified
- The Essential count updates automatically based on your overrides
- You can remove all overrides by clearing the `name_overrides` and `essential_overrides` objects (but keep the structure)

## Current Status

- **Total Grapes**: 218
- **Original Essential Grapes**: 80
- **Modified Essential Count**: Will update based on your overrides
