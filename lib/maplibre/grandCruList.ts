/**
 * Grand Cru appellations — identified by exact name match.
 * These get special visual treatment (hatching overlay, gold borders/labels).
 *
 * Note: Village appellations (Gevrey-Chambertin, Vosne-Romanée, etc.)
 * are NOT Grand Crus — they are commune-level AOCs that contain Grand Cru vineyards.
 */
const GRAND_CRU_NAMES = new Set([
  // Burgundy — Côte de Nuits
  'Chambertin',
  'Chambertin-Clos de Bèze',
  'Chapelle-Chambertin',
  'Charmes-Chambertin',
  'Griotte-Chambertin',
  'Latricières-Chambertin',
  'Mazis-Chambertin',
  'Mazoyères-Chambertin',
  'Ruchottes-Chambertin',
  'Clos de la Roche',
  'Clos Saint-Denis',
  'Clos de Tart',
  'Clos des Lambrays',
  'Musigny',
  'Bonnes-Mares',
  'Clos de Vougeot / Clos Vougeot',
  'Vougeot', // Clos de Vougeot alternate
  'Romanée-Conti',
  'Romanée-Saint-Vivant',
  'Richebourg',
  'La Romanée',
  'La Tâche',
  'La Grande Rue',
  'Echezeaux',
  'Grands-Echezeaux',

  // Burgundy — Côte de Beaune
  'Corton',
  'Corton-Charlemagne',
  'Charlemagne',
  'Montrachet',
  'Chevalier-Montrachet',
  'Bâtard-Montrachet',
  'Bienvenues-Bâtard-Montrachet',
  'Criots-Bâtard-Montrachet',

  // Burgundy — Chablis
  'Chablis grand cru',

  // Champagne — Grand Cru villages
  'Ambonnay',
  'Beaumont-sur-Vesle',
  'Bouzy',
  'Louvois',
  'Mailly-Champagne',
  'Puisieulx',
  'Sillery',
  'Verzenay',
  'Verzy',
  'Aÿ-Champagne',
  'Tours-sur-Marne',
  'Avize',
  'Chouilly',
  'Cramant',
  'Le Mesnil-sur-Oger',
  'Oger',
  'Oiry',
]);

/**
 * Check if a feature name is a Grand Cru.
 * Also matches Alsace Grand Cru entries (pattern-based).
 */
export function isGrandCru(name) {
  if (GRAND_CRU_NAMES.has(name)) return true;
  // Alsace grand cru entries follow the pattern "Alsace grand cru <name>"
  if (name.toLowerCase().startsWith('alsace grand cru')) return true;
  return false;
}
