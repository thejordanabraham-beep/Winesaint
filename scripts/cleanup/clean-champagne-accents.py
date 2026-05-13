import openpyxl
import re

SRC = '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW_CLEANED.xlsx'
SHEET = 'France - Champagne'

# Accent fixes: unaccented → proper French
# Order matters: longer/more specific patterns first
ACCENT_FIXES = {
    # Multi-word patterns (most specific first)
    'Spécial Club Millesime': 'Spécial Club Millésimé',
    'Special Club Millesime': 'Spécial Club Millésimé',
    'Special Club Millésimé': 'Spécial Club Millésimé',
    'Special Club': 'Spécial Club',
    'Vieilles Vignes Francaises': 'Vieilles Vignes Françaises',
    'Blanc Des Millenaires': 'Blanc des Millénaires',
    'Blanc des Millenaires': 'Blanc des Millénaires',
    'Dom Perignon Rose': 'Dom Pérignon Rosé',
    'Dom Perignon': 'Dom Pérignon',
    'Coeur de Cuvee': 'Coeur de Cuvée',
    'Ivoire Et Ebene': 'Ivoire et Ébène',
    'Ivoire et Ebène': 'Ivoire et Ébène',
    'La Grande Annee': 'La Grande Année',
    'Brut Grand Millesime': 'Brut Grand Millésime',
    "Vignes D'Autrefois": "Vignes d'Autrefois",
    'Cuvee Noire Reserve': 'Cuvée Noire Réserve',
    'Rose Tradition': 'Rosé Tradition',
    'Rose de Saignee': 'Rosé de Saignée',
    'Rosé de Saignee': 'Rosé de Saignée',
    'Rose de Saignée': 'Rosé de Saignée',
    'Rose de Saigné ': 'Rosé de Saigné ',
    "Blanc de Blancs D'Ay": "Blanc de Blancs d'Ay",
    'Les Cotes Chéries': 'Les Côtes Chéries',
    'Cumieres Premier Cru': 'Cumières Premier Cru',
    'Cumieres': 'Cumières',
    'Les Chenes': 'Les Chênes',
    'Les Coupes Franc': 'Les Coupés Franc',
    'Or Perpetuelle': 'Or Perpétuelle',
    "Le Mesnil Sur Oger": "Le Mesnil sur Oger",
    # Single word fixes (applied after multi-word)
    'Cuvee Volupte': 'Cuvée Volupté',
    'Cuvée Volupte': 'Cuvée Volupté',
    'Cuvee Orizeaux': 'Cuvée Orizeaux',
    'Cuvee Les Barres': 'Cuvée Les Barres',
    'Cuvee Les Alliees': 'Cuvée Les Alliées',
    'Cuvee 736': 'Cuvée 736',
    'Cuvee Gastronome': 'Cuvée Gastronome',
    # Millésime as standalone (after multi-word patterns consumed)
    'Brut Millesime': 'Brut Millésime',
    'Millesime Grand Cru': 'Millésime Grand Cru',
    'Millésime Grand Cru': 'Millésime Grand Cru',
    'Grand Cru Millesime': 'Grand Cru Millésime',
    'Premier Cru Millésimé': 'Premier Cru Millésime',
    # Rosé standalone (careful: only in wine-style context)
    'Brut Rose ': 'Brut Rosé ',
    'Brut Rose\n': 'Brut Rosé\n',
    'Extra Brut Rose ': 'Extra Brut Rosé ',
    'Extra Brut Rosé Nature Expression': 'Extra Brut Rosé Nature Expression',
    "Blanc de Blancs Grand Cru Mineral": "Blanc de Blancs Grand Cru Minéral",
    # l'Avizoise capitalization
    "Grand Cru l'Avizoise": "Grand Cru L'Avizoise",
}

# Specific row fixes for one-off issues
ROW_FIXES = {
    # "Extra Brut L'Annee=" → "Extra Brut L'Année"
    1514: ("L'Annee=", "L'Année"),
    # "Extra Brut L'Annee" → "Extra Brut L'Année"
    1513: ("L'Annee", "L'Année"),
    # "V.P," → "V.P."
    428: ("V.P,", "V.P."),
    # "VP (Viellissement" → "V.P. (Vieillissement" (typo fix too)
    417: ("VP (Viellissement Prolongé)", "V.P. (Vieillissement Prolongé)"),
}

# Apostrophe normalization: curly → straight
APOSTROPHE_FIXES = {
    "‘": "'",  # left single quote
    "’": "'",  # right single quote
}


def main():
    wb = openpyxl.load_workbook(SRC)
    ws = wb[SHEET]

    fixes = 0

    for row_idx, row in enumerate(ws.iter_rows(min_row=2), start=2):
        if row[0].value is None:
            continue

        name_cell = row[1]
        if not name_cell.value:
            continue

        old = str(name_cell.value)
        new = old

        # Row-specific fixes first
        if row_idx in ROW_FIXES:
            old_str, new_str = ROW_FIXES[row_idx]
            new = new.replace(old_str, new_str)

        # Apply accent fixes
        for wrong, right in ACCENT_FIXES.items():
            new = new.replace(wrong, right)

        # Normalize apostrophes
        for wrong, right in APOSTROPHE_FIXES.items():
            new = new.replace(wrong, right)

        # Fix Rosé at end of name (not followed by space)
        if new.endswith(' Rose'):
            new = new[:-4] + 'Rosé'

        # Clean trailing/double spaces
        new = re.sub(r'\s{2,}', ' ', new).strip()

        if new != old:
            name_cell.value = new
            fixes += 1
            print(f'  row {row_idx}: "{old}" → "{new}"')

    wb.save(SRC)
    print(f'\n=== ACCENT NORMALIZATION SUMMARY ===')
    print(f'Wine names fixed: {fixes}')


if __name__ == '__main__':
    main()
