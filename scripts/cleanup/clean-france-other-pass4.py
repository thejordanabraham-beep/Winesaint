import openpyxl
import re

SRC = '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW_CLEANED.xlsx'
DST = '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW_CLEANED.xlsx'
SHEET = 'France - Other'

# Specific stuck-together fixes
STUCK_FIXES = {
    'since1985': 'since 1985',
    'around400': 'around 400',
    'at400m': 'at 400m',
    'in240L': 'in 240L',
    'Tissot2022': 'Tissot 2022',
    'November2024': 'November 2024',
    'with100%': 'with 100%',
    'the105': 'the 105',
    'medium-bodied2022': 'medium-bodied 2022',
    'no2021': 'no 2021',
    'denotes2021': 'denotes 2021',
    'around260m': 'around 260m',
    'late1950s': 'late 1950s',
    'one-thirdin': 'one-third in',
    'keepa': 'keep a',
    'An toine': 'Antoine',
}

def main():
    wb = openpyxl.load_workbook(SRC)
    ws = wb[SHEET]

    fixes = 0
    for row_idx, row in enumerate(ws.iter_rows(min_row=2), start=2):
        notes_cell = row[9]
        if row[0].value is None or notes_cell.value is None:
            continue

        old = str(notes_cell.value)
        new = old

        for stuck, fixed in STUCK_FIXES.items():
            new = new.replace(stuck, fixed)

        # Generic: fix letter immediately stuck to 3-4 digit number
        # But only where it's clearly a word boundary (lowercase letter + digit)
        new = re.sub(r'([a-z])(\d{3,4})(?=\s|[,.])', r'\1 \2', new)

        if new != old:
            notes_cell.value = new
            fixes += 1

    wb.save(DST)
    print(f"Pass 4: {fixes} tasting notes fixed")

if __name__ == '__main__':
    main()
