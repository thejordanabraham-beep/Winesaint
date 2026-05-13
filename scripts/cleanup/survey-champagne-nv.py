import openpyxl
import re

SRC = '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW_CLEANED.xlsx'
SHEET = 'France - Champagne'

def main():
    wb = openpyxl.load_workbook(SRC, read_only=True)
    ws = wb[SHEET]

    categories = {
        'year_suffix': [],
        'base_year': [],
        'parens_year': [],
        'vintage_range': [],
        'disgorgement': [],
        'notes_year': [],
        'truly_nv': [],
    }

    for row_idx, row in enumerate(ws.iter_rows(min_row=2), start=2):
        vintage_val = row[2].value  # col C
        if vintage_val is None:
            continue
        vintage_str = str(vintage_val).strip()
        if vintage_str.upper() != 'NV':
            continue

        producer = str(row[0].value) if row[0].value else ''
        name = str(row[1].value) if row[1].value else ''
        notes = str(row[9].value) if row[9].value else ''

        # Check patterns in order of specificity
        # 1. Year suffix: (2022B), (2019B), (2011R) etc.
        m_suffix = re.search(r'\((\d{4})[A-Za-z]+\)', name)
        if m_suffix:
            categories['year_suffix'].append((row_idx, producer, name, m_suffix.group(1), m_suffix.group(0)))
            continue

        # 2. Base year: (base 2014), (Base 2018) etc.
        m_base = re.search(r'\((?:b|B)ase\s+(\d{4})\)', name)
        if m_base:
            categories['base_year'].append((row_idx, producer, name, m_base.group(1)))
            continue

        # 3. Disgorgement: (dis. 2012), (disgorgement 2020) etc.
        m_dis = re.search(r'\((?:dis\.?|disgorgement)\s*(\d{4})\)', name, re.IGNORECASE)
        if m_dis:
            categories['disgorgement'].append((row_idx, producer, name, m_dis.group(1)))
            continue

        # 4. Vintage range: 13-21, 2013-2021, etc.
        m_range = re.search(r'(\d{2,4})\s*[-–]\s*(\d{2,4})', name)
        if m_range:
            categories['vintage_range'].append((row_idx, producer, name, m_range.group(0)))
            continue

        # 5. Parens year: (2018), (2019) — plain 4-digit year in parens
        m_parens = re.search(r'\((\d{4})\)', name)
        if m_parens:
            categories['parens_year'].append((row_idx, producer, name, m_parens.group(1)))
            continue

        # 6. Notes year: NV (YYYY) or NV(YYYY) in tasting notes
        m_notes = re.search(r'NV\s*\(?(\d{4})\)?', notes)
        if m_notes:
            categories['notes_year'].append((row_idx, producer, name, m_notes.group(1), notes[:120]))
            continue

        # 7. Truly NV
        categories['truly_nv'].append((row_idx, producer, name, notes[:200]))

    wb.close()

    # === SUMMARY ===
    total = sum(len(v) for v in categories.values())
    print(f"=== NV WINE SURVEY: {total} total NV wines ===\n")
    for cat, items in categories.items():
        print(f"  {cat}: {len(items)}")
    print()

    # === PARENS YEAR ===
    print(f"\n{'='*80}")
    print(f"PARENS_YEAR — {len(categories['parens_year'])} wines with (YYYY) in name")
    print(f"{'='*80}")
    for entry in categories['parens_year']:
        row_idx, producer, name, year = entry
        print(f"  Row {row_idx:4d} | {producer:30s} | {name:60s} | year={year}")

    # === BASE YEAR ===
    print(f"\n{'='*80}")
    print(f"BASE_YEAR — {len(categories['base_year'])} wines with (base YYYY) in name")
    print(f"{'='*80}")
    for entry in categories['base_year']:
        row_idx, producer, name, year = entry
        print(f"  Row {row_idx:4d} | {producer:30s} | {name:60s} | year={year}")

    # === YEAR SUFFIX ===
    print(f"\n{'='*80}")
    print(f"YEAR_SUFFIX — {len(categories['year_suffix'])} wines with (YYYYx) in name")
    print(f"{'='*80}")
    for entry in categories['year_suffix']:
        row_idx, producer, name, year, full_match = entry
        print(f"  Row {row_idx:4d} | {producer:30s} | {name:60s} | year={year} match={full_match}")

    # === VINTAGE RANGE ===
    print(f"\n{'='*80}")
    print(f"VINTAGE_RANGE — {len(categories['vintage_range'])} wines with year range in name")
    print(f"{'='*80}")
    for entry in categories['vintage_range']:
        row_idx, producer, name, range_str = entry
        print(f"  Row {row_idx:4d} | {producer:30s} | {name:60s} | range={range_str}")

    # === DISGORGEMENT ===
    print(f"\n{'='*80}")
    print(f"DISGORGEMENT — {len(categories['disgorgement'])} wines with disgorgement date in name")
    print(f"{'='*80}")
    for entry in categories['disgorgement']:
        row_idx, producer, name, year = entry
        print(f"  Row {row_idx:4d} | {producer:30s} | {name:60s} | year={year}")

    # === NOTES YEAR ===
    print(f"\n{'='*80}")
    print(f"NOTES_YEAR — {len(categories['notes_year'])} wines with year in tasting notes only")
    print(f"{'='*80}")
    for entry in categories['notes_year']:
        row_idx, producer, name, year, notes_preview = entry
        print(f"  Row {row_idx:4d} | {producer:30s} | {name:60s} | year={year}")
        print(f"           notes: {notes_preview}...")

    # === TRULY NV ===
    print(f"\n{'='*80}")
    print(f"TRULY_NV — {len(categories['truly_nv'])} wines with no year found anywhere")
    print(f"{'='*80}")
    truly_nv_with_year_in_notes = []
    for entry in categories['truly_nv']:
        row_idx, producer, name, notes_preview = entry
        # Check if any year 2000-2026 appears in the notes
        years_in_notes = re.findall(r'\b(20[0-2]\d)\b', notes_preview)
        has_year = bool(years_in_notes)
        marker = " *** HAS YEAR IN NOTES ***" if has_year else ""
        print(f"  Row {row_idx:4d} | {producer:30s} | {name:60s}{marker}")
        if has_year:
            truly_nv_with_year_in_notes.append((row_idx, producer, name, years_in_notes, notes_preview))

    if truly_nv_with_year_in_notes:
        print(f"\n{'='*80}")
        print(f"TRULY_NV WITH YEAR IN NOTES — {len(truly_nv_with_year_in_notes)} wines")
        print(f"{'='*80}")
        for row_idx, producer, name, years, notes_preview in truly_nv_with_year_in_notes:
            print(f"  Row {row_idx:4d} | {producer:30s} | {name:60s}")
            print(f"           years found: {years}")
            print(f"           notes: {notes_preview}")

if __name__ == '__main__':
    main()
