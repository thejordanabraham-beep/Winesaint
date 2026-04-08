/**
 * Cyprus Wine Region Hierarchy
 * Maps all 7 Cypriot PDOs into 3 regions.
 */

export const CYPRUS_SUBREGIONS = {
  'Limassol': [],
  'Paphos': [],
  'Troodos Mountains': [],
};

export const CYPRUS_REGIONS = Object.keys(CYPRUS_SUBREGIONS);

export const CYPRUS_APPELLATIONS = {
  // Limassol
  'Κουμανδαρία': 'Limassol',
  'Κρασοχώρια Λεμεσού': 'Limassol',
  'Κρασοχώρια Λεμεσού - Αφάμης': 'Limassol',
  'Κρασοχώρια Λεμεσού - Λαόνα': 'Limassol',

  // Paphos
  'Λαόνα Ακάμα': 'Paphos',
  'Βουνί Παναγιάς – Αμπελίτης': 'Paphos',

  // Troodos Mountains
  'Πιτσιλιά': 'Troodos Mountains',
};
