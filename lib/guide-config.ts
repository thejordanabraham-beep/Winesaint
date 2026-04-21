/**
 * WINE REGION GUIDE CONFIGURATION
 *
 * Central source of truth for all wine region hierarchies, sidebar links, and metadata.
 * This file eliminates hard-coded sidebar links in page.tsx files.
 */

export type RegionLevel = 'country' | 'region' | 'sub-region' | 'village' | 'vineyard';

export type ClassificationType =
  | 'grand-cru'
  | 'premier-cru'
  | 'village'
  | 'regional'
  | 'mga'
  | 'einzellage'
  | 'grosses-gewachs'
  | 'erste-lage'
  | 'rieda'
  | 'single-vineyard'
  | '1er-cru-classe'
  | '2eme-cru-classe'
  | '3eme-cru-classe'
  | '4eme-cru-classe'
  | '5eme-cru-classe'
  | 'premier-grand-cru-classe-a'
  | 'premier-grand-cru-classe-b'
  | 'cru'
  | 'climat'
  | 'cru-communal';

export interface RegionConfig {
  slug: string;
  name: string;
  level: RegionLevel;
  parent?: string;
  classification?: ClassificationType;
  sanityRef?: string;
  subRegions?: RegionConfig[];
  sidebarLinks?: Array<{ name: string; slug: string; classification?: ClassificationType }>;
  guideFile?: string;
}

/**
 * Complete wine region hierarchy
 * Organized by country > region > sub-region
 */
