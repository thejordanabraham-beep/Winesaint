/**
 * Austria Wine Region Hierarchy
 * Groups 24 PDOs into 4 Bundesländer.
 * Generic DACs under their federal state.
 */

export const AUSTRIA_SUBREGIONS = {
  'Niederösterreich': [],
  'Burgenland': [],
  'Steiermark': [],
  'Wien & Other': [],
};

export const AUSTRIA_REGIONS = Object.keys(AUSTRIA_SUBREGIONS);

export const AUSTRIA_APPELLATIONS = {
  // Niederösterreich (Lower Austria) — DACs and generic
  'Niederösterreich': 'Niederösterreich',
  'Wachau': 'Niederösterreich',
  'Kremstal': 'Niederösterreich',
  'Kamptal': 'Niederösterreich',
  'Traisental': 'Niederösterreich',
  'Wagram': 'Niederösterreich',
  'Weinviertel': 'Niederösterreich',
  'Carnuntum': 'Niederösterreich',
  'Thermenregion': 'Niederösterreich',

  // Burgenland — DACs and generic
  'Burgenland': 'Burgenland',
  'Neusiedlersee': 'Burgenland',
  'Leithaberg': 'Burgenland',
  'Mittelburgenland': 'Burgenland',
  'Eisenberg': 'Burgenland',

  // Steiermark (Styria) — DACs and generic
  'Steiermark': 'Steiermark',
  'Südsteiermark': 'Steiermark',
  'Weststeiermark': 'Steiermark',
  'Süd-Oststeiermark': 'Steiermark',

  // Wien and small/other Bundesländer
  'Wien': 'Wien & Other',
  'Kärnten': 'Wien & Other',
  'Oberösterreich': 'Wien & Other',
  'Salzburg': 'Wien & Other',
  'Tirol': 'Wien & Other',
  'Vorarlberg': 'Wien & Other',
};
