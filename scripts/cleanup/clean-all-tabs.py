import openpyxl
import re

SRC = '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW_CLEANED.xlsx'

TABS_TO_CLEAN = [
    'California', 'Austria', 'Australia',
    'France - Bordeaux', 'France - Burgundy',
    'France - Loire', 'France - Rhone',
    'Germany', 'New Zealand', 'Oregon',
    'South Africa', 'Spain', 'Italy',
]

# ── Master broken word dictionary (from all France passes + new) ──
BROKEN_WORDS = {
    # Multi-fragment (longest first)
    'Gew urz tra miner': 'Gewurztraminer',
    'Sch lumber ger': 'Schlumberger',
    'Stein grub ler': 'Steingrubler',
    'Pf in gst berg': 'Pfingstberg',
    'Mu en ch berg': 'Muenchberg',
    'zest in ess': 'zestiness',
    'Zest in ess': 'Zestiness',
    'tang in ess': 'tanginess',
    'chalk in ess': 'chalkiness',
    'fruit in ess': 'fruitiness',
    'oak in ess': 'oakiness',
    'salt in ess': 'saltiness',
    'earth in ess': 'earthiness',
    'spic in ess': 'spiciness',
    'Furs ten tum': 'Furstentum',
    'pet rich or': 'petrichor',
    'gra uwa cke': 'grauwacke',
    'So nnenglanz': 'Sonnenglanz',
    'So mmerberg': 'Sommerberg',
    'Vend an ges': 'Vendanges',
    'Card in aux': 'Cardinaux',
    'Ball ester os': 'Ballesteros',
    'Cent en arias': 'Centenarias',
    'Cab ern et': 'Cabernet',
    # Two-part fragments
    'in tertwined': 'intertwined',
    'in tensifies': 'intensifies',
    'in tensify': 'intensify',
    'in tegrated': 'integrated',
    'in tegrate': 'integrate',
    'in cluding': 'including',
    'in terlaced': 'interlaced',
    'in terplay': 'interplay',
    're montage': 'remontage',
    'over tones': 'overtones',
    'over tone': 'overtone',
    'under stated': 'understated',
    'under brush': 'underbrush',
    'under lying': 'underlying',
    'under ripe': 'underripe',
    'under pinned': 'underpinned',
    'de stemmed': 'destemmed',
    'mouth feel': 'mouthfeel',
    'bo try tis': 'botrytis',
    'bo try': 'botry',
    'Mirabel le': 'Mirabelle',
    'mirabel le': 'mirabelle',
    'Tar dives': 'Tardives',
    'Winds buhl': 'Windsbuhl',
    'We in bach': 'Weinbach',
    'Bu ec her': 'Buecher',
    'Sc him berg': 'Schimberg',
    'Trim bach': 'Trimbach',
    'Foil lard': 'Foillard',
    'So edlen': 'Soedlen',
    'Mam bourg': 'Mambourg',
    'Sylvan er': 'Sylvaner',
    'Tis sot': 'Tissot',
    'Box ler': 'Boxler',
    'La pierre': 'Lapierre',
    'Domain es': 'Domaines',
    'Caracol es': 'Caracoles',
    'In terdit': 'Interdit',
    'Pierre ts': 'Pierrets',
    'An toine': 'Antoine',
    'An selme': 'Anselme',
    'An tica': 'Antica',
    'Jacques son': 'Jacquesson',
    'Ga rennes': 'Garennes',
    'Char to gne': 'Chartogne',
    'Or ize aux': 'Orizeaux',
    'Cou ar res': 'Couarres',
    'Amb on nay': 'Ambonnay',
    'Lamb lot': 'Lamblot',
    'Agra part': 'Agrapart',
    'Jan vry': 'Janvry',
    'Mou vance': 'Mouvance',
    'Art adi': 'Artadi',
    'Aunts field': 'Auntsfield',
    'Cart ology': 'Cartology',
    'to uches': 'touches',
    'to uchof': 'touch of',
    'to uching': 'touching',
    'to taled': 'totaled',
    'to nes': 'tones',
    'to ned': 'toned',
    'to pnote': 'top note',
    'to pnotes': 'top notes',
    'of fering': 'offering',
    'of fered': 'offered',
    'of fers': 'offers',
    'of fera': 'offer a',
    'not ions': 'notions',
    'so ils': 'soils',
    'so ars': 'soars',
    'so urced': 'sourced',
    'so aked': 'soaked',
    'br ioc he': 'brioche',
    'GrandCru': 'Grand Cru',
    # Stuck-together fixes
    'facetof': 'facet of',
    'goingto': 'going to',
    'keepa': 'keep a',
    'one-thirdin': 'one-third in',
    'LesCarelles': 'Les Carelles',
    'deChâlons': 'de Châlons',
    'WineckSchlossberg': 'Wineck-Schlossberg',
    'clean-cutbut': 'clean-cut but',
    'tell-talechamomile': 'tell-tale chamomile',
    'aparcel': 'a parcel',
    'fruitat': 'fruit at',
    'medium-bodied2022': 'medium-bodied 2022',
}