export const REGION_HIERARCHY: RegionConfig[] = [
  // FRANCE
  {
    slug: 'france',
    name: 'France',
    level: 'country',
    guideFile: 'france-guide.md',
    sidebarLinks: [
      { name: 'Champagne', slug: 'champagne' },
      { name: 'Alsace', slug: 'alsace' },
      { name: 'Burgundy', slug: 'burgundy' },
      { name: 'Beaujolais', slug: 'beaujolais' },
      { name: 'Rhône Valley', slug: 'rhone-valley' },
      { name: 'Loire Valley', slug: 'loire-valley' },
      { name: 'Provence', slug: 'provence' },
      { name: 'Languedoc-Roussillon', slug: 'languedoc-roussillon' },
      { name: 'Bordeaux', slug: 'bordeaux' },
      { name: 'Jura', slug: 'jura' },
    ],
    subRegions: [
      {
        slug: 'champagne',
        name: 'Champagne',
        level: 'region',
        parent: 'france',
        guideFile: 'champagne-guide.md',
      },
      {
        slug: 'alsace',
        name: 'Alsace',
        level: 'region',
        parent: 'france',
        guideFile: 'alsace-guide.md',
      },
      {
        slug: 'burgundy',
        name: 'Burgundy',
        level: 'region',
        parent: 'france',
        guideFile: 'burgundy-guide.md',
        sidebarLinks: [
          { name: 'Chablis', slug: 'chablis' },
          { name: 'Côte de Nuits', slug: 'cote-de-nuits' },
          { name: 'Côte de Beaune', slug: 'cote-de-beaune' },
          { name: 'Côte Chalonnaise', slug: 'cote-chalonnaise' },
          { name: 'Mâconnais', slug: 'maconnais' },
          { name: 'Beaujolais', slug: 'beaujolais' },
        ],
        subRegions: [
          {
            slug: 'chablis',
            name: 'Chablis',
            level: 'sub-region',
            parent: 'burgundy',
            guideFile: 'chablis-guide.md',
          },
          {
            slug: 'cote-de-nuits',
            name: 'Côte de Nuits',
            level: 'sub-region',
            parent: 'burgundy',
            guideFile: 'cote-de-nuits-guide.md',
            sidebarLinks: [
              { name: 'Gevrey-Chambertin', slug: 'gevrey-chambertin' },
              { name: 'Morey-Saint-Denis', slug: 'morey-saint-denis' },
              { name: 'Chambolle-Musigny', slug: 'chambolle-musigny' },
              { name: 'Vougeot', slug: 'vougeot' },
              { name: 'Vosne-Romanée', slug: 'vosne-romanee' },
            ],
            subRegions: [
              {
                slug: 'gevrey-chambertin',
                name: 'Gevrey-Chambertin',
                level: 'village',
                parent: 'cote-de-nuits',
                guideFile: 'gevrey-chambertin-guide.md',
                sidebarLinks: [
                  { name: 'Chambertin', slug: 'chambertin', classification: 'grand-cru' },
                  { name: 'Chambertin-Clos de Bèze', slug: 'chambertin-clos-de-beze', classification: 'grand-cru' },
                  { name: 'Chapelle-Chambertin', slug: 'chapelle-chambertin', classification: 'grand-cru' },
                  { name: 'Charmes-Chambertin', slug: 'charmes-chambertin', classification: 'grand-cru' },
                  { name: 'Griotte-Chambertin', slug: 'griotte-chambertin', classification: 'grand-cru' },
                  { name: 'Latricières-Chambertin', slug: 'latricieres-chambertin', classification: 'grand-cru' },
                  { name: 'Mazis-Chambertin', slug: 'mazis-chambertin', classification: 'grand-cru' },
                  { name: 'Mazoyères-Chambertin', slug: 'mazoyeres-chambertin', classification: 'grand-cru' },
                  { name: 'Ruchottes-Chambertin', slug: 'ruchottes-chambertin', classification: 'grand-cru' },
                  { name: 'Clos Saint-Jacques', slug: 'clos-saint-jacques', classification: 'premier-cru' },
                  { name: 'Les Cazetiers', slug: 'les-cazetiers', classification: 'premier-cru' },
                  { name: 'Lavaux Saint-Jacques', slug: 'lavaux-saint-jacques', classification: 'premier-cru' },
                  { name: 'Les Combottes', slug: 'les-combottes', classification: 'premier-cru' },
                  { name: 'Aux Combottes', slug: 'aux-combottes', classification: 'premier-cru' },
                  { name: 'Estournelles Saint-Jacques', slug: 'estournelles-saint-jacques', classification: 'premier-cru' },
                  { name: 'Champeaux', slug: 'champeaux', classification: 'premier-cru' },
                  { name: 'La Petite Chapelle', slug: 'la-petite-chapelle', classification: 'premier-cru' },
                  { name: 'Poissenot', slug: 'poissenot', classification: 'premier-cru' },
                  { name: 'Fonteny', slug: 'fonteny', classification: 'premier-cru' },
                  { name: 'Les Goulots', slug: 'les-goulots', classification: 'premier-cru' },
                ],
                subRegions: [
                  {
                    slug: 'chambertin',
                    name: 'Chambertin',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'gevrey-chambertin',
                    guideFile: 'chambertin-vineyard-guide.md',
                  },
                  {
                    slug: 'chambertin-clos-de-beze',
                    name: 'Chambertin-Clos de Bèze',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'gevrey-chambertin',
                    guideFile: 'chambertin-clos-de-beze-vineyard-guide.md',
                  },
                  {
                    slug: 'chapelle-chambertin',
                    name: 'Chapelle-Chambertin',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'gevrey-chambertin',
                    guideFile: 'chapelle-chambertin-vineyard-guide.md',
                  },
                  {
                    slug: 'charmes-chambertin',
                    name: 'Charmes-Chambertin',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'gevrey-chambertin',
                    guideFile: 'charmes-chambertin-vineyard-guide.md',
                  },
                  {
                    slug: 'griotte-chambertin',
                    name: 'Griotte-Chambertin',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'gevrey-chambertin',
                    guideFile: 'griotte-chambertin-vineyard-guide.md',
                  },
                  {
                    slug: 'latricieres-chambertin',
                    name: 'Latricières-Chambertin',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'gevrey-chambertin',
                    guideFile: 'latricieres-chambertin-vineyard-guide.md',
                  },
                  {
                    slug: 'mazis-chambertin',
                    name: 'Mazis-Chambertin',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'gevrey-chambertin',
                    guideFile: 'mazis-chambertin-vineyard-guide.md',
                  },
                  {
                    slug: 'mazoyeres-chambertin',
                    name: 'Mazoyères-Chambertin',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'gevrey-chambertin',
                    guideFile: 'mazoyeres-chambertin-vineyard-guide.md',
                  },
                  {
                    slug: 'ruchottes-chambertin',
                    name: 'Ruchottes-Chambertin',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'gevrey-chambertin',
                    guideFile: 'ruchottes-chambertin-vineyard-guide.md',
                  },
                  {
                    slug: 'clos-saint-jacques',
                    name: 'Clos Saint-Jacques',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'gevrey-chambertin',
                    guideFile: 'clos-saint-jacques-vineyard-guide.md',
                  },
                  {
                    slug: 'les-cazetiers',
                    name: 'Les Cazetiers',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'gevrey-chambertin',
                    guideFile: 'les-cazetiers-vineyard-guide.md',
                  },
                  {
                    slug: 'lavaux-saint-jacques',
                    name: 'Lavaux Saint-Jacques',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'gevrey-chambertin',
                    guideFile: 'lavaux-saint-jacques-vineyard-guide.md',
                  },
                  {
                    slug: 'les-combottes',
                    name: 'Les Combottes',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'gevrey-chambertin',
                    guideFile: 'les-combottes-vineyard-guide.md',
                  },
                  {
                    slug: 'aux-combottes',
                    name: 'Aux Combottes',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'gevrey-chambertin',
                    guideFile: 'aux-combottes-vineyard-guide.md',
                  },
                  {
                    slug: 'estournelles-saint-jacques',
                    name: 'Estournelles Saint-Jacques',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'gevrey-chambertin',
                    guideFile: 'estournelles-saint-jacques-vineyard-guide.md',
                  },
                  {
                    slug: 'champeaux',
                    name: 'Champeaux',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'gevrey-chambertin',
                    guideFile: 'champeaux-vineyard-guide.md',
                  },
                  {
                    slug: 'la-petite-chapelle',
                    name: 'La Petite Chapelle',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'gevrey-chambertin',
                    guideFile: 'la-petite-chapelle-vineyard-guide.md',
                  },
                  {
                    slug: 'poissenot',
                    name: 'Poissenot',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'gevrey-chambertin',
                    guideFile: 'poissenot-vineyard-guide.md',
                  },
                  {
                    slug: 'fonteny',
                    name: 'Fonteny',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'gevrey-chambertin',
                    guideFile: 'fonteny-vineyard-guide.md',
                  },
                  {
                    slug: 'les-goulots',
                    name: 'Les Goulots',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'gevrey-chambertin',
                    guideFile: 'les-goulots-vineyard-guide.md',
                  },
                ],
              },
              {
                slug: 'morey-saint-denis',
                name: 'Morey-Saint-Denis',
                level: 'village',
                parent: 'cote-de-nuits',
                guideFile: 'morey-saint-denis-guide.md',
                sidebarLinks: [
                  { name: 'Clos de la Roche', slug: 'clos-de-la-roche', classification: 'grand-cru' },
                  { name: 'Clos Saint-Denis', slug: 'clos-saint-denis', classification: 'grand-cru' },
                  { name: 'Clos de Tart', slug: 'clos-de-tart', classification: 'grand-cru' },
                  { name: 'Clos des Lambrays', slug: 'clos-des-lambrays', classification: 'grand-cru' },
                  { name: 'Bonnes-Mares', slug: 'bonnes-mares-morey', classification: 'grand-cru' },
                  { name: 'Les Ruchots', slug: 'les-ruchots', classification: 'premier-cru' },
                  { name: 'Clos des Ormes', slug: 'clos-des-ormes', classification: 'premier-cru' },
                  { name: 'Les Monts Luisants', slug: 'les-monts-luisants', classification: 'premier-cru' },
                  { name: 'Les Millandes', slug: 'les-millandes', classification: 'premier-cru' },
                  { name: 'La Riotte', slug: 'la-riotte', classification: 'premier-cru' },
                ],
                subRegions: [
                  {
                    slug: 'clos-de-la-roche',
                    name: 'Clos de la Roche',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'morey-saint-denis',
                    guideFile: 'clos-de-la-roche-vineyard-guide.md',
                  },
                  {
                    slug: 'clos-saint-denis',
                    name: 'Clos Saint-Denis',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'morey-saint-denis',
                    guideFile: 'clos-saint-denis-vineyard-guide.md',
                  },
                  {
                    slug: 'clos-de-tart',
                    name: 'Clos de Tart',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'morey-saint-denis',
                    guideFile: 'clos-de-tart-vineyard-guide.md',
                  },
                  {
                    slug: 'clos-des-lambrays',
                    name: 'Clos des Lambrays',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'morey-saint-denis',
                    guideFile: 'clos-des-lambrays-vineyard-guide.md',
                  },
                  {
                    slug: 'bonnes-mares-morey',
                    name: 'Bonnes-Mares',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'morey-saint-denis',
                    guideFile: 'bonnes-mares-morey-vineyard-guide.md',
                  },
                  {
                    slug: 'les-ruchots',
                    name: 'Les Ruchots',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'morey-saint-denis',
                    guideFile: 'les-ruchots-vineyard-guide.md',
                  },
                  {
                    slug: 'clos-des-ormes',
                    name: 'Clos des Ormes',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'morey-saint-denis',
                    guideFile: 'clos-des-ormes-vineyard-guide.md',
                  },
                  {
                    slug: 'les-monts-luisants',
                    name: 'Les Monts Luisants',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'morey-saint-denis',
                    guideFile: 'les-monts-luisants-vineyard-guide.md',
                  },
                  {
                    slug: 'les-millandes',
                    name: 'Les Millandes',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'morey-saint-denis',
                    guideFile: 'les-millandes-vineyard-guide.md',
                  },
                  {
                    slug: 'la-riotte',
                    name: 'La Riotte',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'morey-saint-denis',
                    guideFile: 'la-riotte-vineyard-guide.md',
                  },
                ],
              },
              {
                slug: 'chambolle-musigny',
                name: 'Chambolle-Musigny',
                level: 'village',
                parent: 'cote-de-nuits',
                guideFile: 'chambolle-musigny-guide.md',
                sidebarLinks: [
                  { name: 'Musigny', slug: 'musigny', classification: 'grand-cru' },
                  { name: 'Bonnes-Mares', slug: 'bonnes-mares', classification: 'grand-cru' },
                  { name: 'Les Amoureuses', slug: 'les-amoureuses', classification: 'premier-cru' },
                  { name: 'Les Charmes', slug: 'les-charmes', classification: 'premier-cru' },
                  { name: 'Les Cras', slug: 'les-cras', classification: 'premier-cru' },
                  { name: 'Les Fuées', slug: 'les-fuees', classification: 'premier-cru' },
                  { name: 'Les Baudes', slug: 'les-baudes', classification: 'premier-cru' },
                  { name: 'Les Sentiers', slug: 'les-sentiers', classification: 'premier-cru' },
                ],
                subRegions: [
                  {
                    slug: 'musigny',
                    name: 'Musigny',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'chambolle-musigny',
                    guideFile: 'musigny-vineyard-guide.md',
                  },
                  {
                    slug: 'bonnes-mares',
                    name: 'Bonnes-Mares',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'chambolle-musigny',
                    guideFile: 'bonnes-mares-vineyard-guide.md',
                  },
                  {
                    slug: 'les-amoureuses',
                    name: 'Les Amoureuses',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'chambolle-musigny',
                    guideFile: 'les-amoureuses-vineyard-guide.md',
                  },
                  {
                    slug: 'les-charmes',
                    name: 'Les Charmes',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'chambolle-musigny',
                    guideFile: 'les-charmes-vineyard-guide.md',
                  },
                  {
                    slug: 'les-cras',
                    name: 'Les Cras',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'chambolle-musigny',
                    guideFile: 'les-cras-vineyard-guide.md',
                  },
                  {
                    slug: 'les-fuees',
                    name: 'Les Fuées',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'chambolle-musigny',
                    guideFile: 'les-fuees-vineyard-guide.md',
                  },
                  {
                    slug: 'les-baudes',
                    name: 'Les Baudes',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'chambolle-musigny',
                    guideFile: 'les-baudes-vineyard-guide.md',
                  },
                  {
                    slug: 'les-sentiers',
                    name: 'Les Sentiers',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'chambolle-musigny',
                    guideFile: 'les-sentiers-vineyard-guide.md',
                  },
                ],
              },
              {
                slug: 'vougeot',
                name: 'Vougeot',
                level: 'village',
                parent: 'cote-de-nuits',
                guideFile: 'vougeot-guide.md',
                sidebarLinks: [
                  { name: 'Clos de Vougeot', slug: 'clos-de-vougeot', classification: 'grand-cru' },
                  { name: 'Le Clos Blanc', slug: 'le-clos-blanc', classification: 'premier-cru' },
                  { name: 'Les Petits Vougeots', slug: 'les-petits-vougeots', classification: 'premier-cru' },
                  { name: 'Clos de la Perrière', slug: 'clos-de-la-perriere', classification: 'premier-cru' },
                  { name: 'Les Cras', slug: 'les-cras-vougeot', classification: 'premier-cru' },
                ],
                subRegions: [
                  {
                    slug: 'clos-de-vougeot',
                    name: 'Clos de Vougeot',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'vougeot',
                    guideFile: 'clos-de-vougeot-vineyard-guide.md',
                  },
                  {
                    slug: 'le-clos-blanc',
                    name: 'Le Clos Blanc',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'vougeot',
                    guideFile: 'le-clos-blanc-vineyard-guide.md',
                  },
                  {
                    slug: 'les-petits-vougeots',
                    name: 'Les Petits Vougeots',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'vougeot',
                    guideFile: 'les-petits-vougeots-vineyard-guide.md',
                  },
                  {
                    slug: 'clos-de-la-perriere',
                    name: 'Clos de la Perrière',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'vougeot',
                    guideFile: 'clos-de-la-perriere-vineyard-guide.md',
                  },
                  {
                    slug: 'les-cras-vougeot',
                    name: 'Les Cras',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'vougeot',
                    guideFile: 'les-cras-vougeot-vineyard-guide.md',
                  },
                ],
              },
              {
                slug: 'vosne-romanee',
                name: 'Vosne-Romanée',
                level: 'village',
                parent: 'cote-de-nuits',
                guideFile: 'vosne-romanee-guide.md',
                sidebarLinks: [
                  { name: 'Romanée-Conti', slug: 'romanee-conti', classification: 'grand-cru' },
                  { name: 'La Romanée', slug: 'la-romanee', classification: 'grand-cru' },
                  { name: 'Romanée-Saint-Vivant', slug: 'romanee-saint-vivant', classification: 'grand-cru' },
                  { name: 'Richebourg', slug: 'richebourg', classification: 'grand-cru' },
                  { name: 'La Tâche', slug: 'la-tache', classification: 'grand-cru' },
                  { name: 'La Grande Rue', slug: 'la-grande-rue', classification: 'grand-cru' },
                  { name: 'Échezeaux', slug: 'echezeaux', classification: 'grand-cru' },
                  { name: 'Grands Échezeaux', slug: 'grands-echezeaux', classification: 'grand-cru' },
                  { name: 'Aux Malconsorts', slug: 'aux-malconsorts', classification: 'premier-cru' },
                  { name: 'Les Suchots', slug: 'les-suchots', classification: 'premier-cru' },
                  { name: 'Cros Parantoux', slug: 'cros-parantoux', classification: 'premier-cru' },
                  { name: 'Les Beaux Monts', slug: 'les-beaux-monts', classification: 'premier-cru' },
                  { name: 'Les Brûlées', slug: 'les-brulees', classification: 'premier-cru' },
                  { name: 'Aux Reignots', slug: 'aux-reignots', classification: 'premier-cru' },
                ],
                subRegions: [
                  {
                    slug: 'romanee-conti',
                    name: 'Romanée-Conti',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'vosne-romanee',
                    guideFile: 'romanee-conti-vineyard-guide.md',
                  },
                  {
                    slug: 'la-romanee',
                    name: 'La Romanée',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'vosne-romanee',
                    guideFile: 'la-romanee-vineyard-guide.md',
                  },
                  {
                    slug: 'romanee-saint-vivant',
                    name: 'Romanée-Saint-Vivant',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'vosne-romanee',
                    guideFile: 'romanee-saint-vivant-vineyard-guide.md',
                  },
                  {
                    slug: 'richebourg',
                    name: 'Richebourg',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'vosne-romanee',
                    guideFile: 'richebourg-vineyard-guide.md',
                  },
                  {
                    slug: 'la-tache',
                    name: 'La Tâche',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'vosne-romanee',
                    guideFile: 'la-tache-vineyard-guide.md',
                  },
                  {
                    slug: 'la-grande-rue',
                    name: 'La Grande Rue',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'vosne-romanee',
                    guideFile: 'la-grande-rue-vineyard-guide.md',
                  },
                  {
                    slug: 'echezeaux',
                    name: 'Échezeaux',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'vosne-romanee',
                    guideFile: 'echezeaux-vineyard-guide.md',
                  },
                  {
                    slug: 'grands-echezeaux',
                    name: 'Grands Échezeaux',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'vosne-romanee',
                    guideFile: 'grands-echezeaux-vineyard-guide.md',
                  },
                  {
                    slug: 'aux-malconsorts',
                    name: 'Aux Malconsorts',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'vosne-romanee',
                    guideFile: 'aux-malconsorts-vineyard-guide.md',
                  },
                  {
                    slug: 'les-suchots',
                    name: 'Les Suchots',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'vosne-romanee',
                    guideFile: 'les-suchots-vineyard-guide.md',
                  },
                  {
                    slug: 'cros-parantoux',
                    name: 'Cros Parantoux',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'vosne-romanee',
                    guideFile: 'cros-parantoux-vineyard-guide.md',
                  },
                  {
                    slug: 'les-beaux-monts',
                    name: 'Les Beaux Monts',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'vosne-romanee',
                    guideFile: 'les-beaux-monts-vineyard-guide.md',
                  },
                  {
                    slug: 'les-brulees',
                    name: 'Les Brûlées',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'vosne-romanee',
                    guideFile: 'les-brulees-vineyard-guide.md',
                  },
                  {
                    slug: 'aux-reignots',
                    name: 'Aux Reignots',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'vosne-romanee',
                    guideFile: 'aux-reignots-vineyard-guide.md',
                  },
                ],
              },
            ],
          },
          {
            slug: 'cote-de-beaune',
            name: 'Côte de Beaune',
            level: 'sub-region',
            parent: 'burgundy',
            guideFile: 'cote-de-beaune-guide.md',
            sidebarLinks: [
              { name: 'Aloxe-Corton', slug: 'aloxe-corton' },
              { name: 'Beaune', slug: 'beaune' },
              { name: 'Pommard', slug: 'pommard' },
              { name: 'Volnay', slug: 'volnay' },
              { name: 'Meursault', slug: 'meursault' },
              { name: 'Puligny-Montrachet', slug: 'puligny-montrachet' },
              { name: 'Chassagne-Montrachet', slug: 'chassagne-montrachet' },
            ],
            subRegions: [
              {
                slug: 'aloxe-corton',
                name: 'Aloxe-Corton',
                level: 'village',
                parent: 'cote-de-beaune',
                guideFile: 'aloxe-corton-guide.md',
                sidebarLinks: [
                  { name: 'Corton', slug: 'corton', classification: 'grand-cru' },
                  { name: 'Corton-Charlemagne', slug: 'corton-charlemagne', classification: 'grand-cru' },
                  { name: 'Les Maréchaudes', slug: 'les-marechaudes', classification: 'premier-cru' },
                  { name: 'Les Valozières', slug: 'les-valozieres', classification: 'premier-cru' },
                ],
                subRegions: [
                  {
                    slug: 'corton',
                    name: 'Corton',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'aloxe-corton',
                    guideFile: 'corton-vineyard-guide.md',
                  },
                  {
                    slug: 'corton-charlemagne',
                    name: 'Corton-Charlemagne',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'aloxe-corton',
                    guideFile: 'corton-charlemagne-vineyard-guide.md',
                  },
                  {
                    slug: 'les-marechaudes',
                    name: 'Les Maréchaudes',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'aloxe-corton',
                    guideFile: 'les-marechaudes-vineyard-guide.md',
                  },
                  {
                    slug: 'les-valozieres',
                    name: 'Les Valozières',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'aloxe-corton',
                    guideFile: 'les-valozieres-vineyard-guide.md',
                  },
                ],
              },
              {
                slug: 'beaune',
                name: 'Beaune',
                level: 'village',
                parent: 'cote-de-beaune',
                guideFile: 'beaune-guide.md',
                sidebarLinks: [
                  { name: 'Clos des Mouches', slug: 'clos-des-mouches', classification: 'premier-cru' },
                  { name: 'Les Grèves', slug: 'les-greves', classification: 'premier-cru' },
                  { name: 'Les Bressandes', slug: 'les-bressandes', classification: 'premier-cru' },
                  { name: 'Les Teurons', slug: 'les-teurons', classification: 'premier-cru' },
                  { name: 'Les Cent Vignes', slug: 'les-cent-vignes', classification: 'premier-cru' },
                ],
                subRegions: [
                  {
                    slug: 'clos-des-mouches',
                    name: 'Clos des Mouches',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'beaune',
                    guideFile: 'clos-des-mouches-vineyard-guide.md',
                  },
                  {
                    slug: 'les-greves',
                    name: 'Les Grèves',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'beaune',
                    guideFile: 'les-greves-vineyard-guide.md',
                  },
                  {
                    slug: 'les-bressandes',
                    name: 'Les Bressandes',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'beaune',
                    guideFile: 'les-bressandes-vineyard-guide.md',
                  },
                  {
                    slug: 'les-teurons',
                    name: 'Les Teurons',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'beaune',
                    guideFile: 'les-teurons-vineyard-guide.md',
                  },
                  {
                    slug: 'les-cent-vignes',
                    name: 'Les Cent Vignes',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'beaune',
                    guideFile: 'les-cent-vignes-vineyard-guide.md',
                  },
                ],
              },
              {
                slug: 'pommard',
                name: 'Pommard',
                level: 'village',
                parent: 'cote-de-beaune',
                guideFile: 'pommard-guide.md',
                sidebarLinks: [
                  { name: 'Les Rugiens', slug: 'les-rugiens', classification: 'premier-cru' },
                  { name: 'Les Épenots', slug: 'les-epenots', classification: 'premier-cru' },
                  { name: 'Clos des Épeneaux', slug: 'clos-des-epeneaux', classification: 'premier-cru' },
                ],
                subRegions: [
                  {
                    slug: 'les-rugiens',
                    name: 'Les Rugiens',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'pommard',
                    guideFile: 'les-rugiens-vineyard-guide.md',
                  },
                  {
                    slug: 'les-epenots',
                    name: 'Les Épenots',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'pommard',
                    guideFile: 'les-epenots-vineyard-guide.md',
                  },
                  {
                    slug: 'clos-des-epeneaux',
                    name: 'Clos des Épeneaux',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'pommard',
                    guideFile: 'clos-des-epeneaux-vineyard-guide.md',
                  },
                ],
              },
              {
                slug: 'volnay',
                name: 'Volnay',
                level: 'village',
                parent: 'cote-de-beaune',
                guideFile: 'volnay-guide.md',
                sidebarLinks: [
                  { name: 'Clos des Chênes', slug: 'clos-des-chenes', classification: 'premier-cru' },
                  { name: 'Caillerets', slug: 'caillerets', classification: 'premier-cru' },
                  { name: 'Santenots', slug: 'santenots', classification: 'premier-cru' },
                ],
                subRegions: [
                  {
                    slug: 'clos-des-chenes',
                    name: 'Clos des Chênes',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'volnay',
                    guideFile: 'clos-des-chenes-vineyard-guide.md',
                  },
                  {
                    slug: 'caillerets',
                    name: 'Caillerets',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'volnay',
                    guideFile: 'caillerets-vineyard-guide.md',
                  },
                  {
                    slug: 'santenots',
                    name: 'Santenots',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'volnay',
                    guideFile: 'santenots-vineyard-guide.md',
                  },
                ],
              },
              {
                slug: 'meursault',
                name: 'Meursault',
                level: 'village',
                parent: 'cote-de-beaune',
                guideFile: 'meursault-guide.md',
                sidebarLinks: [
                  { name: 'Les Perrières', slug: 'les-perrieres-meursault', classification: 'premier-cru' },
                  { name: 'Les Genevrières', slug: 'les-genevrieres', classification: 'premier-cru' },
                  { name: 'Les Charmes', slug: 'les-charmes-meursault', classification: 'premier-cru' },
                  { name: 'Clos de la Barre', slug: 'clos-de-la-barre', classification: 'premier-cru' },
                ],
                subRegions: [
                  {
                    slug: 'les-perrieres-meursault',
                    name: 'Les Perrières',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'meursault',
                    guideFile: 'les-perrieres-meursault-vineyard-guide.md',
                  },
                  {
                    slug: 'les-genevrieres',
                    name: 'Les Genevrières',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'meursault',
                    guideFile: 'les-genevrieres-vineyard-guide.md',
                  },
                  {
                    slug: 'les-charmes-meursault',
                    name: 'Les Charmes',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'meursault',
                    guideFile: 'les-charmes-meursault-vineyard-guide.md',
                  },
                  {
                    slug: 'clos-de-la-barre',
                    name: 'Clos de la Barre',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'meursault',
                    guideFile: 'clos-de-la-barre-vineyard-guide.md',
                  },
                ],
              },
              {
                slug: 'puligny-montrachet',
                name: 'Puligny-Montrachet',
                level: 'village',
                parent: 'cote-de-beaune',
                guideFile: 'puligny-montrachet-guide.md',
                sidebarLinks: [
                  { name: 'Montrachet', slug: 'montrachet', classification: 'grand-cru' },
                  { name: 'Chevalier-Montrachet', slug: 'chevalier-montrachet', classification: 'grand-cru' },
                  { name: 'Bâtard-Montrachet', slug: 'batard-montrachet', classification: 'grand-cru' },
                  { name: 'Bienvenues-Bâtard-Montrachet', slug: 'bienvenues-batard-montrachet', classification: 'grand-cru' },
                  { name: 'Les Pucelles', slug: 'les-pucelles', classification: 'premier-cru' },
                  { name: 'Le Cailleret', slug: 'le-cailleret', classification: 'premier-cru' },
                ],
                subRegions: [
                  {
                    slug: 'montrachet',
                    name: 'Montrachet',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'puligny-montrachet',
                    guideFile: 'montrachet-vineyard-guide.md',
                  },
                  {
                    slug: 'chevalier-montrachet',
                    name: 'Chevalier-Montrachet',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'puligny-montrachet',
                    guideFile: 'chevalier-montrachet-vineyard-guide.md',
                  },
                  {
                    slug: 'batard-montrachet',
                    name: 'Bâtard-Montrachet',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'puligny-montrachet',
                    guideFile: 'batard-montrachet-vineyard-guide.md',
                  },
                  {
                    slug: 'bienvenues-batard-montrachet',
                    name: 'Bienvenues-Bâtard-Montrachet',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'puligny-montrachet',
                    guideFile: 'bienvenues-batard-montrachet-vineyard-guide.md',
                  },
                  {
                    slug: 'les-pucelles',
                    name: 'Les Pucelles',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'puligny-montrachet',
                    guideFile: 'les-pucelles-vineyard-guide.md',
                  },
                  {
                    slug: 'le-cailleret',
                    name: 'Le Cailleret',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'puligny-montrachet',
                    guideFile: 'le-cailleret-vineyard-guide.md',
                  },
                ],
              },
              {
                slug: 'chassagne-montrachet',
                name: 'Chassagne-Montrachet',
                level: 'village',
                parent: 'cote-de-beaune',
                guideFile: 'chassagne-montrachet-guide.md',
                sidebarLinks: [
                  { name: 'Criots-Bâtard-Montrachet', slug: 'criots-batard-montrachet', classification: 'grand-cru' },
                  { name: 'Les Ruchottes', slug: 'les-ruchottes-chassagne', classification: 'premier-cru' },
                  { name: 'Morgeot', slug: 'morgeot', classification: 'premier-cru' },
                  { name: 'La Boudriotte', slug: 'la-boudriotte', classification: 'premier-cru' },
                ],
                subRegions: [
                  {
                    slug: 'criots-batard-montrachet',
                    name: 'Criots-Bâtard-Montrachet',
                    level: 'vineyard',
                    classification: 'grand-cru',
                    parent: 'chassagne-montrachet',
                    guideFile: 'criots-batard-montrachet-vineyard-guide.md',
                  },
                  {
                    slug: 'les-ruchottes-chassagne',
                    name: 'Les Ruchottes',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'chassagne-montrachet',
                    guideFile: 'les-ruchottes-chassagne-vineyard-guide.md',
                  },
                  {
                    slug: 'morgeot',
                    name: 'Morgeot',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'chassagne-montrachet',
                    guideFile: 'morgeot-vineyard-guide.md',
                  },
                  {
                    slug: 'la-boudriotte',
                    name: 'La Boudriotte',
                    level: 'vineyard',
                    classification: 'premier-cru',
                    parent: 'chassagne-montrachet',
                    guideFile: 'la-boudriotte-vineyard-guide.md',
                  },
                ],
              },
            ],
          },
          {
            slug: 'cote-chalonnaise',
            name: 'Côte Chalonnaise',
            level: 'sub-region',
            parent: 'burgundy',
            guideFile: 'cote-chalonnaise-guide.md',
          },
          {
            slug: 'maconnais',
            name: 'Mâconnais',
            level: 'sub-region',
            parent: 'burgundy',
            guideFile: 'maconnais-guide.md',
          },
        ],
      },
      {
        slug: 'beaujolais',
        name: 'Beaujolais',
        level: 'region',
        parent: 'france',
        guideFile: 'beaujolais-guide.md',
      },
      {
        slug: 'rhone-valley',
        name: 'Rhône Valley',
        level: 'region',
        parent: 'france',
        guideFile: 'rhone-valley-guide.md',
        sidebarLinks: [
          { name: 'Châteauneuf-du-Pape', slug: 'chateauneuf-du-pape' },
          { name: 'Hermitage', slug: 'hermitage' },
          { name: 'Côte-Rôtie', slug: 'cote-rotie' },
          { name: 'Condrieu', slug: 'condrieu' },
        ],
        subRegions: [
          {
            slug: 'chateauneuf-du-pape',
            name: 'Châteauneuf-du-Pape',
            level: 'sub-region',
            parent: 'rhone-valley',
            guideFile: 'chateauneuf-du-pape-guide.md',
            sidebarLinks: [
              { name: 'Château Rayas', slug: 'chateau-rayas', classification: 'single-vineyard' },
              { name: 'Domaine du Vieux Télégraphe', slug: 'domaine-du-vieux-telegraphe', classification: 'single-vineyard' },
              { name: 'Château de Beaucastel', slug: 'chateau-de-beaucastel', classification: 'single-vineyard' },
              { name: 'Domaine de la Janasse', slug: 'domaine-de-la-janasse', classification: 'single-vineyard' },
            ],
            subRegions: [
              {
                slug: 'chateau-rayas',
                name: 'Château Rayas',
                level: 'vineyard',
                classification: 'single-vineyard',
                parent: 'chateauneuf-du-pape',
                guideFile: 'chateau-rayas-guide.md',
              },
              {
                slug: 'domaine-du-vieux-telegraphe',
                name: 'Domaine du Vieux Télégraphe',
                level: 'vineyard',
                classification: 'single-vineyard',
                parent: 'chateauneuf-du-pape',
                guideFile: 'domaine-du-vieux-telegraphe-guide.md',
              },
              {
                slug: 'chateau-de-beaucastel',
                name: 'Château de Beaucastel',
                level: 'vineyard',
                classification: 'single-vineyard',
                parent: 'chateauneuf-du-pape',
                guideFile: 'chateau-de-beaucastel-guide.md',
              },
              {
                slug: 'domaine-de-la-janasse',
                name: 'Domaine de la Janasse',
                level: 'vineyard',
                classification: 'single-vineyard',
                parent: 'chateauneuf-du-pape',
                guideFile: 'domaine-de-la-janasse-guide.md',
              },
            ],
          },
          {
            slug: 'hermitage',
            name: 'Hermitage',
            level: 'sub-region',
            parent: 'rhone-valley',
            guideFile: 'hermitage-guide.md',
            sidebarLinks: [
              { name: 'Domaine Jean-Louis Chave', slug: 'domaine-jean-louis-chave', classification: 'single-vineyard' },
              { name: 'M. Chapoutier', slug: 'm-chapoutier', classification: 'single-vineyard' },
              { name: 'Paul Jaboulet Aîné', slug: 'paul-jaboulet-aine', classification: 'single-vineyard' },
            ],
            subRegions: [
              {
                slug: 'domaine-jean-louis-chave',
                name: 'Domaine Jean-Louis Chave',
                level: 'vineyard',
                classification: 'single-vineyard',
                parent: 'hermitage',
                guideFile: 'domaine-jean-louis-chave-guide.md',
              },
              {
                slug: 'm-chapoutier',
                name: 'M. Chapoutier',
                level: 'vineyard',
                classification: 'single-vineyard',
                parent: 'hermitage',
                guideFile: 'm-chapoutier-guide.md',
              },
              {
                slug: 'paul-jaboulet-aine',
                name: 'Paul Jaboulet Aîné',
                level: 'vineyard',
                classification: 'single-vineyard',
                parent: 'hermitage',
                guideFile: 'paul-jaboulet-aine-guide.md',
              },
            ],
          },
          {
            slug: 'cote-rotie',
            name: 'Côte-Rôtie',
            level: 'sub-region',
            parent: 'rhone-valley',
            guideFile: 'cote-rotie-guide.md',
            sidebarLinks: [
              { name: 'Domaine Jamet', slug: 'domaine-jamet', classification: 'single-vineyard' },
              { name: 'E. Guigal', slug: 'e-guigal', classification: 'single-vineyard' },
              { name: 'René Rostaing', slug: 'rene-rostaing', classification: 'single-vineyard' },
            ],
            subRegions: [
              {
                slug: 'domaine-jamet',
                name: 'Domaine Jamet',
                level: 'vineyard',
                classification: 'single-vineyard',
                parent: 'cote-rotie',
                guideFile: 'domaine-jamet-guide.md',
              },
              {
                slug: 'e-guigal',
                name: 'E. Guigal',
                level: 'vineyard',
                classification: 'single-vineyard',
                parent: 'cote-rotie',
                guideFile: 'e-guigal-guide.md',
              },
              {
                slug: 'rene-rostaing',
                name: 'René Rostaing',
                level: 'vineyard',
                classification: 'single-vineyard',
                parent: 'cote-rotie',
                guideFile: 'rene-rostaing-guide.md',
              },
            ],
          },
          {
            slug: 'condrieu',
            name: 'Condrieu',
            level: 'sub-region',
            parent: 'rhone-valley',
            guideFile: 'condrieu-guide.md',
            sidebarLinks: [
              { name: 'Domaine Georges Vernay', slug: 'domaine-georges-vernay', classification: 'single-vineyard' },
              { name: 'Domaine Yves Cuilleron', slug: 'domaine-yves-cuilleron', classification: 'single-vineyard' },
            ],
            subRegions: [
              {
                slug: 'domaine-georges-vernay',
                name: 'Domaine Georges Vernay',
                level: 'vineyard',
                classification: 'single-vineyard',
                parent: 'condrieu',
                guideFile: 'domaine-georges-vernay-guide.md',
              },
              {
                slug: 'domaine-yves-cuilleron',
                name: 'Domaine Yves Cuilleron',
                level: 'vineyard',
                classification: 'single-vineyard',
                parent: 'condrieu',
                guideFile: 'domaine-yves-cuilleron-guide.md',
              },
            ],
          },
        ],
      },
      {
        slug: 'loire-valley',
        name: 'Loire Valley',
        level: 'region',
        parent: 'france',
        guideFile: 'loire-valley-guide.md',
      },
      {
        slug: 'provence',
        name: 'Provence',
        level: 'region',
        parent: 'france',
        guideFile: 'provence-guide.md',
      },
      {
        slug: 'languedoc-roussillon',
        name: 'Languedoc-Roussillon',
        level: 'region',
        parent: 'france',
        guideFile: 'languedoc-roussillon-guide.md',
      },
      {
        slug: 'bordeaux',
        name: 'Bordeaux',
        level: 'region',
        parent: 'france',
        guideFile: 'bordeaux-guide.md',
        sidebarLinks: [
          { name: 'Pauillac', slug: 'pauillac' },
          { name: 'Saint-Julien', slug: 'saint-julien' },
          { name: 'Margaux', slug: 'margaux' },
          { name: 'Saint-Émilion', slug: 'saint-emilion' },
          { name: 'Pomerol', slug: 'pomerol' },
        ],
        subRegions: [
          {
            slug: 'pauillac',
            name: 'Pauillac',
            level: 'sub-region',
            parent: 'bordeaux',
            guideFile: 'pauillac-guide.md',
            sidebarLinks: [
              { name: 'Château Lafite Rothschild', slug: 'chateau-lafite-rothschild', classification: '1er-cru-classe' },
              { name: 'Château Latour', slug: 'chateau-latour', classification: '1er-cru-classe' },
              { name: 'Château Mouton Rothschild', slug: 'chateau-mouton-rothschild', classification: '1er-cru-classe' },
              { name: 'Château Pichon-Longueville', slug: 'chateau-pichon-longueville', classification: '2eme-cru-classe' },
              { name: 'Château Pichon-Longueville Comtesse de Lalande', slug: 'chateau-pichon-longueville-comtesse-de-lalande', classification: '2eme-cru-classe' },
              { name: 'Château Duhart-Milon', slug: 'chateau-duhart-milon', classification: '4eme-cru-classe' },
              { name: 'Château Pontet-Canet', slug: 'chateau-pontet-canet', classification: '5eme-cru-classe' },
              { name: 'Château Lynch-Bages', slug: 'chateau-lynch-bages', classification: '5eme-cru-classe' },
              { name: 'Château Grand-Puy-Lacoste', slug: 'chateau-grand-puy-lacoste', classification: '5eme-cru-classe' },
            ],
            subRegions: [
              {
                slug: 'chateau-lafite-rothschild',
                name: 'Château Lafite Rothschild',
                level: 'vineyard',
                classification: '1er-cru-classe',
                parent: 'pauillac',
                guideFile: 'chateau-lafite-rothschild-guide.md',
              },
              {
                slug: 'chateau-latour',
                name: 'Château Latour',
                level: 'vineyard',
                classification: '1er-cru-classe',
                parent: 'pauillac',
                guideFile: 'chateau-latour-guide.md',
              },
              {
                slug: 'chateau-mouton-rothschild',
                name: 'Château Mouton Rothschild',
                level: 'vineyard',
                classification: '1er-cru-classe',
                parent: 'pauillac',
                guideFile: 'chateau-mouton-rothschild-guide.md',
              },
              {
                slug: 'chateau-pichon-longueville',
                name: 'Château Pichon-Longueville',
                level: 'vineyard',
                classification: '2eme-cru-classe',
                parent: 'pauillac',
                guideFile: 'chateau-pichon-longueville-guide.md',
              },
              {
                slug: 'chateau-pichon-longueville-comtesse-de-lalande',
                name: 'Château Pichon-Longueville Comtesse de Lalande',
                level: 'vineyard',
                classification: '2eme-cru-classe',
                parent: 'pauillac',
                guideFile: 'chateau-pichon-longueville-comtesse-de-lalande-guide.md',
              },
              {
                slug: 'chateau-duhart-milon',
                name: 'Château Duhart-Milon',
                level: 'vineyard',
                classification: '4eme-cru-classe',
                parent: 'pauillac',
                guideFile: 'chateau-duhart-milon-guide.md',
              },
              {
                slug: 'chateau-pontet-canet',
                name: 'Château Pontet-Canet',
                level: 'vineyard',
                classification: '5eme-cru-classe',
                parent: 'pauillac',
                guideFile: 'chateau-pontet-canet-guide.md',
              },
              {
                slug: 'chateau-lynch-bages',
                name: 'Château Lynch-Bages',
                level: 'vineyard',
                classification: '5eme-cru-classe',
                parent: 'pauillac',
                guideFile: 'chateau-lynch-bages-guide.md',
              },
              {
                slug: 'chateau-grand-puy-lacoste',
                name: 'Château Grand-Puy-Lacoste',
                level: 'vineyard',
                classification: '5eme-cru-classe',
                parent: 'pauillac',
                guideFile: 'chateau-grand-puy-lacoste-guide.md',
              },
            ],
          },
          {
            slug: 'saint-julien',
            name: 'Saint-Julien',
            level: 'sub-region',
            parent: 'bordeaux',
            guideFile: 'saint-julien-guide.md',
            sidebarLinks: [
              { name: 'Château Léoville-Las Cases', slug: 'chateau-leoville-las-cases', classification: '2eme-cru-classe' },
              { name: 'Château Léoville-Poyferré', slug: 'chateau-leoville-poyferre', classification: '2eme-cru-classe' },
              { name: 'Château Léoville-Barton', slug: 'chateau-leoville-barton', classification: '2eme-cru-classe' },
              { name: 'Château Ducru-Beaucaillou', slug: 'chateau-ducru-beaucaillou', classification: '2eme-cru-classe' },
              { name: 'Château Gruaud-Larose', slug: 'chateau-gruaud-larose', classification: '2eme-cru-classe' },
              { name: 'Château Beychevelle', slug: 'chateau-beychevelle', classification: '4eme-cru-classe' },
            ],
            subRegions: [
              {
                slug: 'chateau-leoville-las-cases',
                name: 'Château Léoville-Las Cases',
                level: 'vineyard',
                classification: '2eme-cru-classe',
                parent: 'saint-julien',
                guideFile: 'chateau-leoville-las-cases-guide.md',
              },
              {
                slug: 'chateau-leoville-poyferre',
                name: 'Château Léoville-Poyferré',
                level: 'vineyard',
                classification: '2eme-cru-classe',
                parent: 'saint-julien',
                guideFile: 'chateau-leoville-poyferre-guide.md',
              },
              {
                slug: 'chateau-leoville-barton',
                name: 'Château Léoville-Barton',
                level: 'vineyard',
                classification: '2eme-cru-classe',
                parent: 'saint-julien',
                guideFile: 'chateau-leoville-barton-guide.md',
              },
              {
                slug: 'chateau-ducru-beaucaillou',
                name: 'Château Ducru-Beaucaillou',
                level: 'vineyard',
                classification: '2eme-cru-classe',
                parent: 'saint-julien',
                guideFile: 'chateau-ducru-beaucaillou-guide.md',
              },
              {
                slug: 'chateau-gruaud-larose',
                name: 'Château Gruaud-Larose',
                level: 'vineyard',
                classification: '2eme-cru-classe',
                parent: 'saint-julien',
                guideFile: 'chateau-gruaud-larose-guide.md',
              },
              {
                slug: 'chateau-beychevelle',
                name: 'Château Beychevelle',
                level: 'vineyard',
                classification: '4eme-cru-classe',
                parent: 'saint-julien',
                guideFile: 'chateau-beychevelle-guide.md',
              },
            ],
          },
          {
            slug: 'margaux',
            name: 'Margaux',
            level: 'sub-region',
            parent: 'bordeaux',
            guideFile: 'margaux-guide.md',
            sidebarLinks: [
              { name: 'Château Margaux', slug: 'chateau-margaux', classification: '1er-cru-classe' },
              { name: 'Château Rauzan-Ségla', slug: 'chateau-rauzan-segla', classification: '2eme-cru-classe' },
              { name: 'Château Rauzan-Gassies', slug: 'chateau-rauzan-gassies', classification: '2eme-cru-classe' },
              { name: 'Château Durfort-Vivens', slug: 'chateau-durfort-vivens', classification: '2eme-cru-classe' },
              { name: 'Château Lascombes', slug: 'chateau-lascombes', classification: '2eme-cru-classe' },
              { name: 'Château Palmer', slug: 'chateau-palmer', classification: '3eme-cru-classe' },
            ],
            subRegions: [
              {
                slug: 'chateau-margaux',
                name: 'Château Margaux',
                level: 'vineyard',
                classification: '1er-cru-classe',
                parent: 'margaux',
                guideFile: 'chateau-margaux-guide.md',
              },
              {
                slug: 'chateau-rauzan-segla',
                name: 'Château Rauzan-Ségla',
                level: 'vineyard',
                classification: '2eme-cru-classe',
                parent: 'margaux',
                guideFile: 'chateau-rauzan-segla-guide.md',
              },
              {
                slug: 'chateau-rauzan-gassies',
                name: 'Château Rauzan-Gassies',
                level: 'vineyard',
                classification: '2eme-cru-classe',
                parent: 'margaux',
                guideFile: 'chateau-rauzan-gassies-guide.md',
              },
              {
                slug: 'chateau-durfort-vivens',
                name: 'Château Durfort-Vivens',
                level: 'vineyard',
                classification: '2eme-cru-classe',
                parent: 'margaux',
                guideFile: 'chateau-durfort-vivens-guide.md',
              },
              {
                slug: 'chateau-lascombes',
                name: 'Château Lascombes',
                level: 'vineyard',
                classification: '2eme-cru-classe',
                parent: 'margaux',
                guideFile: 'chateau-lascombes-guide.md',
              },
              {
                slug: 'chateau-palmer',
                name: 'Château Palmer',
                level: 'vineyard',
                classification: '3eme-cru-classe',
                parent: 'margaux',
                guideFile: 'chateau-palmer-guide.md',
              },
            ],
          },
          {
            slug: 'saint-emilion',
            name: 'Saint-Émilion',
            level: 'sub-region',
            parent: 'bordeaux',
            guideFile: 'saint-emilion-guide.md',
            sidebarLinks: [
              { name: 'Château Ausone', slug: 'chateau-ausone', classification: 'premier-grand-cru-classe-a' },
              { name: 'Château Cheval Blanc', slug: 'chateau-cheval-blanc', classification: 'premier-grand-cru-classe-a' },
              { name: 'Château Angélus', slug: 'chateau-angelus', classification: 'premier-grand-cru-classe-a' },
              { name: 'Château Pavie', slug: 'chateau-pavie', classification: 'premier-grand-cru-classe-a' },
              { name: 'Château Figeac', slug: 'chateau-figeac', classification: 'premier-grand-cru-classe-b' },
              { name: 'Château Canon', slug: 'chateau-canon', classification: 'premier-grand-cru-classe-b' },
            ],
            subRegions: [
              {
                slug: 'chateau-ausone',
                name: 'Château Ausone',
                level: 'vineyard',
                classification: 'premier-grand-cru-classe-a',
                parent: 'saint-emilion',
                guideFile: 'chateau-ausone-guide.md',
              },
              {
                slug: 'chateau-cheval-blanc',
                name: 'Château Cheval Blanc',
                level: 'vineyard',
                classification: 'premier-grand-cru-classe-a',
                parent: 'saint-emilion',
                guideFile: 'chateau-cheval-blanc-guide.md',
              },
              {
                slug: 'chateau-angelus',
                name: 'Château Angélus',
                level: 'vineyard',
                classification: 'premier-grand-cru-classe-a',
                parent: 'saint-emilion',
                guideFile: 'chateau-angelus-guide.md',
              },
              {
                slug: 'chateau-pavie',
                name: 'Château Pavie',
                level: 'vineyard',
                classification: 'premier-grand-cru-classe-a',
                parent: 'saint-emilion',
                guideFile: 'chateau-pavie-guide.md',
              },
              {
                slug: 'chateau-figeac',
                name: 'Château Figeac',
                level: 'vineyard',
                classification: 'premier-grand-cru-classe-b',
                parent: 'saint-emilion',
                guideFile: 'chateau-figeac-guide.md',
              },
              {
                slug: 'chateau-canon',
                name: 'Château Canon',
                level: 'vineyard',
                classification: 'premier-grand-cru-classe-b',
                parent: 'saint-emilion',
                guideFile: 'chateau-canon-guide.md',
              },
            ],
          },
          {
            slug: 'pomerol',
            name: 'Pomerol',
            level: 'sub-region',
            parent: 'bordeaux',
            guideFile: 'pomerol-guide.md',
            sidebarLinks: [
              { name: 'Château Pétrus', slug: 'chateau-petrus', classification: 'single-vineyard' },
              { name: 'Château Le Pin', slug: 'chateau-le-pin', classification: 'single-vineyard' },
              { name: 'Château Lafleur', slug: 'chateau-lafleur', classification: 'single-vineyard' },
              { name: 'Vieux Château Certan', slug: 'vieux-chateau-certan', classification: 'single-vineyard' },
              { name: 'Château Trotanoy', slug: 'chateau-trotanoy', classification: 'single-vineyard' },
              { name: "Château L'Évangile", slug: 'chateau-levangile', classification: 'single-vineyard' },
            ],
            subRegions: [
              {
                slug: 'chateau-petrus',
                name: 'Château Pétrus',
                level: 'vineyard',
                classification: 'single-vineyard',
                parent: 'pomerol',
                guideFile: 'chateau-petrus-guide.md',
              },
              {
                slug: 'chateau-le-pin',
                name: 'Château Le Pin',
                level: 'vineyard',
                classification: 'single-vineyard',
                parent: 'pomerol',
                guideFile: 'chateau-le-pin-guide.md',
              },
              {
                slug: 'chateau-lafleur',
                name: 'Château Lafleur',
                level: 'vineyard',
                classification: 'single-vineyard',
                parent: 'pomerol',
                guideFile: 'chateau-lafleur-guide.md',
              },
              {
                slug: 'vieux-chateau-certan',
                name: 'Vieux Château Certan',
                level: 'vineyard',
                classification: 'single-vineyard',
                parent: 'pomerol',
                guideFile: 'vieux-chateau-certan-guide.md',
              },
              {
                slug: 'chateau-trotanoy',
                name: 'Château Trotanoy',
                level: 'vineyard',
                classification: 'single-vineyard',
                parent: 'pomerol',
                guideFile: 'chateau-trotanoy-guide.md',
              },
              {
                slug: 'chateau-levangile',
                name: "Château L'Évangile",
                level: 'vineyard',
                classification: 'single-vineyard',
                parent: 'pomerol',
                guideFile: 'chateau-levangile-guide.md',
              },
            ],
          },
        ],
      },
      {
        slug: 'jura',
        name: 'Jura',
        level: 'region',
        parent: 'france',
        guideFile: 'jura-guide.md',
      },
    ],
  },

  // ITALY
  {
    slug: 'italy',
    name: 'Italy',
    level: 'country',
    guideFile: 'italy-guide.md',
    sidebarLinks: [
      { name: 'Piedmont', slug: 'piedmont' },
      { name: 'Tuscany', slug: 'tuscany' },
      { name: 'Veneto', slug: 'veneto' },
      { name: 'Sicily', slug: 'sicily' },
    ],
    subRegions: [
      {
        slug: 'piedmont',
        name: 'Piedmont',
        level: 'region',
        parent: 'italy',
        guideFile: 'piedmont-guide.md',
        sidebarLinks: [
          { name: 'Barolo', slug: 'barolo' },
          { name: 'Barbaresco', slug: 'barbaresco' },
        ],
        subRegions: [
          {
            slug: 'barolo',
            name: 'Barolo',
            level: 'sub-region',
            parent: 'piedmont',
            guideFile: 'barolo-guide.md',
            sidebarLinks: [
              { name: 'Cannubi', slug: 'cannubi', classification: 'mga' },
              { name: 'Brunate', slug: 'brunate', classification: 'mga' },
              { name: 'Bussia', slug: 'bussia', classification: 'mga' },
              { name: 'Cerequio', slug: 'cerequio', classification: 'mga' },
              { name: 'Rocche di Castiglione', slug: 'rocche-di-castiglione', classification: 'mga' },
            ],
            subRegions: [
              {
                slug: 'cannubi',
                name: 'Cannubi',
                level: 'vineyard',
                classification: 'mga',
                parent: 'barolo',
                guideFile: 'cannubi-vineyard-guide.md',
              },
              {
                slug: 'brunate',
                name: 'Brunate',
                level: 'vineyard',
                classification: 'mga',
                parent: 'barolo',
                guideFile: 'brunate-vineyard-guide.md',
              },
              {
                slug: 'bussia',
                name: 'Bussia',
                level: 'vineyard',
                classification: 'mga',
                parent: 'barolo',
                guideFile: 'bussia-vineyard-guide.md',
              },
              {
                slug: 'cerequio',
                name: 'Cerequio',
                level: 'vineyard',
                classification: 'mga',
                parent: 'barolo',
                guideFile: 'cerequio-vineyard-guide.md',
              },
              {
                slug: 'rocche-di-castiglione',
                name: 'Rocche di Castiglione',
                level: 'vineyard',
                classification: 'mga',
                parent: 'barolo',
                guideFile: 'rocche-di-castiglione-vineyard-guide.md',
              },
            ],
          },
          {
            slug: 'barbaresco',
            name: 'Barbaresco',
            level: 'sub-region',
            parent: 'piedmont',
            guideFile: 'barbaresco-guide.md',
            sidebarLinks: [
              { name: 'Asili', slug: 'asili', classification: 'mga' },
              { name: 'Rabajà', slug: 'rabaja', classification: 'mga' },
              { name: 'Martinenga', slug: 'martinenga', classification: 'mga' },
              { name: 'Pajè', slug: 'paje', classification: 'mga' },
            ],
            subRegions: [
              {
                slug: 'asili',
                name: 'Asili',
                level: 'vineyard',
                classification: 'mga',
                parent: 'barbaresco',
                guideFile: 'asili-vineyard-guide.md',
              },
              {
                slug: 'rabaja',
                name: 'Rabajà',
                level: 'vineyard',
                classification: 'mga',
                parent: 'barbaresco',
                guideFile: 'rabaja-vineyard-guide.md',
              },
              {
                slug: 'martinenga',
                name: 'Martinenga',
                level: 'vineyard',
                classification: 'mga',
                parent: 'barbaresco',
                guideFile: 'martinenga-vineyard-guide.md',
              },
              {
                slug: 'paje',
                name: 'Pajè',
                level: 'vineyard',
                classification: 'mga',
                parent: 'barbaresco',
                guideFile: 'paje-vineyard-guide.md',
              },
            ],
          },
        ],
      },
      {
        slug: 'tuscany',
        name: 'Tuscany',
        level: 'region',
        parent: 'italy',
        guideFile: 'tuscany-guide.md',
      },
      {
        slug: 'veneto',
        name: 'Veneto',
        level: 'region',
        parent: 'italy',
        guideFile: 'veneto-guide.md',
      },
      {
        slug: 'sicily',
        name: 'Sicily',
        level: 'region',
        parent: 'italy',
        guideFile: 'sicily-guide.md',
      },
    ],
  },

  // SPAIN
  {
    slug: 'spain',
    name: 'Spain',
    level: 'country',
    guideFile: 'spain-guide.md',
    sidebarLinks: [
      { name: 'Rioja', slug: 'rioja' },
      { name: 'Ribera del Duero', slug: 'ribera-del-duero' },
      { name: 'Priorat', slug: 'priorat' },
    ],
    subRegions: [
      {
        slug: 'rioja',
        name: 'Rioja',
        level: 'region',
        parent: 'spain',
        guideFile: 'rioja-guide.md',
        sidebarLinks: [
          { name: 'Viña Tondonia', slug: 'vina-tondonia', classification: 'single-vineyard' },
          { name: 'Marqués de Murrieta', slug: 'marques-de-murrieta', classification: 'single-vineyard' },
          { name: 'CVNE', slug: 'cvne', classification: 'single-vineyard' },
          { name: 'La Rioja Alta', slug: 'la-rioja-alta', classification: 'single-vineyard' },
        ],
        subRegions: [
          {
            slug: 'vina-tondonia',
            name: 'Viña Tondonia',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'rioja',
            guideFile: 'vina-tondonia-guide.md',
          },
          {
            slug: 'marques-de-murrieta',
            name: 'Marqués de Murrieta',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'rioja',
            guideFile: 'marques-de-murrieta-guide.md',
          },
          {
            slug: 'cvne',
            name: 'CVNE',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'rioja',
            guideFile: 'cvne-guide.md',
          },
          {
            slug: 'la-rioja-alta',
            name: 'La Rioja Alta',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'rioja',
            guideFile: 'la-rioja-alta-guide.md',
          },
        ],
      },
      {
        slug: 'ribera-del-duero',
        name: 'Ribera del Duero',
        level: 'region',
        parent: 'spain',
        guideFile: 'ribera-del-duero-guide.md',
        sidebarLinks: [
          { name: 'Vega Sicilia', slug: 'vega-sicilia', classification: 'single-vineyard' },
          { name: 'Pingus', slug: 'pingus', classification: 'single-vineyard' },
          { name: 'Pesquera', slug: 'pesquera', classification: 'single-vineyard' },
        ],
        subRegions: [
          {
            slug: 'vega-sicilia',
            name: 'Vega Sicilia',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'ribera-del-duero',
            guideFile: 'vega-sicilia-guide.md',
          },
          {
            slug: 'pingus',
            name: 'Pingus',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'ribera-del-duero',
            guideFile: 'pingus-guide.md',
          },
          {
            slug: 'pesquera',
            name: 'Pesquera',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'ribera-del-duero',
            guideFile: 'pesquera-guide.md',
          },
        ],
      },
      {
        slug: 'priorat',
        name: 'Priorat',
        level: 'region',
        parent: 'spain',
        guideFile: 'priorat-guide.md',
        sidebarLinks: [
          { name: "Clos Mogador", slug: 'clos-mogador', classification: 'single-vineyard' },
          { name: "Alvaro Palacios L'Ermita", slug: 'alvaro-palacios-lermita', classification: 'single-vineyard' },
          { name: 'Clos Erasmus', slug: 'clos-erasmus', classification: 'single-vineyard' },
        ],
        subRegions: [
          {
            slug: 'clos-mogador',
            name: 'Clos Mogador',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'priorat',
            guideFile: 'clos-mogador-guide.md',
          },
          {
            slug: 'alvaro-palacios-lermita',
            name: "Alvaro Palacios L'Ermita",
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'priorat',
            guideFile: 'alvaro-palacios-lermita-guide.md',
          },
          {
            slug: 'clos-erasmus',
            name: 'Clos Erasmus',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'priorat',
            guideFile: 'clos-erasmus-guide.md',
          },
        ],
      },
    ],
  },

  // UNITED STATES
  {
    slug: 'united-states',
    name: 'United States',
    level: 'country',
    guideFile: 'united-states-guide.md',
    sidebarLinks: [
      { name: 'California', slug: 'california' },
      { name: 'Oregon', slug: 'oregon' },
      { name: 'Washington', slug: 'washington' },
    ],
    subRegions: [
      {
        slug: 'california',
        name: 'California',
        level: 'region',
        parent: 'united-states',
        guideFile: 'california-guide.md',
        sidebarLinks: [
          { name: 'Napa Valley', slug: 'napa-valley' },
          { name: 'Sonoma', slug: 'sonoma' },
          { name: 'Central Coast', slug: 'central-coast' },
          { name: 'Paso Robles', slug: 'paso-robles' },
          { name: 'Santa Barbara', slug: 'santa-barbara' },
        ],
        subRegions: [
          {
            slug: 'napa-valley',
            name: 'Napa Valley',
            level: 'sub-region',
            parent: 'california',
            guideFile: 'napa-valley-guide.md',
            sidebarLinks: [
              { name: 'Screaming Eagle', slug: 'screaming-eagle', classification: 'single-vineyard' },
              { name: 'Harlan Estate', slug: 'harlan-estate', classification: 'single-vineyard' },
              { name: 'Opus One', slug: 'opus-one', classification: 'single-vineyard' },
              { name: 'Caymus Vineyards', slug: 'caymus-vineyards', classification: 'single-vineyard' },
              { name: "Stag's Leap Wine Cellars", slug: 'stags-leap-wine-cellars', classification: 'single-vineyard' },
            ],
            subRegions: [
              {
                slug: 'screaming-eagle',
                name: 'Screaming Eagle',
                level: 'vineyard',
                classification: 'single-vineyard',
                parent: 'napa-valley',
                guideFile: 'screaming-eagle-guide.md',
              },
              {
                slug: 'harlan-estate',
                name: 'Harlan Estate',
                level: 'vineyard',
                classification: 'single-vineyard',
                parent: 'napa-valley',
                guideFile: 'harlan-estate-guide.md',
              },
              {
                slug: 'opus-one',
                name: 'Opus One',
                level: 'vineyard',
                classification: 'single-vineyard',
                parent: 'napa-valley',
                guideFile: 'opus-one-guide.md',
              },
              {
                slug: 'caymus-vineyards',
                name: 'Caymus Vineyards',
                level: 'vineyard',
                classification: 'single-vineyard',
                parent: 'napa-valley',
                guideFile: 'caymus-vineyards-guide.md',
              },
              {
                slug: 'stags-leap-wine-cellars',
                name: "Stag's Leap Wine Cellars",
                level: 'vineyard',
                classification: 'single-vineyard',
                parent: 'napa-valley',
                guideFile: 'stags-leap-wine-cellars-guide.md',
              },
            ],
          },
          {
            slug: 'sonoma',
            name: 'Sonoma',
            level: 'sub-region',
            parent: 'california',
            guideFile: 'sonoma-guide.md',
          },
          {
            slug: 'central-coast',
            name: 'Central Coast',
            level: 'sub-region',
            parent: 'california',
            guideFile: 'central-coast-guide.md',
          },
          {
            slug: 'paso-robles',
            name: 'Paso Robles',
            level: 'sub-region',
            parent: 'california',
            guideFile: 'paso-robles-guide.md',
          },
          {
            slug: 'santa-barbara',
            name: 'Santa Barbara',
            level: 'sub-region',
            parent: 'california',
            guideFile: 'santa-barbara-guide.md',
          },
        ],
      },
      {
        slug: 'oregon',
        name: 'Oregon',
        level: 'region',
        parent: 'united-states',
        guideFile: 'oregon-guide.md',
        sidebarLinks: [
          { name: 'Willamette Valley', slug: 'willamette-valley' },
        ],
        subRegions: [
          {
            slug: 'willamette-valley',
            name: 'Willamette Valley',
            level: 'sub-region',
            parent: 'oregon',
            guideFile: 'willamette-valley-guide.md',
          },
        ],
      },
      {
        slug: 'washington',
        name: 'Washington',
        level: 'region',
        parent: 'united-states',
        guideFile: 'washington-guide.md',
      },
    ],
  },

  // GERMANY
  {
    slug: 'germany',
    name: 'Germany',
    level: 'country',
    guideFile: 'germany-guide.md',
    sidebarLinks: [
      { name: 'Mosel', slug: 'mosel' },
      { name: 'Rheingau', slug: 'rheingau' },
      { name: 'Pfalz', slug: 'pfalz' },
      { name: 'Rheinhessen', slug: 'rheinhessen' },
    ],
    subRegions: [
      {
        slug: 'mosel',
        name: 'Mosel',
        level: 'region',
        parent: 'germany',
        guideFile: 'mosel-guide.md',
        sidebarLinks: [
          { name: 'Bernkasteler Doctor', slug: 'bernkasteler-doctor', classification: 'grosses-gewachs' },
          { name: 'Wehlener Sonnenuhr', slug: 'wehlener-sonnenuhr', classification: 'grosses-gewachs' },
          { name: 'Erdener Prälat', slug: 'erdener-pralat', classification: 'grosses-gewachs' },
        ],
        subRegions: [
          {
            slug: 'bernkasteler-doctor',
            name: 'Bernkasteler Doctor',
            level: 'vineyard',
            classification: 'grosses-gewachs',
            parent: 'mosel',
            guideFile: 'bernkasteler-doctor-vineyard-guide.md',
          },
          {
            slug: 'wehlener-sonnenuhr',
            name: 'Wehlener Sonnenuhr',
            level: 'vineyard',
            classification: 'grosses-gewachs',
            parent: 'mosel',
            guideFile: 'wehlener-sonnenuhr-vineyard-guide.md',
          },
          {
            slug: 'erdener-pralat',
            name: 'Erdener Prälat',
            level: 'vineyard',
            classification: 'grosses-gewachs',
            parent: 'mosel',
            guideFile: 'erdener-pralat-vineyard-guide.md',
          },
        ],
      },
      {
        slug: 'rheingau',
        name: 'Rheingau',
        level: 'region',
        parent: 'germany',
        guideFile: 'rheingau-guide.md',
        sidebarLinks: [
          { name: 'Rüdesheimer Berg Schlossberg', slug: 'rudesheimer-berg-schlossberg', classification: 'grosses-gewachs' },
          { name: 'Rauenthaler Baiken', slug: 'rauenthaler-baiken', classification: 'grosses-gewachs' },
          { name: 'Erbacher Marcobrunn', slug: 'erbacher-marcobrunn', classification: 'grosses-gewachs' },
        ],
        subRegions: [
          {
            slug: 'rudesheimer-berg-schlossberg',
            name: 'Rüdesheimer Berg Schlossberg',
            level: 'vineyard',
            classification: 'grosses-gewachs',
            parent: 'rheingau',
            guideFile: 'rudesheimer-berg-schlossberg-vineyard-guide.md',
          },
          {
            slug: 'rauenthaler-baiken',
            name: 'Rauenthaler Baiken',
            level: 'vineyard',
            classification: 'grosses-gewachs',
            parent: 'rheingau',
            guideFile: 'rauenthaler-baiken-vineyard-guide.md',
          },
          {
            slug: 'erbacher-marcobrunn',
            name: 'Erbacher Marcobrunn',
            level: 'vineyard',
            classification: 'grosses-gewachs',
            parent: 'rheingau',
            guideFile: 'erbacher-marcobrunn-vineyard-guide.md',
          },
        ],
      },
      {
        slug: 'pfalz',
        name: 'Pfalz',
        level: 'region',
        parent: 'germany',
        guideFile: 'pfalz-guide.md',
      },
      {
        slug: 'rheinhessen',
        name: 'Rheinhessen',
        level: 'region',
        parent: 'germany',
        guideFile: 'rheinhessen-guide.md',
      },
    ],
  },

  // PORTUGAL
  {
    slug: 'portugal',
    name: 'Portugal',
    level: 'country',
    guideFile: 'portugal-guide.md',
    sidebarLinks: [
      { name: 'Douro', slug: 'douro' },
      { name: 'Dão', slug: 'dao' },
      { name: 'Alentejo', slug: 'alentejo' },
      { name: 'Vinho Verde', slug: 'vinho-verde' },
    ],
    subRegions: [
      {
        slug: 'douro',
        name: 'Douro',
        level: 'region',
        parent: 'portugal',
        guideFile: 'douro-guide.md',
        sidebarLinks: [
          { name: 'Quinta do Noval', slug: 'quinta-do-noval', classification: 'single-vineyard' },
          { name: 'Quinta do Crasto', slug: 'quinta-do-crasto', classification: 'single-vineyard' },
          { name: 'Niepoort', slug: 'niepoort', classification: 'single-vineyard' },
          { name: "Taylor's", slug: 'taylors', classification: 'single-vineyard' },
        ],
        subRegions: [
          {
            slug: 'quinta-do-noval',
            name: 'Quinta do Noval',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'douro',
            guideFile: 'quinta-do-noval-guide.md',
          },
          {
            slug: 'quinta-do-crasto',
            name: 'Quinta do Crasto',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'douro',
            guideFile: 'quinta-do-crasto-guide.md',
          },
          {
            slug: 'niepoort',
            name: 'Niepoort',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'douro',
            guideFile: 'niepoort-guide.md',
          },
          {
            slug: 'taylors',
            name: "Taylor's",
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'douro',
            guideFile: 'taylors-guide.md',
          },
        ],
      },
      {
        slug: 'dao',
        name: 'Dão',
        level: 'region',
        parent: 'portugal',
        guideFile: 'dao-guide.md',
      },
      {
        slug: 'alentejo',
        name: 'Alentejo',
        level: 'region',
        parent: 'portugal',
        guideFile: 'alentejo-guide.md',
      },
      {
        slug: 'vinho-verde',
        name: 'Vinho Verde',
        level: 'region',
        parent: 'portugal',
        guideFile: 'vinho-verde-guide.md',
      },
    ],
  },

  // AUSTRALIA
  {
    slug: 'australia',
    name: 'Australia',
    level: 'country',
    guideFile: 'australia-guide.md',
    sidebarLinks: [
      { name: 'Barossa Valley', slug: 'barossa-valley' },
      { name: 'Margaret River', slug: 'margaret-river' },
      { name: 'Yarra Valley', slug: 'yarra-valley' },
      { name: 'Hunter Valley', slug: 'hunter-valley' },
    ],
    subRegions: [
      {
        slug: 'barossa-valley',
        name: 'Barossa Valley',
        level: 'region',
        parent: 'australia',
        guideFile: 'barossa-valley-guide.md',
        sidebarLinks: [
          { name: 'Penfolds Grange', slug: 'penfolds-grange', classification: 'single-vineyard' },
          { name: 'Henschke Hill of Grace', slug: 'henschke-hill-of-grace', classification: 'single-vineyard' },
          { name: 'Torbreck RunRig', slug: 'torbreck-runrig', classification: 'single-vineyard' },
        ],
        subRegions: [
          {
            slug: 'penfolds-grange',
            name: 'Penfolds Grange',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'barossa-valley',
            guideFile: 'penfolds-grange-guide.md',
          },
          {
            slug: 'henschke-hill-of-grace',
            name: 'Henschke Hill of Grace',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'barossa-valley',
            guideFile: 'henschke-hill-of-grace-guide.md',
          },
          {
            slug: 'torbreck-runrig',
            name: 'Torbreck RunRig',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'barossa-valley',
            guideFile: 'torbreck-runrig-guide.md',
          },
        ],
      },
      {
        slug: 'margaret-river',
        name: 'Margaret River',
        level: 'region',
        parent: 'australia',
        guideFile: 'margaret-river-guide.md',
        sidebarLinks: [
          { name: 'Cullen', slug: 'cullen', classification: 'single-vineyard' },
          { name: 'Leeuwin Estate', slug: 'leeuwin-estate', classification: 'single-vineyard' },
          { name: 'Vasse Felix', slug: 'vasse-felix', classification: 'single-vineyard' },
        ],
        subRegions: [
          {
            slug: 'cullen',
            name: 'Cullen',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'margaret-river',
            guideFile: 'cullen-guide.md',
          },
          {
            slug: 'leeuwin-estate',
            name: 'Leeuwin Estate',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'margaret-river',
            guideFile: 'leeuwin-estate-guide.md',
          },
          {
            slug: 'vasse-felix',
            name: 'Vasse Felix',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'margaret-river',
            guideFile: 'vasse-felix-guide.md',
          },
        ],
      },
      {
        slug: 'yarra-valley',
        name: 'Yarra Valley',
        level: 'region',
        parent: 'australia',
        guideFile: 'yarra-valley-guide.md',
        sidebarLinks: [
          { name: 'Yeringberg', slug: 'yeringberg', classification: 'single-vineyard' },
          { name: 'Mount Mary', slug: 'mount-mary', classification: 'single-vineyard' },
        ],
        subRegions: [
          {
            slug: 'yeringberg',
            name: 'Yeringberg',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'yarra-valley',
            guideFile: 'yeringberg-guide.md',
          },
          {
            slug: 'mount-mary',
            name: 'Mount Mary',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'yarra-valley',
            guideFile: 'mount-mary-guide.md',
          },
        ],
      },
      {
        slug: 'hunter-valley',
        name: 'Hunter Valley',
        level: 'region',
        parent: 'australia',
        guideFile: 'hunter-valley-guide.md',
      },
    ],
  },

  // NEW ZEALAND
  {
    slug: 'new-zealand',
    name: 'New Zealand',
    level: 'country',
    guideFile: 'new-zealand-guide.md',
    sidebarLinks: [
      { name: 'Marlborough', slug: 'marlborough' },
      { name: 'Central Otago', slug: 'central-otago' },
      { name: 'Hawke\'s Bay', slug: 'hawkes-bay' },
    ],
    subRegions: [
      {
        slug: 'marlborough',
        name: 'Marlborough',
        level: 'region',
        parent: 'new-zealand',
        guideFile: 'marlborough-guide.md',
        sidebarLinks: [
          { name: 'Cloudy Bay', slug: 'cloudy-bay', classification: 'single-vineyard' },
          { name: 'Greywacke', slug: 'greywacke', classification: 'single-vineyard' },
          { name: 'Fromm', slug: 'fromm', classification: 'single-vineyard' },
        ],
        subRegions: [
          {
            slug: 'cloudy-bay',
            name: 'Cloudy Bay',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'marlborough',
            guideFile: 'cloudy-bay-guide.md',
          },
          {
            slug: 'greywacke',
            name: 'Greywacke',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'marlborough',
            guideFile: 'greywacke-guide.md',
          },
          {
            slug: 'fromm',
            name: 'Fromm',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'marlborough',
            guideFile: 'fromm-guide.md',
          },
        ],
      },
      {
        slug: 'central-otago',
        name: 'Central Otago',
        level: 'region',
        parent: 'new-zealand',
        guideFile: 'central-otago-guide.md',
        sidebarLinks: [
          { name: 'Felton Road', slug: 'felton-road', classification: 'single-vineyard' },
          { name: 'Rippon', slug: 'rippon', classification: 'single-vineyard' },
          { name: 'Mount Difficulty', slug: 'mount-difficulty', classification: 'single-vineyard' },
        ],
        subRegions: [
          {
            slug: 'felton-road',
            name: 'Felton Road',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'central-otago',
            guideFile: 'felton-road-guide.md',
          },
          {
            slug: 'rippon',
            name: 'Rippon',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'central-otago',
            guideFile: 'rippon-guide.md',
          },
          {
            slug: 'mount-difficulty',
            name: 'Mount Difficulty',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'central-otago',
            guideFile: 'mount-difficulty-guide.md',
          },
        ],
      },
      {
        slug: 'hawkes-bay',
        name: 'Hawke\'s Bay',
        level: 'region',
        parent: 'new-zealand',
        guideFile: 'hawkes-bay-guide.md',
      },
    ],
  },

  // ARGENTINA
  {
    slug: 'argentina',
    name: 'Argentina',
    level: 'country',
    guideFile: 'argentina-guide.md',
    sidebarLinks: [
      { name: 'Mendoza', slug: 'mendoza' },
      { name: 'Salta', slug: 'salta' },
    ],
    subRegions: [
      {
        slug: 'mendoza',
        name: 'Mendoza',
        level: 'region',
        parent: 'argentina',
        guideFile: 'mendoza-guide.md',
        sidebarLinks: [
          { name: 'Catena Zapata', slug: 'catena-zapata', classification: 'single-vineyard' },
          { name: 'Achaval Ferrer', slug: 'achaval-ferrer', classification: 'single-vineyard' },
          { name: 'Viña Cobos', slug: 'vina-cobos', classification: 'single-vineyard' },
          { name: 'Zuccardi', slug: 'zuccardi', classification: 'single-vineyard' },
        ],
        subRegions: [
          {
            slug: 'catena-zapata',
            name: 'Catena Zapata',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'mendoza',
            guideFile: 'catena-zapata-guide.md',
          },
          {
            slug: 'achaval-ferrer',
            name: 'Achaval Ferrer',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'mendoza',
            guideFile: 'achaval-ferrer-guide.md',
          },
          {
            slug: 'vina-cobos',
            name: 'Viña Cobos',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'mendoza',
            guideFile: 'vina-cobos-guide.md',
          },
          {
            slug: 'zuccardi',
            name: 'Zuccardi',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'mendoza',
            guideFile: 'zuccardi-guide.md',
          },
        ],
      },
      {
        slug: 'salta',
        name: 'Salta',
        level: 'region',
        parent: 'argentina',
        guideFile: 'salta-guide.md',
      },
    ],
  },

  // CHILE
  {
    slug: 'chile',
    name: 'Chile',
    level: 'country',
    guideFile: 'chile-guide.md',
    sidebarLinks: [
      { name: 'Maipo Valley', slug: 'maipo-valley' },
      { name: 'Colchagua Valley', slug: 'colchagua-valley' },
      { name: 'Casablanca Valley', slug: 'casablanca-valley' },
    ],
    subRegions: [
      {
        slug: 'maipo-valley',
        name: 'Maipo Valley',
        level: 'region',
        parent: 'chile',
        guideFile: 'maipo-valley-guide.md',
        sidebarLinks: [
          { name: 'Concha y Toro Don Melchor', slug: 'concha-y-toro-don-melchor', classification: 'single-vineyard' },
          { name: 'Almaviva', slug: 'almaviva', classification: 'single-vineyard' },
          { name: 'Santa Rita Casa Real', slug: 'santa-rita-casa-real', classification: 'single-vineyard' },
        ],
        subRegions: [
          {
            slug: 'concha-y-toro-don-melchor',
            name: 'Concha y Toro Don Melchor',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'maipo-valley',
            guideFile: 'concha-y-toro-don-melchor-guide.md',
          },
          {
            slug: 'almaviva',
            name: 'Almaviva',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'maipo-valley',
            guideFile: 'almaviva-guide.md',
          },
          {
            slug: 'santa-rita-casa-real',
            name: 'Santa Rita Casa Real',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'maipo-valley',
            guideFile: 'santa-rita-casa-real-guide.md',
          },
        ],
      },
      {
        slug: 'colchagua-valley',
        name: 'Colchagua Valley',
        level: 'region',
        parent: 'chile',
        guideFile: 'colchagua-valley-guide.md',
      },
      {
        slug: 'casablanca-valley',
        name: 'Casablanca Valley',
        level: 'region',
        parent: 'chile',
        guideFile: 'casablanca-valley-guide.md',
      },
    ],
  },

  // SOUTH AFRICA
  {
    slug: 'south-africa',
    name: 'South Africa',
    level: 'country',
    guideFile: 'south-africa-guide.md',
    sidebarLinks: [
      { name: 'Stellenbosch', slug: 'stellenbosch' },
      { name: 'Franschhoek', slug: 'franschhoek' },
      { name: 'Swartland', slug: 'swartland' },
    ],
    subRegions: [
      {
        slug: 'stellenbosch',
        name: 'Stellenbosch',
        level: 'region',
        parent: 'south-africa',
        guideFile: 'stellenbosch-guide.md',
      },
      {
        slug: 'franschhoek',
        name: 'Franschhoek',
        level: 'region',
        parent: 'south-africa',
        guideFile: 'franschhoek-guide.md',
      },
      {
        slug: 'swartland',
        name: 'Swartland',
        level: 'region',
        parent: 'south-africa',
        guideFile: 'swartland-guide.md',
      },
    ],
  },

  // AUSTRIA
  {
    slug: 'austria',
    name: 'Austria',
    level: 'country',
    guideFile: 'austria-guide.md',
    sidebarLinks: [
      { name: 'Wachau', slug: 'wachau' },
      { name: 'Burgenland', slug: 'burgenland' },
    ],
    subRegions: [
      {
        slug: 'wachau',
        name: 'Wachau',
        level: 'region',
        parent: 'austria',
        guideFile: 'wachau-guide.md',
        sidebarLinks: [
          { name: 'Domäne Wachau', slug: 'domane-wachau', classification: 'single-vineyard' },
          { name: 'FX Pichler', slug: 'fx-pichler', classification: 'single-vineyard' },
          { name: 'Prager', slug: 'prager', classification: 'single-vineyard' },
          { name: 'Knoll', slug: 'knoll', classification: 'single-vineyard' },
        ],
        subRegions: [
          {
            slug: 'domane-wachau',
            name: 'Domäne Wachau',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'wachau',
            guideFile: 'domane-wachau-guide.md',
          },
          {
            slug: 'fx-pichler',
            name: 'FX Pichler',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'wachau',
            guideFile: 'fx-pichler-guide.md',
          },
          {
            slug: 'prager',
            name: 'Prager',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'wachau',
            guideFile: 'prager-guide.md',
          },
          {
            slug: 'knoll',
            name: 'Knoll',
            level: 'vineyard',
            classification: 'single-vineyard',
            parent: 'wachau',
            guideFile: 'knoll-guide.md',
          },
        ],
      },
      {
        slug: 'burgenland',
        name: 'Burgenland',
        level: 'region',
        parent: 'austria',
        guideFile: 'burgenland-guide.md',
      },
    ],
  },
];

