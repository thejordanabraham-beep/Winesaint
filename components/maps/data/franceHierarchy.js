/**
 * France Wine Region Hierarchy
 *
 * Maps all 361 French PDOs into a multi-level hierarchy:
 *   Region → Sub-region → Appellation (→ Grand Cru where applicable)
 *
 * Every PDO name in the GeoJSON must appear exactly once in the
 * `appellations` map below, keyed to its immediate parent.
 */

// Sub-regions grouped under their parent region
export const FRANCE_SUBREGIONS = {
  // ═══════════════════════════════════════════
  // BURGUNDY
  // ═══════════════════════════════════════════
  'Burgundy': [
    'Chablis & Yonne',
    'Côte de Nuits',
    'Côte de Beaune',
    'Côte Chalonnaise',
    'Mâconnais',
    'Regional Burgundy',
  ],

  // ═══════════════════════════════════════════
  // BORDEAUX
  // ═══════════════════════════════════════════
  'Bordeaux': [
    'Médoc',
    'Graves & Pessac-Léognan',
    'Saint-Émilion & Satellites',
    'Pomerol & Fronsac',
    'Entre-deux-Mers & Côtes',
    'Sweet Bordeaux',
    'Regional Bordeaux',
  ],

  // ═══════════════════════════════════════════
  // RHÔNE VALLEY
  // ═══════════════════════════════════════════
  'Rhône Valley': [
    'Northern Rhône',
    'Southern Rhône',
    'Regional Rhône',
  ],

  // ═══════════════════════════════════════════
  // LOIRE VALLEY
  // ═══════════════════════════════════════════
  'Loire Valley': [
    'Pays Nantais',
    'Anjou-Saumur',
    'Touraine',
    'Centre Loire',
    'Upper Loire',
  ],

  // ═══════════════════════════════════════════
  // ALSACE
  // ═══════════════════════════════════════════
  'Alsace': [
    'Alsace Grand Cru',
    'Regional Alsace',
  ],

  // ═══════════════════════════════════════════
  // LANGUEDOC-ROUSSILLON
  // ═══════════════════════════════════════════
  'Languedoc-Roussillon': [
    'Languedoc',
    'Roussillon',
  ],

  // ═══════════════════════════════════════════
  // SOUTH-WEST
  // ═══════════════════════════════════════════
  'South-West': [
    'Bergerac & Duras',
    'Cahors & Lot',
    'Gascony & Basque',
    'Aveyron & Tarn',
  ],

  // Regions with no sub-regions (appellations map directly)
  'Beaujolais': [],
  'Champagne': [],
  'Provence': [],
  'Jura & Savoie': [],
  'Corsica': [],
};

// Top-level regions
export const FRANCE_REGIONS = Object.keys(FRANCE_SUBREGIONS);

/**
 * Every French PDO mapped to its immediate parent.
 * Parent is either a sub-region name or a region name (if no sub-regions).
 */