# ── Accent normalization (universal across tabs) ──
ACCENT_FIXES = {
    'Special Club': 'Spécial Club',
    'Vieilles Vignes Francaises': 'Vieilles Vignes Françaises',
    'La Grande Annee': 'La Grande Année',
    'Dom Perignon Rose': 'Dom Pérignon Rosé',
    'Dom Perignon': 'Dom Pérignon',
    'Coeur de Cuvee': 'Coeur de Cuvée',
    'Blanc des Millenaires': 'Blanc des Millénaires',
    'Blanc Des Millenaires': 'Blanc des Millénaires',
    'Brut Millesime': 'Brut Millésime',
    'Millesime Grand Cru': 'Millésime Grand Cru',
    'Grand Cru Millesime': 'Grand Cru Millésime',
    'Gruner Veltliner': 'Grüner Veltliner',
    'Rudesheimer': 'Rüdesheimer',
    'Spatburgunder': 'Spätburgunder',
    'Spatlese': 'Spätlese',
    'Gewurztraminer': 'Gewürztraminer',
    'Cuvee ': 'Cuvée ',
    'Cuvee,': 'Cuvée,',
    'Rose de Saignee': 'Rosé de Saignée',
    'Rosé de Saignee': 'Rosé de Saignée',
    'Rose de Saignée': 'Rosé de Saignée',
}

# Name junk pattern: pagination + date + time + producer + release price
NAME_JUNK_RE = re.compile(
    r'\s+\d{1,3}/\d{1,3}\d{1,2}/\d{1,2}/\d{2,4},\s*\d{1,2}:\d{2}\s*[AP]M.*$'
)
NAME_JUNK_FULL_RE = re.compile(
    r'^\d{1,3}/\d{1,3}\d{1,2}/\d{1,2}/\d{2,4},\s*\d{1,2}:\d{2}\s*[AP]M.*$'
)


def strip_producer_prefix(notes, producer):
    """Strip /ProducerName[Score] prefix from tasting notes."""
    if not notes or not notes.startswith('/'):
        return notes, None

    text = notes[1:]  # strip /
    score = None

    # Character-by-character match of producer name (ignoring spaces and case)
    prod_chars = [c.lower() for c in producer if c != ' ']
    text_idx = 0
    prod_idx = 0
    while prod_idx < len(prod_chars) and text_idx < len(text):
        if text[text_idx] == ' ':
            text_idx += 1
            continue
        if text[text_idx].lower() == prod_chars[prod_idx]:
            text_idx += 1
            prod_idx += 1
        else:
            break

    matched_ratio = prod_idx / len(prod_chars) if prod_chars else 0

    if matched_ratio >= 0.6:
        rest = text[text_idx:]
    else:
        rest = text

    # Find where actual review text starts
    review_re = (
        r'(?:(\d{2,3})\s*)?'
        r'(?=The\s+(?:\d{4}|NV)|Pale\s|Deep\s|Bright|Vivid|Light\s|Dark\s|'
        r'Rich\s|Lush|This\s|Hugely|Fragrant|Lively|Silky|Crushed|Subtle|'
        r'Elegant|Smoky|Intense|Opulent|Purple|Dense|Supple|Wiry|Medium|'
        r'Full[- ]|Ripe|From\s|Here\s|Broad|With\s|Based|Taut|Savory|Lovely|'
        r'Made\s|Crisp|Aging|Concentrated|Aromas|Sweet|Delicate|Expressive|'
        r'Brilliant|Terrific|Saturated|Scented|Brisk|Sharply|Deeply|Plummy|'
        r'Strikingly|Restrained|Complex|Mineral|Inviting|Alluring|Young|'
        r'Effusive|Musky|Pungent|Spicy|Floral|Exotic|Wild|Dried|Fresh|'
        r'Heady|Polished|Focused|Notes\s|Perfumed|Open|Closed|Firm|'
        r'A\s[a-z]|An\s[a-z]|\(\d|\(just|\(made|\(aged|\(a\s|\(only)'
    )

    m = re.search(review_re, rest)
    if m:
        if m.group(1):
            val = int(m.group(1))
            if 80 <= val <= 100:
                score = val
        rest = rest[m.end():]
        if rest.strip():
            return rest.strip(), score

    return notes, None