/**
 * Utility Functions
 */

/**
 * Find a region by its slug (searches all levels of hierarchy)
 */
export function getRegionConfig(slug: string): RegionConfig | null {
  function search(regions: RegionConfig[]): RegionConfig | null {
    for (const region of regions) {
      if (region.slug === slug) {
        return region;
      }
      if (region.subRegions) {
        const found = search(region.subRegions);
        if (found) return found;
      }
    }
    return null;
  }

  return search(REGION_HIERARCHY);
}

/**
 * Get the URL path for a region (e.g., "france/burgundy/chablis")
 */
export function getRegionPath(slug: string): string {
  const region = getRegionConfig(slug);
  if (!region) return '';

  const path: string[] = [slug];
  let currentSlug = region.parent;

  while (currentSlug) {
    const parentRegion = getRegionConfig(currentSlug);
    if (!parentRegion) break;
    path.unshift(currentSlug);
    currentSlug = parentRegion.parent;
  }

  return path.join('/');
}

/**
 * Get all regions, optionally filtered by level
 */
export function getAllRegions(level?: RegionLevel): RegionConfig[] {
  const results: RegionConfig[] = [];

  function collect(regions: RegionConfig[]) {
    for (const region of regions) {
      if (!level || region.level === level) {
        results.push(region);
      }
      if (region.subRegions) {
        collect(region.subRegions);
      }
    }
  }

  collect(REGION_HIERARCHY);
  return results;
}

