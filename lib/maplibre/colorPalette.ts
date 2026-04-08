// Region-specific colors for countries with hierarchy
// Each top-level region gets a distinct hue so overlapping areas are distinguishable
export const REGION_COLORS = {
  france: {
    'Alsace': '#c47f00',             // deep amber gold
    'Beaujolais': '#b52b5e',         // deep rose
    'Bordeaux': '#6b0f1e',           // deep claret
    'Burgundy': '#8b2252',           // rich plum (fallback)
    'Champagne': '#a07800',          // dark champagne gold
    'Corsica': '#1a6b5a',            // deep teal
    'Jura & Savoie': '#3d7030',      // deep forest green
    'Languedoc-Roussillon': '#a83a10', // deep terracotta
    'Loire Valley': '#1a5fa0',       // deep sky blue
    'Provence': '#6b3d9e',           // deep lavender
    'Rhône Valley': '#8b1a1a',       // deep red
    'South-West': '#8b4a10',         // deep amber
  },
  italy: {
    'Piedmont':              '#7a1a2a',  // deep garnet
    'Tuscany':               '#8b4513',  // saddle brown
    'Veneto':                '#1a6b5a',  // deep teal
    'Lombardy':              '#4a6b2a',  // olive
    'Friuli Venezia Giulia': '#2a5fa0',  // slate blue
    'Trentino-Alto Adige':   '#3d7030',  // forest green
    'Emilia-Romagna':        '#b52b5e',  // deep rose
    'Campania':              '#c47f00',  // amber gold
    'Sicily':                '#a83a10',  // terracotta
    'Sardinia':              '#1a6b90',  // ocean blue
    'Puglia':                '#8b1a1a',  // deep red
    'Abruzzo':               '#6b3d9e',  // deep lavender
    'Lazio':                 '#a07800',  // dark gold
    'Umbria':                '#5a3570',  // deep purple
    'Marche':                '#2a6050',  // dark teal
    'Calabria':              '#8a2a20',  // deep brick
    'Basilicata':            '#6b0f1e',  // deep claret
    'Molise':                '#5c3a1e',  // dark umber
    'Liguria':               '#1a5fa0',  // deep sky blue
    'Valle d\'Aosta':        '#6b5a30',  // bronze
  },
  spain: {
    'Castilla-La Mancha':  '#c47f00',  // saffron gold
    'Castilla y León':     '#8b1a1a',  // deep red
    'Catalonia':           '#6b0f1e',  // deep claret
    'Andalusia':           '#a07800',  // dark gold
    'Aragon':              '#8b4513',  // saddle brown
    'Galicia':             '#1a6b90',  // ocean blue
    'Navarra':             '#3d7030',  // forest green
    'Valencia':            '#a83a10',  // terracotta
    'Murcia':              '#b52b5e',  // deep rose
    'Basque Country':      '#2a5fa0',  // slate blue
    'Canary Islands':      '#1a6b5a',  // deep teal
    'Balearic Islands':    '#6b3d9e',  // deep lavender
    'Rioja':               '#7a1a2a',  // deep garnet
    'Madrid':              '#5a3570',  // deep purple
    'Extremadura':         '#8a2a20',  // deep brick
    'Asturias':            '#5c3a1e',  // dark umber
  },
  portugal: {
    'Douro & Porto':       '#7a1a2a',  // deep garnet
    'Minho':               '#3d7030',  // forest green
    'Trás-os-Montes':      '#5c3a1e',  // dark umber
    'Beiras':              '#8b4513',  // saddle brown
    'Lisboa':              '#1a5fa0',  // deep sky blue
    'Tejo':                '#a07800',  // dark gold
    'Setúbal Peninsula':   '#6b3d9e',  // deep lavender
    'Alentejo':            '#a83a10',  // terracotta
    'Algarve':             '#c47f00',  // amber gold
    'Madeira':             '#8b1a1a',  // deep red
    'Azores':              '#1a6b90',  // ocean blue
  },
  hungary: {
    'Tokaj':                           '#c47f00',  // amber gold
    'Eger & Northern Hungary':         '#8b1a1a',  // deep red
    'Balaton':                         '#1a6b90',  // ocean blue
    'Villány & Southern Transdanubia': '#7a1a2a',  // deep garnet
    'Duna (Great Plain)':              '#a07800',  // dark gold
    'Northern Transdanubia':           '#3d7030',  // forest green
    'Somló':                           '#6b3d9e',  // deep lavender
  },
  romania: {
    'Moldavia':            '#8b1a1a',  // deep red
    'Muntenia & Oltenia':  '#7a1a2a',  // deep garnet
    'Transylvania':        '#3d7030',  // forest green
    'Dobrogea':            '#1a6b90',  // ocean blue
    'Banat':               '#a83a10',  // terracotta
    'Crişana':             '#c47f00',  // amber gold
  },
  croatia: {
    'Continental Croatia': '#3d7030',  // forest green
    'Istria & Kvarner':    '#1a6b90',  // ocean blue
    'Dalmatia':            '#8b1a1a',  // deep red
  },
  slovenia: {
    'Primorska':  '#c47f00',  // amber gold
    'Podravje':   '#3d7030',  // forest green
    'Posavje':    '#8b1a1a',  // deep red
  },
  'czech-republic': {
    'Moravia':  '#8b1a1a',  // deep red
    'Bohemia':  '#3d7030',  // forest green
  },
  slovakia: {
    'Western Slovakia':            '#8b1a1a',  // deep red
    'Central & Eastern Slovakia':  '#c47f00',  // amber gold
  },
  cyprus: {
    'Limassol':            '#8b1a1a',  // deep red
    'Paphos':              '#c47f00',  // amber gold
    'Troodos Mountains':   '#3d7030',  // forest green
  },
  'new-zealand': {
    'North Island':  '#3d7030',  // forest green
    'South Island':  '#1a5fa0',  // deep blue
  },
  chile: {
    'Atacama':        '#c47f00',  // amber gold
    'Coquimbo':       '#a83a10',  // terracotta
    'Aconcagua':      '#3d7030',  // forest green
    'Central Valley': '#8b1a1a',  // deep red
    'Rapel Valley':   '#6b3d9e',  // deep lavender
    'Southern':       '#1a5fa0',  // deep blue
  },
  argentina: {
    'Mendoza':              '#8b1a1a',  // deep red
    'Valles Calchaquíes':   '#c47f00',  // amber gold
    'San Juan':             '#1a6b5a',  // deep teal
    'La Rioja':             '#a83a10',  // terracotta
    'Catamarca':            '#6b3d9e',  // deep lavender
    'Patagonia':            '#1a5fa0',  // deep blue
  },
  germany: {
    'Ahr':                  '#8b1a1a',  // deep red
    'Baden':                '#3d7030',  // forest green
    'Franken':              '#c47f00',  // amber gold
    'Hessische Bergstraße': '#1a6b5a',  // deep teal
    'Mittelrhein':          '#1a5fa0',  // deep blue
    'Mosel':                '#6b3d9e',  // deep lavender
    'Nahe':                 '#a83a10',  // terracotta
    'Pfalz':                '#8b4513',  // saddle brown
    'Rheingau':             '#b52b5e',  // deep rose
    'Rheinhessen':          '#4a6b2a',  // olive
    'Saale-Unstrut':        '#1a6b90',  // ocean blue
    'Württemberg':          '#8b2252',  // rich plum
    'Sachsen':              '#5a5a5a',  // neutral gray
  },
  austria: {
    'Niederösterreich':  '#3d7030',  // forest green
    'Burgenland':        '#8b1a1a',  // deep red
    'Steiermark':        '#1a5fa0',  // deep blue
    'Wien & Other':      '#c47f00',  // amber gold
  },
  greece: {
    'Macedonia':                  '#8b1a1a',  // deep red
    'Peloponnese':                '#3d7030',  // forest green
    'Crete':                      '#c47f00',  // amber gold
    'Aegean Islands':             '#1a5fa0',  // deep blue
    'Thessaly & Central Greece':  '#6b3d9e',  // deep lavender
    'Epirus & Ionian':            '#a83a10',  // terracotta
  },
  bulgaria: {
    'Thracian Lowlands':  '#8b1a1a',  // deep red
    'Danubian Plain':     '#3d7030',  // forest green
    'Black Sea':          '#1a5fa0',  // deep blue
    'Struma Valley':      '#c47f00',  // amber gold
  },
  'south-africa': {
    'Western Cape':    '#8b1a1a',  // deep red
    'Northern Cape':   '#c47f00',  // amber gold
    'KwaZulu-Natal':   '#3d7030',  // forest green
  },
  australia: {
    'South Australia':    '#8b1a1a',  // deep red
    'Victoria':           '#3d7030',  // forest green
    'New South Wales':    '#1a5fa0',  // deep blue
    'Western Australia':  '#c47f00',  // amber gold
    'Tasmania':           '#6b3d9e',  // deep lavender
    'Queensland':         '#a83a10',  // terracotta
  },
  'united-states': {
    'California':      '#8b4513',  // saddle brown
    'Oregon':          '#3d7030',  // forest green
    'Washington':      '#1a5fa0',  // deep blue
    'New York':        '#6b3d9e',  // deep lavender
    'Virginia':        '#8b1a1a',  // deep red
    'Texas':           '#c47f00',  // amber gold
    'Other States':    '#5a5a5a',  // neutral gray
  },
};