def fix_text(text):
    """Apply all text fixes to a string."""
    if not text:
        return text

    for broken, fixed in BROKEN_WORDS.items():
        text = text.replace(broken, fixed)

    # Missing space after period before capital (preserve abbreviations)
    text = re.sub(r'(?<![A-Z])\.([A-Z])', r'. \1', text)

    # Missing space after comma before letter
    text = re.sub(r',([A-Za-z])', r', \1', text)

    # Word-number stuck (lowercase letter before 3-4 digit number)
    text = re.sub(r'([a-z])(\d{3,4})(?=\s|[,.\-]|$)', r'\1 \2', text)

    # "is100%" pattern
    text = re.sub(r'is(\d+%)', r'is \1', text)

    # "Read More" scraping artifacts
    text = re.sub(r'Read More\d{4}', '', text)
    text = re.sub(r'Readers\d{4}', '', text)

    # Clean double/triple spaces
    text = re.sub(r'\s{2,}', ' ', text).strip()

    return text


def fix_name(name):
    """Fix wine name issues."""
    if not name:
        return name, False

    original = name

    # Strip web scraping junk from name
    if NAME_JUNK_FULL_RE.match(name):
        return None, True  # entire name is junk — flag it
    name = NAME_JUNK_RE.sub('', name)

    # Apply broken word fixes to names too
    for broken, fixed in BROKEN_WORDS.items():
        name = name.replace(broken, fixed)

    # Apply accent fixes
    for wrong, right in ACCENT_FIXES.items():
        name = name.replace(wrong, right)

    # Fix "Rosé" at end of name where it's "Rose"
    if name.endswith(' Rose') and 'Saignée' not in name:
        name = name[:-4] + 'Rosé'
    if 'Brut Rose ' in name:
        name = name.replace('Brut Rose ', 'Brut Rosé ')
    if 'Millesime Rose' in name:
        name = name.replace('Millesime Rose', 'Millésime Rosé')

    # Clean double spaces
    name = re.sub(r'\s{2,}', ' ', name).strip()

    return name, name != original


def main():
    wb = openpyxl.load_workbook(SRC)

    grand_total = {
        'name_junk': 0,
        'name_junk_full': 0,
        'name_fixed': 0,
        'prefix_stripped': 0,
        'score_extracted': 0,
        'notes_fixed': 0,
    }

    for tab in TABS_TO_CLEAN:
        ws = wb[tab]
        stats = {
            'name_junk': 0,
            'name_junk_full': 0,
            'name_fixed': 0,
            'prefix_stripped': 0,
            'score_extracted': 0,
            'notes_fixed': 0,
        }

        for row_idx, row in enumerate(ws.iter_rows(min_row=2), start=2):
            if row[0].value is None:
                continue

            producer = str(row[0].value) if row[0].value else ''
            name_cell = row[1]
            score_cell = row[3]
            notes_cell = row[9]

            # ── Fix wine name ──
            if name_cell.value:
                new_name, changed = fix_name(str(name_cell.value))
                if new_name is None:
                    stats['name_junk_full'] += 1
                    print(f'  [{tab}] row {row_idx}: FULL JUNK NAME: "{str(name_cell.value)[:80]}"')
                elif changed:
                    old = str(name_cell.value)
                    name_cell.value = new_name
                    if NAME_JUNK_RE.search(old):
                        stats['name_junk'] += 1
                    else:
                        stats['name_fixed'] += 1

            # ── Fix tasting notes ──
            if notes_cell.value:
                old_notes = str(notes_cell.value)
                new_notes = old_notes

                # Strip producer prefix
                cleaned, extracted_score = strip_producer_prefix(new_notes, producer)
                if cleaned != new_notes:
                    new_notes = cleaned
                    stats['prefix_stripped'] += 1
                    if extracted_score and score_cell.value:
                        existing_score = None
                        try:
                            existing_score = int(score_cell.value)
                        except (ValueError, TypeError):
                            pass
                        if existing_score and extracted_score != existing_score:
                            stats['score_extracted'] += 1
                            print(f'  [{tab}] row {row_idx}: SCORE MISMATCH: col={existing_score} extracted={extracted_score}')

                # Apply text fixes
                new_notes = fix_text(new_notes)

                if new_notes != old_notes:
                    notes_cell.value = new_notes
                    stats['notes_fixed'] += 1

        print(f'\n=== {tab} ===')
        print(f'  Name junk stripped:     {stats["name_junk"]}')
        print(f'  Full junk names:        {stats["name_junk_full"]}')
        print(f'  Names fixed (other):    {stats["name_fixed"]}')
        print(f'  Producer prefix stripped: {stats["prefix_stripped"]}')
        print(f'  Score mismatches:       {stats["score_extracted"]}')
        print(f'  Notes fixed:            {stats["notes_fixed"]}')

        for k in grand_total:
            grand_total[k] += stats[k]

    wb.save(SRC)

    print(f'\n{"="*50}')
    print(f'GRAND TOTAL ACROSS ALL {len(TABS_TO_CLEAN)} TABS')
    print(f'{"="*50}')
    for k, v in grand_total.items():
        print(f'  {k:25s}: {v}')


if __name__ == '__main__':
    main()