/**
 * Get all sub-regions of a parent region
 */
export function getSubRegions(parentSlug: string): RegionConfig[] {
  const parent = getRegionConfig(parentSlug);
  return parent?.subRegions || [];
}

/**
 * Get sidebar links for a region
 */
export function getSidebarLinks(regionSlug: string): Array<{ name: string; slug: string }> {
  const region = getRegionConfig(regionSlug);
  return region?.sidebarLinks || [];
}

/**
 * Convert region name to slug (e.g., "Côte de Nuits" -> "cote-de-nuits")
 */
export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Get parent region config
 */
export function getParentRegion(regionSlug: string): RegionConfig | null {
  const region = getRegionConfig(regionSlug);
  if (!region?.parent) return null;
  return getRegionConfig(region.parent);
}

/**
 * Get villages for a sub-region (e.g., Côte de Nuits → villages)
 */
export function getVillages(subRegionSlug: string): RegionConfig[] {
  const subRegion = getRegionConfig(subRegionSlug);
  if (!subRegion) return [];

  const villages = subRegion.subRegions?.filter(r => r.level === 'village') || [];
  return villages;
}

/**
 * Get vineyards for a village, grouped by classification
 */
export function getVineyardsGroupedByClassification(villageSlug: string): {
  grandCru: RegionConfig[];
  premierCru: RegionConfig[];
  village: RegionConfig[];
  other: RegionConfig[];
} {
  const village = getRegionConfig(villageSlug);
  const vineyards = village?.subRegions?.filter(r => r.level === 'vineyard') || [];

  return {
    grandCru: vineyards.filter(v => v.classification === 'grand-cru'),
    premierCru: vineyards.filter(v => v.classification === 'premier-cru'),
    village: vineyards.filter(v => v.classification === 'village'),
    other: vineyards.filter(v =>
      v.classification &&
      !['grand-cru', 'premier-cru', 'village'].includes(v.classification)
    )
  };
}

