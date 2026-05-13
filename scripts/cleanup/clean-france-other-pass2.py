import openpyxl
import re

SRC = '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW_CLEANED.xlsx'
DST = '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW_CLEANED.xlsx'
SHEET = 'France - Other'

# Second-pass broken word fixes (wine names + tasting notes)
BROKEN_WORDS_2 = {
    # Multi-fragment first (longer patterns before shorter)
    'Gew urz tra miner': 'Gewurztraminer',
    'Furs ten tum': 'Furstentum',
    'Furstemtum': 'Furstentum',  # typo
    'Mirabel le': 'Mirabelle',
    'mirabel le': 'mirabelle',
    'Tar dives': 'Tardives',
    'over tones': 'overtones',
    'over tone': 'overtone',
    'under stated': 'understated',
    'in cluding': 'including',
    'in tensifies': 'intensifies',
    'in tensify': 'intensify',
    'in tegrated': 'integrated',
    'in tegrate': 'integrate',
    'to uches': 'touches',
    'to uchof': 'touch of',
    'to uching': 'touching',
    'GrandCru': 'Grand Cru',
    # Stuck-together words (missing spaces)
    'fruitat': 'fruit at',
    'Altenbourgand': 'Altenbourg and',
    'Mambourg,just': 'Mambourg, just',
    '20%whole': '20% whole',
    'that,with': 'that, with',
    'deBergheim': 'de Bergheim',
}

# One-off text fixes
ROW_FIXES = {
    # "finish t," → "finish," (spurious 't')
    10: ('finish t, but', 'finish, but'),
}

def fix_broken_words(text):
    if not text:
        return text
    for broken, fixed in BROKEN_WORDS_2.items():
        text = text.replace(broken, fixed)
    return text

def main():
    wb = openpyxl.load_workbook(SRC)
    ws = wb[SHEET]

    name_fixes = 0
    notes_fixes = 0

    for row_idx, row in enumerate(ws.iter_rows(min_row=2), start=2):
        name_cell = row[1]   # B
        notes_cell = row[9]  # J

        if row[0].value is None:
            continue

        # Fix wine names
        if name_cell.value:
            old = str(name_cell.value)
            new = fix_broken_words(old)
            if new != old:
                name_cell.value = new
                name_fixes += 1
                print(f"  Name row {row_idx}: \"{old}\" → \"{new}\"")

        # Fix tasting notes
        if notes_cell.value:
            old = str(notes_cell.value)
            new = fix_broken_words(old)

            # Row-specific fixes
            if row_idx in ROW_FIXES:
                old_str, new_str = ROW_FIXES[row_idx]
                new = new.replace(old_str, new_str)

            # Clean double spaces
            new = re.sub(r'\s{2,}', ' ', new).strip()

            if new != old:
                notes_cell.value = new
                notes_fixes += 1

    wb.save(DST)
    print(f"\n=== PASS 2 SUMMARY ===")
    print(f"Wine names fixed: {name_fixes}")
    print(f"Tasting notes fixed: {notes_fixes}")

if __name__ == '__main__':
    main()