// Subregion-level colors — richer for light basemap
export const SUBREGION_COLORS = {
  france: {
    // Burgundy
    'fr-subregion-chablis-yonne':       '#1a5fa0',  // deep blue
    'fr-subregion-cote-de-nuits':       '#8b1a1a',  // deep red
    'fr-subregion-cote-de-beaune':      '#a07800',  // dark gold
    'fr-subregion-cote-chalonnaise':    '#1a6b5a',  // deep teal
    'fr-subregion-maconnais':           '#3d7030',  // deep green
    'fr-subregion-regional-burgundy':   '#5a3570',  // deep purple
    // Bordeaux
    'fr-subregion-medoc':               '#7a1020',  // deep crimson
    'fr-subregion-graves-pessac-leognan': '#5c3a1e', // dark umber
    'fr-subregion-saint-emilion-satellites': '#8b1a3a', // garnet
    'fr-subregion-pomerol-fronsac':     '#6b2040',  // dark plum
    'fr-subregion-entre-deux-mers-cotes': '#4a6b2a', // olive
    'fr-subregion-sweet-bordeaux':      '#b8860b',  // dark goldenrod
    'fr-subregion-regional-bordeaux':   '#4a1a2e',  // dark wine
    // Rhône Valley
    'fr-subregion-northern-rhone':      '#8b2020',  // dark red
    'fr-subregion-southern-rhone':      '#a03030',  // warm red
    'fr-subregion-regional-rhone':      '#6b3030',  // muted red
    // Loire Valley
    'fr-subregion-pays-nantais':        '#1a6b90',  // ocean blue
    'fr-subregion-anjou-saumur':        '#2a5fa0',  // slate blue
    'fr-subregion-touraine':            '#1a7a60',  // teal
    'fr-subregion-centre-loire':        '#3a7a30',  // green
    'fr-subregion-upper-loire':         '#2a6050',  // dark teal
    // Alsace
    'fr-subregion-alsace-grand-cru':    '#c47f00',  // amber gold
    'fr-subregion-regional-alsace':     '#9a6a00',  // dark amber
    // Languedoc-Roussillon
    'fr-subregion-languedoc':           '#a83a10',  // terracotta
    'fr-subregion-roussillon':          '#8a2a20',  // deep brick
    // Champagne
    'fr-subregion-montagne-de-reims':   '#b8860b',  // dark gold
    'fr-subregion-vallee-de-la-marne':  '#a07800',  // champagne gold
    'fr-subregion-cote-des-blancs':     '#c9a96e',  // light gold
    'fr-subregion-cote-de-sezanne':     '#8a7a40',  // muted gold
    'fr-subregion-cote-des-bar':        '#6b5a30',  // bronze
    'fr-subregion-regional-champagne':  '#5a4a20',  // dark bronze
    // South-West
    'fr-subregion-bergerac-duras':      '#7a4a10',  // warm brown
    'fr-subregion-cahors-lot':          '#5a3a20',  // dark earth
    'fr-subregion-gascony-basque':      '#9a5a10',  // golden brown
    'fr-subregion-aveyron-tarn':        '#6a5030',  // dusty brown
  },
  italy: {
    // Piedmont
    'it-subregion-langhe-alba':           '#7a1a2a',  // deep garnet
    'it-subregion-monferrato-asti':       '#9a2040',  // ruby
    'it-subregion-roero':                 '#6b1020',  // dark claret
    'it-subregion-alto-piemonte':         '#5a2030',  // dark burgundy
    'it-subregion-tortona-alessandria':   '#8a3050',  // mulberry
    'it-subregion-turin-canavese':        '#4a1a30',  // dark plum
    'it-subregion-regional-piedmont':     '#3a1020',  // very dark garnet
    // Tuscany — distinct hues per zone
    'it-subregion-chianti-zone':          '#8b1a1a',  // deep red (Chianti heartland)
    'it-subregion-montalcino':            '#5a3570',  // deep purple (Brunello)
    'it-subregion-montepulciano':         '#c47f00',  // amber gold (Vino Nobile)
    'it-subregion-bolgheri-coast':        '#1a5fa0',  // deep blue (coastal Super Tuscans)
    'it-subregion-maremma':               '#3d7030',  // forest green
    'it-subregion-lucca-pistoia':         '#8b4513',  // saddle brown
    'it-subregion-central-eastern-tuscany': '#1a6b5a', // deep teal
    // Veneto — distinct hues per zone
    'it-subregion-valpolicella-verona':   '#8b1a1a',  // deep red (Amarone)
    'it-subregion-soave-gambellara':      '#c47f00',  // amber gold
    'it-subregion-prosecco-treviso':      '#3d7030',  // forest green
    'it-subregion-padova-colli-euganei':  '#6b3d9e',  // deep lavender
    'it-subregion-piave-eastern-veneto':  '#1a5fa0',  // deep blue
    'it-subregion-lake-garda-veneto':     '#a83a10',  // terracotta
    // Lombardy — distinct hues
    'it-subregion-franciacorta-brescia':  '#c47f00',  // amber gold
    'it-subregion-oltrepo-pavese':        '#8b1a1a',  // deep red
    'it-subregion-valtellina':            '#1a6b5a',  // deep teal
    'it-subregion-other-lombardy':        '#3d7030',  // forest green
    // Friuli Venezia Giulia — distinct hues
    'it-subregion-collio-isonzo':         '#c47f00',  // amber gold
    'it-subregion-colli-orientali':       '#1a5fa0',  // deep blue
    'it-subregion-friuli-plains':         '#3d7030',  // forest green
    // Emilia-Romagna — distinct hues
    'it-subregion-bologna-romagna':       '#8b1a1a',  // deep red
    'it-subregion-emilia-lambrusco':      '#6b3d9e',  // deep lavender
    // Puglia — distinct hues
    'it-subregion-salento':               '#8b1a1a',  // deep red
    'it-subregion-central-puglia':        '#c47f00',  // amber gold
    'it-subregion-northern-puglia':       '#1a6b5a',  // deep teal
    // Sicily — distinct hues
    'it-subregion-western-sicily':        '#c47f00',  // amber gold
    'it-subregion-eastern-sicily':        '#8b1a1a',  // deep red
    'it-subregion-islands-pantelleria':   '#1a5fa0',  // deep blue
    // Sardinia — distinct hues
    'it-subregion-gallura-northern-sardinia': '#c47f00', // amber gold
    'it-subregion-central-southern-sardinia': '#1a6b5a', // deep teal
    // Campania — distinct hues
    'it-subregion-irpinia-avellino':      '#8b1a1a',  // deep red (Taurasi)
    'it-subregion-coastal-campania':      '#1a5fa0',  // deep blue
    'it-subregion-sannio-caserta':        '#c47f00',  // amber gold
    // Lazio — distinct hues
    'it-subregion-castelli-romani-frascati': '#c47f00', // amber gold
    'it-subregion-northern-lazio':        '#3d7030',  // forest green
    'it-subregion-southern-lazio':        '#8b1a1a',  // deep red
  },
  spain: {
    // Castilla-La Mancha
    'es-subregion-central-la-mancha':         '#c47f00',  // saffron gold
    'es-subregion-pagos-de-castilla-la-mancha': '#d49f20', // light saffron
    // Castilla y León
    'es-subregion-duero-valley':              '#8b1a1a',  // deep red
    'es-subregion-western-castilla-y-leon':   '#7b2a2a',  // muted red
    'es-subregion-pagos-de-castilla-y-leon':  '#6b1010',  // dark red
  },
  'united-states': {
    // California subregions
    'us-subregion-napa-valley':        '#7a1a2a',  // deep garnet
    'us-subregion-sonoma':             '#8b2252',  // rich plum
    'us-subregion-mendocino':          '#3d7030',  // forest green
    'us-subregion-lake-county':        '#1a6b5a',  // deep teal
    'us-subregion-central-coast':      '#1a5fa0',  // deep blue
    'us-subregion-paso-robles':        '#2a5fa0',  // slate blue
    'us-subregion-santa-ynez-valley':  '#6b3d9e',  // deep lavender
    'us-subregion-monterey':           '#1a6b90',  // ocean blue
    'us-subregion-san-benito':         '#0a5b80',  // dark ocean blue
    'us-subregion-san-francisco-bay':  '#4a6b2a',  // olive
    'us-subregion-sierra-foothills':   '#a83a10',  // terracotta
    'us-subregion-lodi':               '#c47f00',  // amber gold
    'us-subregion-south-coast':        '#b52b5e',  // deep rose
    'us-subregion-other-california':   '#8b4a10',  // deep amber
    // Oregon subregions
    'us-subregion-willamette-valley':  '#2a6b30',  // rich green
    'us-subregion-southern-oregon':    '#5a7b3a',  // sage
    'us-subregion-other-oregon':       '#1a5b20',  // dark green
    // Washington subregions
    'us-subregion-yakima-valley':      '#1a4f90',  // dark blue
    'us-subregion-walla-walla-valley': '#2a3fa0',  // indigo
    'us-subregion-greater-columbia-valley': '#3a6fb0', // medium blue
    'us-subregion-other-washington':   '#0a3f80',  // navy
  },
};