/**
 * Get the full URL path for a vineyard/climat
 * Example: /regions/france/burgundy/cote-de-nuits/gevrey-chambertin/chambertin
 */
export function getVineyardPath(vineyardSlug: string): string {
  const vineyard = getRegionConfig(vineyardSlug);
  if (!vineyard || vineyard.level !== 'vineyard') return '';

  // Build path by traversing up the hierarchy
  const pathParts: string[] = [];
  let current: RegionConfig | null = vineyard;

  while (current) {
    pathParts.unshift(current.slug);
    current = current.parent ? getRegionConfig(current.parent) : null;
  }

  return `/regions/${pathParts.join('/')}`;
}

/**
 * Group sidebar links by classification (for village pages)
 */
export function groupByClassification(
  links: ReadonlyArray<{ name: string; slug: string; classification?: ClassificationType }>
): {
  grandCru: Array<{ name: string; slug: string }>;
  premierCru: Array<{ name: string; slug: string }>;
  village: Array<{ name: string; slug: string }>;
  premierCruClasse: Array<{ name: string; slug: string }>;
  deuxiemeCruClasse: Array<{ name: string; slug: string }>;
  troisiemeCruClasse: Array<{ name: string; slug: string }>;
  quatriemeCruClasse: Array<{ name: string; slug: string }>;
  cinquiemeCruClasse: Array<{ name: string; slug: string }>;
  premierGrandCruClasseA: Array<{ name: string; slug: string }>;
  premierGrandCruClasseB: Array<{ name: string; slug: string }>;
  mga: Array<{ name: string; slug: string }>;
  grossesGewachs: Array<{ name: string; slug: string }>;
  singleVineyard: Array<{ name: string; slug: string }>;
  other: Array<{ name: string; slug: string }>;
} {
  return {
    grandCru: links.filter(l => l.classification === 'grand-cru').map(({ name, slug }) => ({ name, slug })),
    premierCru: links.filter(l => l.classification === 'premier-cru').map(({ name, slug }) => ({ name, slug })),
    village: links.filter(l => l.classification === 'village').map(({ name, slug }) => ({ name, slug })),
    premierCruClasse: links.filter(l => l.classification === '1er-cru-classe').map(({ name, slug }) => ({ name, slug })),
    deuxiemeCruClasse: links.filter(l => l.classification === '2eme-cru-classe').map(({ name, slug }) => ({ name, slug })),
    troisiemeCruClasse: links.filter(l => l.classification === '3eme-cru-classe').map(({ name, slug }) => ({ name, slug })),
    quatriemeCruClasse: links.filter(l => l.classification === '4eme-cru-classe').map(({ name, slug }) => ({ name, slug })),
    cinquiemeCruClasse: links.filter(l => l.classification === '5eme-cru-classe').map(({ name, slug }) => ({ name, slug })),
    premierGrandCruClasseA: links.filter(l => l.classification === 'premier-grand-cru-classe-a').map(({ name, slug }) => ({ name, slug })),
    premierGrandCruClasseB: links.filter(l => l.classification === 'premier-grand-cru-classe-b').map(({ name, slug }) => ({ name, slug })),
    mga: links.filter(l => l.classification === 'mga').map(({ name, slug }) => ({ name, slug })),
    grossesGewachs: links.filter(l => l.classification === 'grosses-gewachs').map(({ name, slug }) => ({ name, slug })),
    singleVineyard: links.filter(l => l.classification === 'single-vineyard').map(({ name, slug }) => ({ name, slug })),
    other: links.filter(l =>
      l.classification &&
      ![
        'grand-cru',
        'premier-cru',
        'village',
        '1er-cru-classe',
        '2eme-cru-classe',
        '3eme-cru-classe',
        '4eme-cru-classe',
        '5eme-cru-classe',
        'premier-grand-cru-classe-a',
        'premier-grand-cru-classe-b',
        'mga',
        'grosses-gewachs',
        'single-vineyard'
      ].includes(l.classification)
    ).map(({ name, slug }) => ({ name, slug }))
  };
}
