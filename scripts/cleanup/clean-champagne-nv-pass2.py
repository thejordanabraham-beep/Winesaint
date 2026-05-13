import openpyxl
import re

SRC = '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW_CLEANED.xlsx'
SHEET = 'France - Champagne'


def main():
    wb = openpyxl.load_workbook(SRC)
    ws = wb[SHEET]

    stats = {
        'dir1_flipped': 0,
        'dir2_based_on': 0,
        'dir2_disgorged': 0,
    }

    for row_idx, row in enumerate(ws.iter_rows(min_row=2), start=2):
        if row[0].value is None:
            continue

        name_cell = row[1]
        vintage_cell = row[2]
        notes_cell = row[9]

        vintage = str(vintage_cell.value).strip() if vintage_cell.value else ''
        name = str(name_cell.value) if name_cell.value else ''
        notes = str(notes_cell.value) if notes_cell.value else ''

        # ── DIRECTION 1 ──
        # Numeric vintage but notes say NV → flip to NV, add base year to name
        if re.match(r'^\d{4}$', vintage):
            has_nv = bool(re.search(r'\bNV\b', notes))
            if has_nv:
                year = vintage
                # Don't double-add if name already ends with Base/Disgorged
                if not re.search(r'- \d{4} Base$', name) and not re.search(r'- Disgorged \d{4}$', name):
                    new_name = f'{name} - {year} Base'
                    old_display = name
                    name_cell.value = new_name
                    vintage_cell.value = 'NV'
                    stats['dir1_flipped'] += 1
                    print(f'  [DIR1 flip] row {row_idx}: Vintage {year}→NV | "{old_display}" → "{new_name}"')
                continue

        # ── DIRECTION 2 ──
        # Unchanged NV wines — check notes for "based on YYYY" or "disgorged YYYY"
        if vintage.upper() != 'NV':
            continue

        # Skip wines already processed (name ends with Base or Disgorged)
        if re.search(r'- \d{4} Base$', name) or re.search(r'- Disgorged \d{4}$', name):
            continue

        if not notes:
            continue

        # Check "based on (the) YYYY" pattern first
        m = re.search(r'based on (?:the )?(\d{4})', notes, re.IGNORECASE)
        if m:
            year = m.group(1)
            new_name = f'{name} - {year} Base'
            name_cell.value = new_name
            stats['dir2_based_on'] += 1
            print(f'  [DIR2 based] row {row_idx}: "{name}" → "{new_name}"')
            continue

        # Check "base vintage is YYYY" / "YYYY base" in notes
        m = re.search(r'(\d{4})\s*base\s*(?:vintage|wine|year)', notes, re.IGNORECASE)
        if not m:
            m = re.search(r'base\s*(?:vintage|year)?\s*(?:is\s*)?(\d{4})', notes, re.IGNORECASE)
        if m:
            year = m.group(1)
            new_name = f'{name} - {year} Base'
            name_cell.value = new_name
            stats['dir2_based_on'] += 1
            print(f'  [DIR2 based] row {row_idx}: "{name}" → "{new_name}"')
            continue

        # Check disgorgement patterns
        m = re.search(r'[Dd]isgorge(?:d|ment)\s*(?:in\s*)?(?:(?:January|February|March|April|May|June|July|August|September|October|November|December)\s*)?(\d{4})', notes)
        if m:
            year = m.group(1)
            new_name = f'{name} - Disgorged {year}'
            name_cell.value = new_name
            stats['dir2_disgorged'] += 1
            print(f'  [DIR2 disg] row {row_idx}: "{name}" → "{new_name}"')
            continue

    wb.save(SRC)

    print(f'\n=== PASS 2 SUMMARY ===')
    print(f'Direction 1 — vintage flipped to NV + base added: {stats["dir1_flipped"]}')
    print(f'Direction 2 — "based on" base year added:         {stats["dir2_based_on"]}')
    print(f'Direction 2 — disgorgement date added:            {stats["dir2_disgorged"]}')
    total = sum(stats.values())
    print(f'Total wines updated: {total}')


if __name__ == '__main__':
    main()
