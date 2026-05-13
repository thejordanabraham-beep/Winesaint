import openpyxl
import re
import copy

SRC = '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW_CLEANED.xlsx'
DST = '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW_CLEANED.xlsx'

SHEET = 'France - Other'

# Broken word replacements (apply to wine names AND tasting notes)
BROKEN_WORDS = {
    'Sch lumber ger': 'Schlumberger',
    'Pf in gst berg': 'Pfingstberg',
    'Mu en ch berg': 'Muenchberg',
    'gra uwa cke': 'grauwacke',
    'So nnenglanz': 'Sonnenglanz',
    'So mmerberg': 'Sommerberg',
    'Vend an ges': 'Vendanges',
    'Card in aux': 'Cardinaux',
    'Winds buhl': 'Windsbuhl',
    'bo try tis': 'botrytis',
    'de stemmed': 'destemmed',
    'We in bach': 'Weinbach',
    'Bu ec her': 'Buecher',
    'Sc him berg': 'Schimberg',
    'La pierre': 'Lapierre',
    'Domain es': 'Domaines',
    'Caracol es': 'Caracoles',
    'In terdit': 'Interdit',
    'Pierre ts': 'Pierrets',
    'Trim bach': 'Trimbach',
    'Foil lard': 'Foillard',
    'So edlen': 'Soedlen',
    'Mam bourg': 'Mambourg',
    'Sylvan er': 'Sylvaner',
    'Tis sot': 'Tissot',
    'Box ler': 'Boxler',
    'so ils': 'soils',
}

# Score corrections: row_number -> correct_score (extracted from tasting notes prefix)
SCORE_FIXES = {
    8: 95,
    33: 94,
    77: 93,
    87: 95,
    237: 92,
    243: 95,
    258: 94,
    435: 92,
    447: 94,
    606: 95,
    665: 92,
    677: 90,
    700: 95,
    714: 94,
    721: 95,
}

# Wine name fixes for web scraping garbage
NAME_FIXES = {
    205: 'Syrah Amour Interdit',
    468: 'Beaujolais-Villages Cuvée Marylou',
    496: 'Morgon Corcelette',
}

# Also fix "GrandCru" -> "Grand Cru" in wine names
# And "Vendanges Tardives" from broken form

def fix_broken_words(text):
    if not text:
        return text
    for broken, fixed in BROKEN_WORDS.items():
        text = text.replace(broken, fixed)
    return text

def strip_tasting_notes_prefix(text):
    """Remove /ProducerName[Score] prefix from tasting notes."""
    if not text or not text.startswith('/'):
        return text
    # Pattern: /ProducerName[optional spaces][optional 2-3 digit score][optional spaces]
    # Then the real content starts with "The", "This", "Using", "From", a color, etc.
    # First try to find where the real review starts
    starters = [
        'The ', 'This ', 'A ', 'An ', 'Using ', 'From ', 'Not ', 'All ',
        'Vinified', 'Ruby', 'Deep', 'Bright', 'Vivid', 'Gorgeous', 'Solid',
        'Ethereal', 'Expansive', 'Powerful', 'Pale', 'Dark', 'Intense',
        'Medium', 'Light', 'Young', 'Youthful', 'Here ', 'With ', 'Dense',
        'Saturated', 'Translucent', 'Ripe', 'Pure', 'Rich', 'Lovely',
        'Generous', 'Complex', 'Elegant', 'Delicate', 'Fresh', 'Brilliant',
        'Gorgeous', 'Subtle', '(this',
    ]

    # Remove the leading /
    text = text[1:]

    for starter in starters:
        idx = text.find(starter)
        if idx > 0 and idx < 120:  # prefix shouldn't be longer than ~100 chars
            return text[idx:]

    # Fallback: try regex to strip producer + optional score
    m = re.match(r'^[A-Za-zÀ-ÿ\s&\'\-\.éèêëàâäôùûüïîçœæ]+?\d{0,3}\s+', text)
    if m:
        return text[m.end():]

    return text

def main():
    wb = openpyxl.load_workbook(SRC)
    ws = wb[SHEET]

    stats = {
        'broken_words_fixed': 0,
        'prefixes_stripped': 0,
        'scores_fixed': 0,
        'names_fixed': 0,
        'grand_cru_fixed': 0,
    }

    for row_idx, row in enumerate(ws.iter_rows(min_row=2), start=2):
        producer_cell = row[0]   # A
        name_cell = row[1]       # B
        score_cell = row[3]      # D
        notes_cell = row[9]      # J

        if producer_cell.value is None:
            continue

        # 1. Fix wine names with web scraping garbage
        if row_idx in NAME_FIXES:
            old = name_cell.value
            name_cell.value = NAME_FIXES[row_idx]
            print(f"  Row {row_idx}: name \"{str(old)[:60]}...\" → \"{NAME_FIXES[row_idx]}\"")
            stats['names_fixed'] += 1

        # 2. Fix broken words in wine names
        if name_cell.value:
            old_name = str(name_cell.value)
            new_name = fix_broken_words(old_name)
            # Fix "GrandCru" -> "Grand Cru"
            new_name = new_name.replace('GrandCru', 'Grand Cru')
            if new_name != old_name:
                name_cell.value = new_name
                stats['broken_words_fixed'] += 1

        # 3. Fix scores
        if row_idx in SCORE_FIXES:
            old_score = score_cell.value
            score_cell.value = SCORE_FIXES[row_idx]
            print(f"  Row {row_idx}: score {old_score} → {SCORE_FIXES[row_idx]}")
            stats['scores_fixed'] += 1

        # 4. Strip tasting notes prefix and fix broken words
        if notes_cell.value:
            old_notes = str(notes_cell.value)
            new_notes = old_notes

            # Strip /ProducerName prefix
            if new_notes.startswith('/'):
                new_notes = strip_tasting_notes_prefix(new_notes)
                if new_notes != old_notes:
                    stats['prefixes_stripped'] += 1

            # Fix broken words in notes
            new_notes = fix_broken_words(new_notes)

            # Clean up double spaces
            new_notes = re.sub(r'\s{2,}', ' ', new_notes).strip()

            if new_notes != old_notes:
                notes_cell.value = new_notes

    # Save
    wb.save(DST)

    print(f"\n=== SUMMARY ===")
    print(f"Wine names fixed (scraping junk): {stats['names_fixed']}")
    print(f"Broken words fixed in names: {stats['broken_words_fixed']}")
    print(f"Scores corrected: {stats['scores_fixed']}")
    print(f"Tasting notes prefixes stripped: {stats['prefixes_stripped']}")
    print(f"Saved to: {DST}")

if __name__ == '__main__':
    main()
