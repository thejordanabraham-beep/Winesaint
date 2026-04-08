/**
 * Maps Burgundy Grand Cru names to their parent village appellations.
 * Array values allow a GC to appear under multiple villages (e.g. Bonnes-Mares).
 *
 * GRAND_CRU_VILLAGE_MAP — GCs that have parcel data in burgundy-climats.geojson.
 *   Names must match properties.name in that file exactly.
 *
 * GRAND_CRU_PDO_ONLY_MAP — GCs that only exist as PDO appellations in france.geojson
 *   (no parcel data). These nodes are reparented from their subregion to the village.
 *   Names must match properties.name in france.geojson exactly.
 *
 * HIDDEN_GC_PDO_NAMES — PDO GC entries to suppress from the sidebar entirely.
 */

export const GRAND_CRU_VILLAGE_MAP = {
  // Gevrey-Chambertin
  'Chambertin':               ['Gevrey-Chambertin'],
  'Chambertin-Clos de Bèze':  ['Gevrey-Chambertin'],
  'Chapelle-Chambertin':      ['Gevrey-Chambertin'],
  'Griotte-Chambertin':       ['Gevrey-Chambertin'],
  'Latricières-Chambertin':   ['Gevrey-Chambertin'],
  'Mazis-Chambertin':         ['Gevrey-Chambertin'],
  'Mazoyères-Chambertin':     ['Gevrey-Chambertin'],
  'Ruchottes-Chambertin':     ['Gevrey-Chambertin'],

  // Morey-Saint-Denis
  'Clos de la Roche':  ['Morey-Saint-Denis'],
  'Clos Saint-Denis':  ['Morey-Saint-Denis'],
  'Clos de Tart':      ['Morey-Saint-Denis'],
  'Clos des Lambrays': ['Morey-Saint-Denis'],

  // Bonnes-Mares straddles both communes — appears under both
  'Bonnes-Mares': ['Chambolle-Musigny', 'Morey-Saint-Denis'],

  // Chambolle-Musigny
  'Musigny': ['Chambolle-Musigny'],

  // Vosne-Romanée (includes Flagey-Échézeaux GCs by convention)
  'Romanée-Conti':         ['Vosne-Romanée'],
  'La Tâche':              ['Vosne-Romanée'],
  'Richebourg':            ['Vosne-Romanée'],
  'Romanée-Saint-Vivant':  ['Vosne-Romanée'],
  'La Romanée':            ['Vosne-Romanée'],
  'La Grande Rue':         ['Vosne-Romanée'],
  'Echezeaux':             ['Vosne-Romanée'],
  'Grands-Echezeaux':      ['Vosne-Romanée'],

  // Aloxe-Corton (Corton spans 3 communes but anchored here per user)
  'Corton':             ['Aloxe-Corton'],
  'Corton-Charlemagne': ['Aloxe-Corton'],

  // Charlemagne: excluded by design

  // Gevrey-Chambertin — now has parcel data
  'Charmes-Chambertin': ['Gevrey-Chambertin'],

  // Puligny-Montrachet / Chassagne-Montrachet — now has parcel data
  'Montrachet':                   ['Puligny-Montrachet', 'Chassagne-Montrachet'],
  'Bâtard-Montrachet':            ['Puligny-Montrachet', 'Chassagne-Montrachet'],
  'Chevalier-Montrachet':         ['Puligny-Montrachet'],
  'Bienvenues-Bâtard-Montrachet': ['Puligny-Montrachet'],
  'Criots-Bâtard-Montrachet':     ['Chassagne-Montrachet'],
};

/**
 * PDO-only Grand Crus — exist in france.geojson but NOT in burgundy-climats.geojson.
 * These nodes are physically reparented from their subregion to their village.
 * Names must match properties.name in france.geojson exactly.
 */
export const GRAND_CRU_PDO_ONLY_MAP = {
  // Vougeot — still no parcel data
  'Clos de Vougeot / Clos Vougeot': ['Vougeot'],

  // Chablis — still no parcel data
  'Chablis grand cru': ['Chablis'],
};

/**
 * PDO GC entries to suppress from the sidebar without reparenting.
 * These have no parcel data and no meaningful village parent.
 * Name must match properties.name in france.geojson exactly.
 */
export const HIDDEN_GC_PDO_NAMES = new Set([
  'Charlemagne', // spans multiple communes, excluded per user
]);

/**
 * Redundant regional/catch-all appellations to hide from sidebar and map.
 * These are huge zone polygons that overlap everything and add no geographic value.
 * Names must match properties.name in france.geojson exactly.
 */