// Country color assignments for map polygons
export const COUNTRY_COLORS = {
  france: '#e74c3c',
  italy: '#2ecc71',
  spain: '#f39c12',
  germany: '#3498db',
  portugal: '#e67e22',
  austria: '#9b59b6',
  greece: '#1abc9c',
  hungary: '#e91e63',
  'united-states': '#c9a96e',
  croatia: '#607d8b',
  slovenia: '#4caf50',
  romania: '#673ab7',
  bulgaria: '#f44336',
  'czech-republic': '#ff8a80',
  slovakia: '#80cbc4',
  luxembourg: '#ffcc80',
  cyprus: '#ce93d8',
  australia: '#00bcd4',
  'new-zealand': '#8bc34a',
  chile: '#ff5722',
  argentina: '#ff9800',
  'south-africa': '#795548',
};

// Ordered list for the sidebar toggle — only countries with data
export const COUNTRIES = [
  // Major European wine countries
  { id: 'france', name: 'France (361 PDOs)', color: COUNTRY_COLORS.france },
  { id: 'italy', name: 'Italy (408 PDOs)', color: COUNTRY_COLORS.italy },
  { id: 'spain', name: 'Spain (99 DOs)', color: COUNTRY_COLORS.spain },
  { id: 'germany', name: 'Germany (19 PDOs)', color: COUNTRY_COLORS.germany },
  { id: 'portugal', name: 'Portugal (30 PDOs)', color: COUNTRY_COLORS.portugal },
  { id: 'austria', name: 'Austria (24 PDOs)', color: COUNTRY_COLORS.austria },
  { id: 'greece', name: 'Greece (33 PDOs)', color: COUNTRY_COLORS.greece },
  { id: 'hungary', name: 'Hungary (33 PDOs)', color: COUNTRY_COLORS.hungary },
  // Eastern & Central Europe
  { id: 'romania', name: 'Romania (40 PDOs)', color: COUNTRY_COLORS.romania },
  { id: 'bulgaria', name: 'Bulgaria (52 PDOs)', color: COUNTRY_COLORS.bulgaria },
  { id: 'croatia', name: 'Croatia (18 PDOs)', color: COUNTRY_COLORS.croatia },
  { id: 'slovenia', name: 'Slovenia (14 PDOs)', color: COUNTRY_COLORS.slovenia },
  { id: 'czech-republic', name: 'Czech Republic (11 PDOs)', color: COUNTRY_COLORS['czech-republic'] },
  { id: 'slovakia', name: 'Slovakia (8 PDOs)', color: COUNTRY_COLORS.slovakia },
  { id: 'cyprus', name: 'Cyprus (7 PDOs)', color: COUNTRY_COLORS.cyprus },
  { id: 'luxembourg', name: 'Luxembourg (1 PDO)', color: COUNTRY_COLORS.luxembourg },
  // New World
  { id: 'united-states', name: 'United States (276 AVAs)', color: COUNTRY_COLORS['united-states'] },
  { id: 'australia', name: 'Australia (106 GIs)', color: COUNTRY_COLORS.australia },
  { id: 'new-zealand', name: 'New Zealand (16 GIs)', color: COUNTRY_COLORS['new-zealand'] },
  { id: 'south-africa', name: 'South Africa (38 WOs)', color: COUNTRY_COLORS['south-africa'] },
  { id: 'chile', name: 'Chile (22 DOs)', color: COUNTRY_COLORS.chile },
  { id: 'argentina', name: 'Argentina (25 GIs)', color: COUNTRY_COLORS.argentina },
];
