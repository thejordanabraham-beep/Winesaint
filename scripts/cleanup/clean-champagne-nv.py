import openpyxl
import re

SRC = '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW_CLEANED.xlsx'
SHEET = 'France - Champagne'

# Champagne-specific broken words (found during NV scan)
BROKEN_WORDS_CHAMP = {
    'Ga rennes': 'Garennes',
    'Agra part': 'Agrapart',
    'Lamb lot': 'Lamblot',
    'Char to gne': 'Chartogne',
    'Or ize aux': 'Orizeaux',
    'Cou ar res': 'Couarres',
    'Amb on nay': 'Ambonnay',
    'An selme': 'Anselme',
    'Jacques son': 'Jacquesson',
    'Jan vry': 'Janvry',
    'Mou vance': 'Mouvance',
    'so ars': 'soars',
    'so urced': 'sourced',
    'to pnote': 'top note',
    'to pnotes': 'top notes',
    'br ioc he': 'brioche',
    'in ess': 'iness',
    'oak in ess': 'oakiness',
    'LesCarelles': 'Les Carelles',
    'deChâlons': 'de Châlons',
    'facetof': 'facet of',
    'goingto': 'going to',
}


def fix_stuck_name(name):
    """Fix missing spaces before parentheses in wine names."""
    # Fix word( → word (
    name = re.sub(r'([A-Za-zéèêëàâîïôùûüç])\(', r'\1 (', name)
    return name


def extract_and_reformat_nv(name, notes):
    """
    For NV wines, extract base vintage from name or notes.
    Returns (new_name, category) or (None, None) if no year found.
    """
    # Fix stuck names first
    name = fix_stuck_name(name)

    # 1. Disgorgement: (dis. YYYY)
    m = re.search(r'\s*\(dis\.\s*(\d{4})\)', name, re.IGNORECASE)
    if m:
        year = m.group(1)
        clean = name[:m.start()] + name[m.end():]
        clean = clean.strip()
        return f'{clean} - Disgorged {year}', 'disgorgement'

    # 2. Base year forward: (base YYYY)
    m = re.search(r'\s*\(base\s*(\d{4})\)', name, re.IGNORECASE)
    if m:
        year = m.group(1)
        clean = name[:m.start()] + name[m.end():]
        clean = clean.strip()
        return f'{clean} - {year} Base', 'base_fwd'

    # 3. Base year reversed: (YYYY base)
    m = re.search(r'\s*\((\d{4})\s*base\)', name, re.IGNORECASE)
    if m:
        year = m.group(1)
        clean = name[:m.start()] + name[m.end():]
        clean = clean.strip()
        return f'{clean} - {year} Base', 'base_rev'

    # 4. Year suffix: (YYYYx) where x is a letter
    m = re.search(r'\s*\((\d{4})[A-Za-z]\)', name)
    if m:
        year = m.group(1)
        clean = name[:m.start()] + name[m.end():]
        clean = clean.strip()
        return f'{clean} - {year} Base', 'year_suffix'

    # 5. Plain year in parens: (YYYY)
    m = re.search(r'\s*\((\d{4})\)', name)
    if m:
        year = m.group(1)
        clean = name[:m.start()] + name[m.end():]
        clean = clean.strip()
        return f'{clean} - {year} Base', 'parens_year'

    # 6. Year in notes only: NV (YYYY) or NV(YYYY)
    if notes:
        m = re.search(r'NV\s*\((\d{4})\)', notes)
        if m:
            year = m.group(1)
            return f'{name} - {year} Base', 'notes_year'

    return None, None


def main():
    wb = openpyxl.load_workbook(SRC)
    ws = wb[SHEET]

    stats = {
        'parens_year': 0,
        'base_fwd': 0,
        'base_rev': 0,
        'year_suffix': 0,
        'disgorgement': 0,
        'notes_year': 0,
        'broken_words_name': 0,
        'broken_words_notes': 0,
        'unchanged_nv': 0,
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

        # Fix broken words in names (all rows, not just NV)
        if name_cell.value:
            old_name = name
            for broken, fixed in BROKEN_WORDS_CHAMP.items():
                name = name.replace(broken, fixed)
            name = re.sub(r'\s{2,}', ' ', name).strip()
            if name != old_name:
                name_cell.value = name
                stats['broken_words_name'] += 1

        # Fix broken words in notes (all rows, not just NV)
        if notes_cell.value:
            old_notes = notes
            for broken, fixed in BROKEN_WORDS_CHAMP.items():
                notes = notes.replace(broken, fixed)
            notes = re.sub(r'\s{2,}', ' ', notes).strip()
            if notes != old_notes:
                notes_cell.value = notes
                stats['broken_words_notes'] += 1

        # NV vintage extraction
        if vintage.upper() == 'NV':
            current_name = str(name_cell.value) if name_cell.value else ''
            current_notes = str(notes_cell.value) if notes_cell.value else ''

            new_name, category = extract_and_reformat_nv(current_name, current_notes)

            if new_name and category:
                old_display = str(name_cell.value)
                name_cell.value = new_name
                stats[category] += 1
                print(f'  [{category}] row {row_idx}: "{old_display}" → "{new_name}"')
            else:
                stats['unchanged_nv'] += 1

    wb.save(SRC)

    print(f'\n=== CHAMPAGNE NV CLEANUP SUMMARY ===')
    print(f'Parens year (YYYY):      {stats["parens_year"]}')
    print(f'Base year forward:       {stats["base_fwd"]}')
    print(f'Base year reversed:      {stats["base_rev"]}')
    print(f'Year suffix (YYYYx):     {stats["year_suffix"]}')
    print(f'Disgorgement:            {stats["disgorgement"]}')
    print(f'Notes-only year:         {stats["notes_year"]}')
    print(f'Broken words in names:   {stats["broken_words_name"]}')
    print(f'Broken words in notes:   {stats["broken_words_notes"]}')
    print(f'Unchanged NV:            {stats["unchanged_nv"]}')
    total_extracted = sum(stats[k] for k in ['parens_year', 'base_fwd', 'base_rev', 'year_suffix', 'disgorgement', 'notes_year'])
    print(f'Total vintages extracted: {total_extracted}')


if __name__ == '__main__':
    main()