export const HIDDEN_APPELLATIONS = new Set([
  // Regional Burgundy — blanket the entire region
  'Bourgogne',
  'Bourgogne aligoté',
  'Bourgogne Passe-tout-grains',
  'Bourgogne mousseux',
  'Crémant de Bourgogne',
  'Coteaux Bourguignons / Bourgogne grand ordinaire / Bourgogne ordinaire',
  // Côte de Beaune — redundant with subregion
  'Côte de Beaune',
  'Côte de Beaune-Villages',
  // Côte de Nuits — multi-village blend
  'Côte de Nuits-Villages / Vins fins de la Côte de Nuits',
  // Mâconnais — covers entire subregion
  'Mâcon',
  // Chablis — same bbox as Chablis, lower classification
  'Petit Chablis',

  // Regional Bordeaux — blanket the entire region
  'Bordeaux',
  'Bordeaux supérieur',
  'Crémant de Bordeaux',
  // Médoc — blanket appellations covering sub-communes
  'Médoc',
  'Haut-Médoc',

  // Regional Alsace — blanket the entire region
  'Alsace / Vin d\'Alsace',
  'Crémant d\'Alsace',

  // Médoc — blanket appellations covering sub-communes
  'Médoc',
  'Haut-Médoc',
  // Graves — Graves/Graves supérieures cover Pessac-Léognan
  'Graves',
  'Graves supérieures',
  // Entre-deux-Mers — Côtes de Bordeaux covers most siblings
  'Côtes de Bordeaux',

  // Regional Alsace — blanket the entire region
  'Alsace / Vin d\'Alsace',
  'Crémant d\'Alsace',

  // Regional Rhône — blanket the entire region
  'Côtes du Rhône',
  'Côtes du Rhône Villages',
  'Clairette de Die',
  'Crémant de Die',
  'Coteaux de Die',
  'Châtillon-en-Diois',
  'Côtes du Vivarais',

  // Loire — region-wide blankets
  'Rosé de Loire',
  'Crémant de Loire',
  // Loire — Pays Nantais blanket (covers 3 sub-Muscadets)
  'Muscadet',
  // Loire — Anjou-Saumur blankets (covers all 16 siblings)
  'Anjou',
  'Cabernet d\'Anjou',
  'Rosé d\'Anjou',
  'Anjou Villages',
  // Loire — Touraine blanket (covers 6/14 siblings)
  'Touraine',

  // Languedoc — blankets entire subregion (16/19 siblings)
  'Languedoc',

  // Roussillon — blankets (cover 7/8 siblings)
  'Grand Roussillon',
  'Muscat de Rivesaltes',
  'Rivesaltes',

  // Champagne — blankets the entire region
  'Champagne',
  'Coteaux champenois',

  // South-West — Bergerac blankets (cover 8/9 siblings)
  'Bergerac',
  'Côtes de Bergerac',

  // Beaujolais — blankets the entire region
  'Beaujolais',

  // ═══════════════════════════════════════════════════════════════════
  // SPAIN — blanket appellations
  // ═══════════════════════════════════════════════════════════════════
  // Castilla-La Mancha — blankets the region
  'La Mancha',
  // Catalonia — blankets the region
  'Cataluña / Catalunya',
  // Canary Islands — blankets the region
  'Islas Canarias',
  // Cava — multi-region sparkling, overlaps most of Catalonia
  'Cava',

  // ════════════════════��════════════════════════════════���═════════════
  // ITALY — blanket appellations
  // ═══════════════════════════════════════════════════════════════════
  // Piedmont — blankets the entire region
  'Piemonte',
  // Piedmont — varietal overlaps within Langhe/Alba
  'Langhe',                    // covers same area as Barolo/Barbaresco
  'Barbera d\'Alba',           // overlaps Langhe & Alba
  'Dolcetto d\'Alba',          // overlaps Langhe & Alba
  'Nebbiolo d\'Alba',          // overlaps Langhe & Alba
  'Alba',                      // overlaps entire Langhe subregion
  // Piedmont — varietal overlaps within Monferrato/Asti
  'Monferrato',                // covers entire Monferrato subregion
  'Barbera del Monferrato',    // overlaps Monferrato
  'Barbera del Monferrato Superiore', // overlaps Monferrato
  // Tuscany — blankets covering subregions
  'Maremma toscana',           // covers entire Maremma subregion
  'Colli dell\'Etruria Centrale', // covers Chianti zone
  'Vin Santo del Chianti',     // overlaps Chianti zone
  'Vin Santo del Chianti Classico', // overlaps Chianti Classico
  // Tuscany — varietal overlaps within Montalcino
  'Rosso di Montalcino',       // same area as Brunello
  'Moscadello di Montalcino',  // same area as Brunello
  'Sant\'Antimo',              // same area as Brunello
  // Tuscany — varietal overlaps within Montepulciano
  'Rosso di Montepulciano',    // same area as Vino Nobile
  'Vin Santo di Montepulciano', // same area as Vino Nobile
  // Tuscany — varietal overlaps within Bolgheri
  'Val di Cornia',             // overlaps Bolgheri coast
  'Val di Cornia Rosso / Rosso della Val di Cornia', // overlaps Bolgheri coast
  // Veneto — multi-region blankets
  'delle Venezie / Beneških okolišev',
  'Prosecco',                  // covers Prosecco & Treviso subregion
  // Veneto — varietal overlaps
  'Valpolicella',              // same area as Amarone/Ripasso
  'Recioto della Valpolicella', // same area as Amarone
  'Bardolino',                 // overlaps with Bardolino Superiore
  'Soave',                     // overlaps with Soave Superiore
  'Recioto di Soave',          // same area as Soave
  'Recioto di Gambellara',     // same area as Gambellara
  'Colli Euganei',             // covers entire Padova subregion area
  // Lombardy — blankets Oltrepò
  'Oltrepò Pavese',
  'Oltrepò Pavese Pinot grigio', // varietal overlap
  'Oltrepò Pavese metodo classico', // varietal overlap
  // Friuli — blankets the entire region
  'Friuli / Friuli Venezia Giulia / Furlanija / Furlanija Julijska krajina',
  // Emilia-Romagna — blankets Romagna
  'Romagna',
  // Sicily — blankets the entire island
  'Sicilia',
  // Puglia — blankets
  'Aleatico di Puglia',
  'Negroamaro di Terra d\'Otranto', // covers Salento
  'Terra d\'Otranto',          // covers Salento
  // Lazio — blankets
  'Castelli Romani',
  'Roma',                      // covers entire Castelli Romani area
  // Abruzzo — blankets the entire region
  'Abruzzo',
  'Montepulciano d\'Abruzzo',  // covers most of the region
  'Trebbiano d\'Abruzzo',      // covers most of the region
  'Cerasuolo d\'Abruzzo',      // covers most of the region
  // Umbria — varietal overlaps
  'Montefalco',                // overlaps with Montefalco Sagrantino
  'Rosso Orvietano / Orvietano Rosso', // overlaps Orvieto
  // Trentino-Alto Adige — varietal blanket
  'Trentino',                  // covers entire Trentino half

  // ═══════════════════════════════════════════════════════════════════
  // UNITED STATES — blanket AVAs
  // ═══════════════════════════════════════════════════════════════════
  // California — large umbrella AVAs that blanket subregions
  'North Coast',           // covers Napa, Sonoma, Mendocino, Lake County
  'Central Coast',         // covers Paso Robles, Santa Ynez, Monterey, San Benito, SLO
  'South Coast',           // covers Temecula, Malibu, etc.
  'Sierra Foothills',      // covers El Dorado, Fiddletown, etc.
  'San Francisco Bay',     // covers Livermore, Santa Clara, etc.
  // Oregon — umbrella AVAs
  'Willamette Valley',     // covers most Oregon sub-AVAs
  'Southern Oregon',       // covers Umpqua, Rogue, Applegate
  // Washington — umbrella AVAs
  'Columbia Valley',       // covers most WA sub-AVAs
  'Yakima Valley',         // covers Rattlesnake Hills, Red Mountain, etc.
  'Walla Walla Valley',   // covers The Rocks District
  // ═══════════════════════════════════════════════════════════════════
  // AUSTRALIA — blanket GIs
  // ═══════════════════════════════════════════════════════════════════
  // Standalone zones with no children or just administrative wrappers
  'Western Plains',                    // NSW — no wine regions inside
  'Eastern Plains, Inland And North Of Western Australia', // WA — no wine regions
  'West Australian South East Coastal', // WA — no wine regions
  'Central Western Australia',          // WA — no wine regions

  // Multi-state — huge overlapping AVAs
  'Ozark Mountain',        // AR/MO/OK
  'Upper Mississippi River Valley', // IA/IL/MN/WI
  'Ohio River Valley',     // IN/KY/OH/WV
  'Lake Erie',             // NY/OH/PA
  'Appalachian High Country', // NC/TN/VA
  'Cumberland Valley',     // MD/PA

  // ═══════════════════════════════════════════════════════════════════
  // GERMANY — single-vineyard PDOs (redundant with Einzellagen data)
  // ═══════════════════════════════════════════════════════════════════
  'Uhlen Blaufüsser Lay / Uhlen Blaufüßer Lay',
  'Uhlen Laubach',
  'Uhlen Roth Lay',
  'Monzinger Niederberg',
  'Würzburger Stein-Berg',
  'Bürgstadter Berg',
]);
