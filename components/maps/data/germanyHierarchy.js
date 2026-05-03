/**
 * Germany Wine Region Hierarchy
 * Groups 6 Einzellagen under their parent Anbaugebiet.
 * The 13 main regions stay as top-level.
 */

export const GERMANY_SUBREGIONS = {
  'Ahr': [],
  'Baden': [],
  'Franken': [],
  'Hessische Bergstraße': [],
  'Mittelrhein': [],
  'Mosel': [],
  'Nahe': [],
  'Pfalz': [],
  'Rheingau': [],
  'Rheinhessen': [],
  'Saale-Unstrut': [],
  'Württemberg': [],
  'Sachsen': [],
};

export const GERMANY_REGIONS = Object.keys(GERMANY_SUBREGIONS);

export const GERMANY_APPELLATIONS = {
  // Mosel Einzellagen
  'Uhlen Blaufüsser Lay / Uhlen Blaufüßer Lay': 'Mosel',
  'Uhlen Laubach': 'Mosel',
  'Uhlen Roth Lay': 'Mosel',
  // Nahe Einzellage
  'Monzinger Niederberg': 'Nahe',
  // Franken Einzellagen
  'Würzburger Stein-Berg': 'Franken',
  'Bürgstadter Berg': 'Franken',
  // The 13 Anbaugebiete themselves (self-referencing as they are the regions)
  'Ahr': 'Ahr',
  'Baden': 'Baden',
  'Franken': 'Franken',
  'Hessische Bergstraße': 'Hessische Bergstraße',
  'Mittelrhein': 'Mittelrhein',
  'Mosel': 'Mosel',
  'Nahe': 'Nahe',
  'Pfalz': 'Pfalz',
  'Rheingau': 'Rheingau',
  'Rheinhessen': 'Rheinhessen',
  'Saale-Unstrut': 'Saale-Unstrut',
  'Württemberg': 'Württemberg',
  'Sachsen': 'Sachsen',
};