export const FRANCE_APPELLATIONS = {
  // ═══════════════════════════════════════════════════════════════════
  // BURGUNDY — Chablis & Yonne
  // ═══════════════════════════════════════════════════════════════════
  'Chablis': 'Chablis & Yonne',
  'Chablis grand cru': 'Chablis & Yonne',
  'Petit Chablis': 'Chablis & Yonne',
  'Irancy': 'Chablis & Yonne',
  'Saint-Bris': 'Chablis & Yonne',

  // ═══════════════════════════════════════════════════════════════════
  // BURGUNDY — Côte de Nuits
  // ═══════════════════════════════════════════════════════════════════
  'Marsannay': 'Côte de Nuits',
  'Fixin': 'Côte de Nuits',
  'Gevrey-Chambertin': 'Côte de Nuits',
  'Chambertin': 'Côte de Nuits',
  'Chambertin-Clos de Bèze': 'Côte de Nuits',
  'Chapelle-Chambertin': 'Côte de Nuits',
  'Charmes-Chambertin': 'Côte de Nuits',
  'Griotte-Chambertin': 'Côte de Nuits',
  'Latricières-Chambertin': 'Côte de Nuits',
  'Mazis-Chambertin': 'Côte de Nuits',
  'Mazoyères-Chambertin': 'Côte de Nuits',
  'Ruchottes-Chambertin': 'Côte de Nuits',
  'Morey-Saint-Denis': 'Côte de Nuits',
  'Clos de la Roche': 'Côte de Nuits',
  'Clos Saint-Denis': 'Côte de Nuits',
  'Clos de Tart': 'Côte de Nuits',
  'Clos des Lambrays': 'Côte de Nuits',
  'Chambolle-Musigny': 'Côte de Nuits',
  'Musigny': 'Côte de Nuits',
  'Bonnes-Mares': 'Côte de Nuits',
  'Vougeot': 'Côte de Nuits',
  'Clos de Vougeot / Clos Vougeot': 'Côte de Nuits',
  'Vosne-Romanée': 'Côte de Nuits',
  'Romanée-Conti': 'Côte de Nuits',
  'Romanée-Saint-Vivant': 'Côte de Nuits',
  'Richebourg': 'Côte de Nuits',
  'La Romanée': 'Côte de Nuits',
  'La Tâche': 'Côte de Nuits',
  'La Grande Rue': 'Côte de Nuits',
  'Echezeaux': 'Côte de Nuits',
  'Grands-Echezeaux': 'Côte de Nuits',
  'Nuits-Saint-Georges': 'Côte de Nuits',
  'Côte de Nuits-Villages / Vins fins de la Côte de Nuits': 'Côte de Nuits',

  // ═══════════════════════════════════════════════════════════════════
  // BURGUNDY — Côte de Beaune
  // ═══════════════════════════════════════════════════════════════════
  'Ladoix': 'Côte de Beaune',
  'Aloxe-Corton': 'Côte de Beaune',
  'Corton': 'Côte de Beaune',
  'Corton-Charlemagne': 'Côte de Beaune',
  'Charlemagne': 'Côte de Beaune',
  'Pernand-Vergelesses': 'Côte de Beaune',
  'Chorey-lès-Beaune': 'Côte de Beaune',
  'Savigny-lès-Beaune': 'Côte de Beaune',
  'Beaune': 'Côte de Beaune',
  'Pommard': 'Côte de Beaune',
  'Volnay': 'Côte de Beaune',
  'Monthélie': 'Côte de Beaune',
  'Auxey-Duresses': 'Côte de Beaune',
  'Saint-Romain': 'Côte de Beaune',
  'Meursault': 'Côte de Beaune',
  'Blagny': 'Côte de Beaune',
  'Puligny-Montrachet': 'Côte de Beaune',
  'Chassagne-Montrachet': 'Côte de Beaune',
  'Montrachet': 'Côte de Beaune',
  'Chevalier-Montrachet': 'Côte de Beaune',
  'Bâtard-Montrachet': 'Côte de Beaune',
  'Bienvenues-Bâtard-Montrachet': 'Côte de Beaune',
  'Criots-Bâtard-Montrachet': 'Côte de Beaune',
  'Saint-Aubin': 'Côte de Beaune',
  'Santenay': 'Côte de Beaune',
  'Maranges': 'Côte de Beaune',
  'Côte de Beaune': 'Côte de Beaune',
  'Côte de Beaune-Villages': 'Côte de Beaune',

  // ═══════════════════════════════════════════════════════════════════
  // BURGUNDY — Côte Chalonnaise
  // ═══════════════════════════════════════════════════════════════════
  'Bouzeron': 'Côte Chalonnaise',
  'Rully': 'Côte Chalonnaise',
  'Mercurey': 'Côte Chalonnaise',
  'Givry': 'Côte Chalonnaise',
  'Montagny': 'Côte Chalonnaise',

  // ═══════════════════════════════════════════════════════════════════
  // BURGUNDY — Mâconnais
  // ═══════════════════════════════════════════════════════════════════
  'Mâcon': 'Mâconnais',
  'Pouilly-Fuissé': 'Mâconnais',
  'Pouilly-Loché': 'Mâconnais',
  'Pouilly-Vinzelles': 'Mâconnais',
  'Saint-Véran': 'Mâconnais',
  'Viré-Clessé': 'Mâconnais',

  // ═══════════════════════════════════════════════════════════════════
  // BURGUNDY — Regional
  // ═══════════════════════════════════════════════════════════════════
  'Bourgogne': 'Regional Burgundy',
  'Bourgogne aligoté': 'Regional Burgundy',
  'Bourgogne Passe-tout-grains': 'Regional Burgundy',
  'Bourgogne mousseux': 'Regional Burgundy',
  'Crémant de Bourgogne': 'Regional Burgundy',
  'Coteaux Bourguignons / Bourgogne grand ordinaire / Bourgogne ordinaire': 'Regional Burgundy',

  // ═══════════════════════════════════════════════════════════════════
  // BEAUJOLAIS
  // ═══════════════════════════════════════════════════════════════════
  'Beaujolais': 'Beaujolais',
  'Brouilly': 'Beaujolais',
  'Côte de Brouilly': 'Beaujolais',
  'Chiroubles': 'Beaujolais',
  'Fleurie': 'Beaujolais',
  'Morgon': 'Beaujolais',
  'Moulin-à-Vent': 'Beaujolais',
  'Chénas': 'Beaujolais',
  'Juliénas': 'Beaujolais',
  'Saint-Amour': 'Beaujolais',
  'Régnié': 'Beaujolais',
  'Coteaux du Lyonnais': 'Beaujolais',

  // ═══════════════════════════════════════════════════════════════════
  // BORDEAUX — Médoc
  // ═══════════════════════════════════════════════════════════════════
  'Médoc': 'Médoc',
  'Haut-Médoc': 'Médoc',
  'Margaux': 'Médoc',
  'Pauillac': 'Médoc',
  'Saint-Julien': 'Médoc',
  'Saint-Estèphe': 'Médoc',
  'Listrac-Médoc': 'Médoc',
  'Moulis / Moulis-en-Médoc': 'Médoc',

  // ═══════════════════════════════════════════════════════════════════
  // BORDEAUX — Graves & Pessac-Léognan
  // ═══════════════════════════════════════════════════════════════════
  'Graves': 'Graves & Pessac-Léognan',
  'Graves supérieures': 'Graves & Pessac-Léognan',
  'Pessac-Léognan': 'Graves & Pessac-Léognan',

  // ═══════════════════════════════════════════════════════════════════
  // BORDEAUX — Saint-Émilion & Satellites
  // ═══════════════════════════════════════════════════════════════════
  'Saint-Emilion': 'Saint-Émilion & Satellites',
  'Saint-Emilion Grand Cru': 'Saint-Émilion & Satellites',
  'Lussac Saint-Emilion': 'Saint-Émilion & Satellites',
  'Montagne-Saint-Emilion': 'Saint-Émilion & Satellites',
  'Puisseguin Saint-Emilion': 'Saint-Émilion & Satellites',
  'Saint-Georges-Saint-Emilion': 'Saint-Émilion & Satellites',

  // ═══════════════════════════════════════════════════════════════════
  // BORDEAUX — Pomerol & Fronsac
  // ═══════════════════════════════════════════════════════════════════
  'Pomerol': 'Pomerol & Fronsac',
  'Lalande-de-Pomerol': 'Pomerol & Fronsac',
  'Fronsac': 'Pomerol & Fronsac',
  'Canon Fronsac': 'Pomerol & Fronsac',

  // ═══════════════════════════════════════════════════════════════════
  // BORDEAUX — Entre-deux-Mers & Côtes
  // ═══════════════════════════════════════════════════════════════════
  'Entre-deux-Mers': 'Entre-deux-Mers & Côtes',
  'Côtes de Bordeaux': 'Entre-deux-Mers & Côtes',
  'Côtes de Bordeaux-Saint-Macaire': 'Entre-deux-Mers & Côtes',
  'Premières Côtes de Bordeaux': 'Entre-deux-Mers & Côtes',
  'Blaye': 'Entre-deux-Mers & Côtes',
  'Côtes de Blaye': 'Entre-deux-Mers & Côtes',
  'Bourg / Côtes de Bourg / Bourgeais': 'Entre-deux-Mers & Côtes',
  'Graves de Vayres': 'Entre-deux-Mers & Côtes',
  'Sainte-Foy-Bordeaux': 'Entre-deux-Mers & Côtes',

  // ═══════════════════════════════════════════════════════════════════
  // BORDEAUX — Sweet Bordeaux
  // ═══════════════════════════════════════════════════════════════════
  'Sauternes': 'Sweet Bordeaux',
  'Barsac': 'Sweet Bordeaux',
  'Cérons': 'Sweet Bordeaux',
  'Cadillac': 'Sweet Bordeaux',
  'Loupiac': 'Sweet Bordeaux',
  'Sainte-Croix-du-Mont': 'Sweet Bordeaux',

  // ═══════════════════════════════════════════════════════════════════
  // BORDEAUX — Regional
  // ═══════════════════════════════════════════════════════════════════
  'Bordeaux': 'Regional Bordeaux',
  'Bordeaux supérieur': 'Regional Bordeaux',
  'Crémant de Bordeaux': 'Regional Bordeaux',

  // ═══════════════════════════════════════════════════════════════════
  // RHÔNE VALLEY — Northern Rhône
  // ═══════════════════════════════════════════════════════════════════
  'Côte Rôtie': 'Northern Rhône',
  'Condrieu': 'Northern Rhône',
  'Château-Grillet': 'Northern Rhône',
  'Saint-Joseph': 'Northern Rhône',
  'Hermitage / Ermitage / L\'Hermitage / L\'Ermitage': 'Northern Rhône',
  'Crozes-Hermitage / Crozes-Ermitage': 'Northern Rhône',
  'Cornas': 'Northern Rhône',
  'Saint-Péray': 'Northern Rhône',

  // ═══════════════════════════════════════════════════════════════════
  // RHÔNE VALLEY — Southern Rhône
  // ═══════════════════════════════════════════════════════════════════
  'Châteauneuf-du-Pape': 'Southern Rhône',
  'Gigondas': 'Southern Rhône',
  'Vacqueyras': 'Southern Rhône',
  'Beaumes de Venise': 'Southern Rhône',
  'Muscat de Beaumes-de-Venise': 'Southern Rhône',
  'Vinsobres': 'Southern Rhône',
  'Cairanne': 'Southern Rhône',
  'Rasteau': 'Southern Rhône',
  'Lirac': 'Southern Rhône',
  'Tavel': 'Southern Rhône',
  'Costières de Nîmes': 'Southern Rhône',
  'Clairette de Bellegarde': 'Southern Rhône',
  'Luberon': 'Southern Rhône',
  'Ventoux': 'Southern Rhône',
  'Grignan-les-Adhémar': 'Southern Rhône',
  // Terrasses du Larzac moved to Languedoc section (its correct region)

  // ═══════════════════════════════════════════════════════════════════
  // RHÔNE VALLEY — Regional
  // ═══════════════════════════════════════════════════════════════════
  'Côtes du Rhône': 'Regional Rhône',
  'Côtes du Rhône Villages': 'Regional Rhône',
  'Côtes du Vivarais': 'Regional Rhône',
  'Châtillon-en-Diois': 'Regional Rhône',
  'Clairette de Die': 'Regional Rhône',
  'Coteaux de Die': 'Regional Rhône',
  'Crémant de Die': 'Regional Rhône',

  // ═══════════════════════════════════════════════════════════════════
  // LOIRE VALLEY — Pays Nantais
  // ═══════════════════════════════════════════════════════════════════
  'Muscadet': 'Pays Nantais',
  'Muscadet Sèvre et Maine': 'Pays Nantais',
  'Muscadet Coteaux de la Loire': 'Pays Nantais',
  'Muscadet Côtes de Grandlieu': 'Pays Nantais',
  'Gros Plant du Pays nantais': 'Pays Nantais',
  'Coteaux d\'Ancenis': 'Pays Nantais',
  'Fiefs Vendéens': 'Pays Nantais',

  // ═══════════════════════════════════════════════════════════════════
  // LOIRE VALLEY — Anjou-Saumur
  // ═══════════════════════════════════════════════════════════════════
  'Anjou': 'Anjou-Saumur',
  'Anjou Villages': 'Anjou-Saumur',
  'Anjou Villages Brissac': 'Anjou-Saumur',
  'Anjou-Coteaux de la Loire': 'Anjou-Saumur',
  'Cabernet d\'Anjou': 'Anjou-Saumur',
  'Rosé d\'Anjou': 'Anjou-Saumur',
  'Coteaux de l\'Aubance': 'Anjou-Saumur',
  'Coteaux du Layon': 'Anjou-Saumur',
  'Quarts de Chaume': 'Anjou-Saumur',
  'Bonnezeaux': 'Anjou-Saumur',
  'Savennières': 'Anjou-Saumur',
  'Savennières Coulée de Serrant': 'Anjou-Saumur',
  'Savennières Roche aux Moines': 'Anjou-Saumur',
  'Saumur': 'Anjou-Saumur',
  'Saumur-Champigny': 'Anjou-Saumur',
  'Cabernet de Saumur': 'Anjou-Saumur',
  'Coteaux de Saumur': 'Anjou-Saumur',

  // ═══════════════════════════════════════════════════════════════════
  // LOIRE VALLEY — Touraine
  // ═══════════════════════════════════════════════════════════════════
  'Touraine': 'Touraine',
  'Touraine Noble Joué': 'Touraine',
  'Vouvray': 'Touraine',
  'Montlouis-sur-Loire': 'Touraine',
  'Chinon': 'Touraine',
  'Bourgueil': 'Touraine',
  'Saint-Nicolas-de-Bourgueil': 'Touraine',
  'Cheverny': 'Touraine',
  'Cour-Cheverny': 'Touraine',
  'Valençay': 'Touraine',
  'Coteaux du Vendômois': 'Touraine',
  'Coteaux du Loir': 'Touraine',
  'Jasnières': 'Touraine',
  'Orléans': 'Touraine',
  'Orléans-Cléry': 'Touraine',

  // ═══════════════════════════════════════════════════════════════════
  // LOIRE VALLEY — Centre Loire
  // ═══════════════════════════════════════════════════════════════════
  'Sancerre': 'Centre Loire',
  'Pouilly-Fumé / Blanc Fumé de Pouilly': 'Centre Loire',
  'Pouilly-sur-Loire': 'Centre Loire',
  'Menetou-Salon': 'Centre Loire',
  'Quincy': 'Centre Loire',
  'Reuilly': 'Centre Loire',
  'Coteaux du Giennois': 'Centre Loire',
  'Châteaumeillant': 'Centre Loire',

  // ═══════════════════════════════════════════════════════════════════
  // LOIRE VALLEY — Upper Loire / Regional
  // ═══════════════════════════════════════════════════════════════════
  'Haut-Poitou': 'Upper Loire',
  'Saint-Pourçain': 'Upper Loire',
  'Côtes d\'Auvergne': 'Upper Loire',
  'Côte Roannaise': 'Upper Loire',
  'Côtes du Forez': 'Upper Loire',
  'Rosé de Loire': 'Upper Loire',
  'Crémant de Loire': 'Upper Loire',

  // ═══════════════════════════════════════════════════════════════════
  // CHAMPAGNE
  // ═══════════════════════════════════════════════════════════════════
  'Champagne': 'Champagne',
  'Coteaux champenois': 'Champagne',
  'Rosé des Riceys': 'Champagne',

  // ═══════════════════════════════════════════════════════════════════
  // ALSACE — Grand Cru (51 vineyards)
  // ═══════════════════════════════════════════════════════════════════
  'Alsace grand cru Altenberg de Bergbieten': 'Alsace Grand Cru',
  'Alsace grand cru Altenberg de Bergheim': 'Alsace Grand Cru',
  'Alsace grand cru Altenberg de Wolxheim': 'Alsace Grand Cru',
  'Alsace grand cru Brand': 'Alsace Grand Cru',
  'Alsace grand cru Bruderthal': 'Alsace Grand Cru',
  'Alsace grand cru Eichberg': 'Alsace Grand Cru',
  'Alsace grand cru Engelberg': 'Alsace Grand Cru',
  'Alsace grand cru Florimont': 'Alsace Grand Cru',
  'Alsace grand cru Frankstein': 'Alsace Grand Cru',
  'Alsace grand cru Froehn': 'Alsace Grand Cru',
  'Alsace grand cru Furstentum': 'Alsace Grand Cru',
  'Alsace grand cru Geisberg': 'Alsace Grand Cru',
  'Alsace grand cru Gloeckelberg': 'Alsace Grand Cru',
  'Alsace grand cru Goldert': 'Alsace Grand Cru',
  'Alsace grand cru Hatschbourg': 'Alsace Grand Cru',
  'Alsace grand cru Hengst': 'Alsace Grand Cru',
  'Alsace grand cru Kaefferkopf': 'Alsace Grand Cru',
  'Alsace grand cru Kanzlerberg': 'Alsace Grand Cru',
  'Alsace grand cru Kastelberg': 'Alsace Grand Cru',
  'Alsace grand cru Kessler': 'Alsace Grand Cru',
  'Alsace grand cru Kirchberg de Barr': 'Alsace Grand Cru',
  'Alsace grand cru Kirchberg de Ribeauvillé': 'Alsace Grand Cru',
  'Alsace grand cru Kitterlé': 'Alsace Grand Cru',
  'Alsace grand cru Mambourg': 'Alsace Grand Cru',
  'Alsace grand cru Mandelberg': 'Alsace Grand Cru',
  'Alsace grand cru Marckrain': 'Alsace Grand Cru',
  'Alsace grand cru Moenchberg': 'Alsace Grand Cru',
  'Alsace grand cru Muenchberg': 'Alsace Grand Cru',
  'Alsace grand cru Ollwiller': 'Alsace Grand Cru',
  'Alsace grand cru Osterberg': 'Alsace Grand Cru',
  'Alsace grand cru Pfersigberg': 'Alsace Grand Cru',
  'Alsace grand cru Pfingstberg': 'Alsace Grand Cru',
  'Alsace grand cru Praelatenberg': 'Alsace Grand Cru',
  'Alsace grand cru Rangen': 'Alsace Grand Cru',
  'Alsace grand cru Rosacker': 'Alsace Grand Cru',
  'Alsace grand cru Saering': 'Alsace Grand Cru',
  'Alsace grand cru Schlossberg': 'Alsace Grand Cru',
  'Alsace grand cru Schoenenbourg': 'Alsace Grand Cru',
  'Alsace grand cru Sommerberg': 'Alsace Grand Cru',
  'Alsace grand cru Sonnenglanz': 'Alsace Grand Cru',
  'Alsace grand cru Spiegel': 'Alsace Grand Cru',
  'Alsace grand cru Sporen': 'Alsace Grand Cru',
  'Alsace grand cru Steinert': 'Alsace Grand Cru',
  'Alsace grand cru Steingrubler': 'Alsace Grand Cru',
  'Alsace grand cru Steinklotz': 'Alsace Grand Cru',
  'Alsace grand cru Vorbourg': 'Alsace Grand Cru',
  'Alsace grand cru Wiebelsberg': 'Alsace Grand Cru',
  'Alsace grand cru Wineck-Schlossberg': 'Alsace Grand Cru',
  'Alsace grand cru Winzenberg': 'Alsace Grand Cru',
  'Alsace grand cru Zinnkoepflé': 'Alsace Grand Cru',
  'Alsace grand cru Zotzenberg': 'Alsace Grand Cru',

  // ═══════════════════════════════════════════════════════════════════
  // ALSACE — Regional
  // ═══════════════════════════════════════════════════════════════════
  'Alsace / Vin d\'Alsace': 'Regional Alsace',
  'Crémant d\'Alsace': 'Regional Alsace',

  // ═══════════════════════════════════════════════════════════════════
  // PROVENCE
  // ═══════════════════════════════════════════════════════════════════
  'Côtes de Provence': 'Provence',
  'Coteaux d\'Aix-en-Provence': 'Provence',
  'Coteaux Varois en Provence': 'Provence',
  'Les Baux de Provence': 'Provence',
  'Bandol': 'Provence',
  'Cassis': 'Provence',
  'Bellet / Vin de Bellet': 'Provence',
  'Palette': 'Provence',
  'Pierrevert': 'Provence',

  // ═══════════════════════════════════════════════════════════════════
  // LANGUEDOC-ROUSSILLON — Languedoc
  // ═══════════════════════════════════════════════════════════════════
  'Languedoc': 'Languedoc',
  'La Clape': 'Languedoc',
  'Picpoul de Pinet': 'Languedoc',
  'Terrasses du Larzac': 'Languedoc',
  'Faugères': 'Languedoc',
  'Saint-Chinian': 'Languedoc',
  'Minervois': 'Languedoc',
  'Minervois-la-Livinière': 'Languedoc',
  'Corbières': 'Languedoc',
  'Corbières-Boutenac': 'Languedoc',
  'Fitou': 'Languedoc',
  'Cabardès': 'Languedoc',
  'Malepère': 'Languedoc',
  'Limoux': 'Languedoc',
  'Crémant de Limoux': 'Languedoc',
  'Clairette du Languedoc': 'Languedoc',
  'Muscat de Frontignan / Frontignan / Vin de Frontignan': 'Languedoc',
  'Muscat de Lunel': 'Languedoc',
  'Muscat de Mireval': 'Languedoc',
  'Muscat de Saint-Jean-de-Minervois': 'Languedoc',

  // ═══════════════════════════════════════════════════════════════════
  // LANGUEDOC-ROUSSILLON — Roussillon
  // ═══════════════════════════════════════════════════════════════════
  'Côtes du Roussillon': 'Roussillon',
  'Côtes du Roussillon Villages': 'Roussillon',
  'Collioure': 'Roussillon',
  'Banyuls': 'Roussillon',
  'Banyuls grand cru': 'Roussillon',
  'Maury': 'Roussillon',
  'Rivesaltes': 'Roussillon',
  'Muscat de Rivesaltes': 'Roussillon',
  'Grand Roussillon': 'Roussillon',

  // ═══════════════════════════════════════════════════════════════════
  // SOUTH-WEST — Bergerac & Duras
  // ═══════════════════════════════════════════════════════════════════
  'Bergerac': 'Bergerac & Duras',
  'Côtes de Bergerac': 'Bergerac & Duras',
  'Monbazillac': 'Bergerac & Duras',
  'Pécharmant': 'Bergerac & Duras',
  'Rosette': 'Bergerac & Duras',
  'Saussignac': 'Bergerac & Duras',
  'Montravel': 'Bergerac & Duras',
  'Haut-Montravel': 'Bergerac & Duras',
  'Côtes de Montravel': 'Bergerac & Duras',
  'Côtes de Duras': 'Bergerac & Duras',

  // ═══════════════════════════════════════════════════════════════════
  // SOUTH-WEST — Cahors & Lot
  // ═══════════════════════════════════════════════════════════════════
  'Cahors': 'Cahors & Lot',
  'Coteaux du Quercy': 'Cahors & Lot',
  'Côtes du Marmandais': 'Cahors & Lot',
  'Buzet': 'Cahors & Lot',
  'Brulhois': 'Cahors & Lot',

  // ═══════════════════════════════════════════════════════════════════
  // SOUTH-WEST — Gascony & Basque
  // ═══════════════════════════════════════════════════════════════════
  'Madiran': 'Gascony & Basque',
  'Pacherenc du Vic-Bilh': 'Gascony & Basque',
  'Saint-Mont': 'Gascony & Basque',
  'Jurançon': 'Gascony & Basque',
  'Irouléguy': 'Gascony & Basque',
  'Béarn': 'Gascony & Basque',
  'Tursan': 'Gascony & Basque',
  'Floc de Gascogne': 'Gascony & Basque',
  'Pineau des Charentes': 'Gascony & Basque',

  // ═══════════════════════════════════════════════════════════════════
  // SOUTH-WEST — Aveyron & Tarn
  // ═══════════════════════════════════════════════════════════════════
  'Gaillac': 'Aveyron & Tarn',
  'Gaillac premières côtes': 'Aveyron & Tarn',
  'Fronton': 'Aveyron & Tarn',
  'Marcillac': 'Aveyron & Tarn',
  'Entraygues - Le Fel': 'Aveyron & Tarn',
  'Estaing': 'Aveyron & Tarn',
  'Côtes de Millau': 'Aveyron & Tarn',
  'Saint-Sardos': 'Aveyron & Tarn',

  // ═══════════════════════════════════════════════════════════════════
  // JURA & SAVOIE
  // ═══════════════════════════════════════════════════════════════════
  'Arbois': 'Jura & Savoie',
  'Côtes du Jura': 'Jura & Savoie',
  'Château-Chalon': 'Jura & Savoie',
  'L\'Etoile': 'Jura & Savoie',
  'Crémant du Jura': 'Jura & Savoie',
  'Macvin du Jura': 'Jura & Savoie',
  'Vin de Savoie / Savoie': 'Jura & Savoie',
  'Roussette de Savoie': 'Jura & Savoie',
  'Seyssel': 'Jura & Savoie',
  'Bugey': 'Jura & Savoie',
  'Roussette du Bugey': 'Jura & Savoie',
  'Côtes de Toul': 'Jura & Savoie',
  'Moselle': 'Jura & Savoie',

  // ═══════════════════════════════════════════════════════════════════
  // CORSICA
  // ═══════════════════════════════════════════════════════════════════
  'Corse / Vin de Corse': 'Corsica',
  'Ajaccio': 'Corsica',
  'Patrimonio': 'Corsica',
  'Muscat du Cap Corse': 'Corsica',
};
