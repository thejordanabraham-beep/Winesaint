import openpyxl
import re

SRC = '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW_CLEANED.xlsx'
DST = '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW_CLEANED.xlsx'
SHEET = 'France - Other'

# Broken word replacements — longer patterns first
BROKEN_WORDS_3 = {
    # Multi-part fragments
    'zest in ess': 'zestiness',
    'Zest in ess': 'Zestiness',
    'tang in ess': 'tanginess',
    'chalk in ess': 'chalkiness',
    'fruit in ess': 'fruitiness',
    'pet rich or': 'petrichor',
    'Stein grub ler': 'Steingrubler',
    're montage': 'remontage',
    'in tertwined': 'intertwined',
    'not ions': 'notions',
    'of fering': 'offering',
    'of fered': 'offered',
    'of fers': 'offers',
    'of fera': 'offer a',
    'to taled': 'totaled',
    'to nes': 'tones',
    'to ned': 'toned',
    # Stuck-together words (missing spaces)
    'aparcel': 'a parcel',
    'WineckSchlossberg': 'Wineck-Schlossberg',
    'clean-cutbut': 'clean-cut but',
    'tell-talechamomile': 'tell-tale chamomile',
}

def fix_text(text):
    if not text:
        return text

    # 1. Fix broken words
    for broken, fixed in BROKEN_WORDS_3.items():
        text = text.replace(broken, fixed)

    # 2. Fix missing space after period before capital letter
    # But preserve abbreviations like "St.", "Ste.", "Mt.", "Dr.", etc.
    text = re.sub(r'(?<![A-Z])\.([A-Z])', r'. \1', text)

    # 3. Fix missing space after comma before letter
    text = re.sub(r',([A-Za-z])', r', \1', text)

    # 4. Clean up double/triple spaces
    text = re.sub(r'\s{2,}', ' ', text).strip()

    return text

def main():
    wb = openpyxl.load_workbook(SRC)
    ws = wb[SHEET]

    notes_fixed = 0
    names_fixed = 0

    for row_idx, row in enumerate(ws.iter_rows(min_row=2), start=2):
        name_cell = row[1]
        notes_cell = row[9]

        if row[0].value is None:
            continue

        # Fix wine names
        if name_cell.value:
            old = str(name_cell.value)
            new = old
            for broken, fixed in BROKEN_WORDS_3.items():
                new = new.replace(broken, fixed)
            new = re.sub(r'\s{2,}', ' ', new).strip()
            if new != old:
                name_cell.value = new
                names_fixed += 1
                print(f"  Name row {row_idx}: \"{old}\" → \"{new}\"")

        # Fix tasting notes
        if notes_cell.value:
            old = str(notes_cell.value)
            new = fix_text(old)
            if new != old:
                notes_cell.value = new
                notes_fixed += 1

    wb.save(DST)
    print(f"\n=== PASS 3 SUMMARY ===")
    print(f"Wine names fixed: {names_fixed}")
    print(f"Tasting notes fixed: {notes_fixed}")

if __name__ == '__main__':
    main()
