/**
 * Italy Wine Region Hierarchy
 *
 * Maps all 408 Italian PDOs into a multi-level hierarchy:
 *   Region → Sub-region (where applicable) → Appellation
 *
 * Italy's 20 administrative wine regions, with subregions for the major ones.
 * Every PDO name in the GeoJSON must appear exactly once in ITALY_APPELLATIONS.
 */

// Sub-regions grouped under their parent region
export const ITALY_SUBREGIONS = {
  // ═══════════════════════════════════════════
  // PIEDMONT — Italy's most complex wine region
  // ═══════════════════════════════════════════
  'Piedmont': [
    'Langhe & Alba',
    'Monferrato & Asti',
    'Roero',
    'Alto Piemonte',
    'Tortona & Alessandria',
    'Turin & Canavese',
    'Regional Piedmont',
  ],

  // ═══════════════════════════════════════════
  // TUSCANY
  // ═══════════════════════════════════════════
  'Tuscany': [
    'Chianti Zone',
    'Montalcino',
    'Montepulciano',
    'Bolgheri & Coast',
    'Maremma',
    'Lucca & Pistoia',
    'Central & Eastern Tuscany',
  ],

  // ═══════════════════════════════════════════
  // VENETO
  // ═══════════════════════════════════════════
  'Veneto': [
    'Valpolicella & Verona',
    'Soave & Gambellara',
    'Prosecco & Treviso',
    'Padova & Colli Euganei',
    'Piave & Eastern Veneto',
    'Lake Garda Veneto',
  ],

  // ═══════════════════════════════════════════
  // LOMBARDY
  // ═══════════════════════════════════════════
  'Lombardy': [
    'Franciacorta & Brescia',
    'Oltrepò Pavese',
    'Valtellina',
    'Other Lombardy',
  ],

  // ═══════════════════════════════════════════
  // FRIULI VENEZIA GIULIA
  // ═══════════════════════════════════════════
  'Friuli Venezia Giulia': [
    'Collio & Isonzo',
    'Colli Orientali',
    'Friuli Plains',
  ],

  // ═══════════════════════════════════════════
  // EMILIA-ROMAGNA
  // ═══════════════════════════════════════════
  'Emilia-Romagna': [
    'Bologna & Romagna',
    'Emilia & Lambrusco',
  ],

  // ═══════════════════════════════════════════
  // PUGLIA
  // ═══════════════════════════════════════════
  'Puglia': [
    'Salento',
    'Central Puglia',
    'Northern Puglia',
  ],

  // ═══════════════════════════════════════════
  // SICILY
  // ═══════════════════════════════════════════
  'Sicily': [
    'Western Sicily',
    'Eastern Sicily',
    'Islands & Pantelleria',
  ],

  // ═══════════════════════════════════════════
  // SARDINIA
  // ═══════════════════════════════════════════
  'Sardinia': [
    'Gallura & Northern Sardinia',
    'Central & Southern Sardinia',
  ],

  // ═══════════════════════════════════════════
  // CAMPANIA
  // ═══════════════════════════════════════════
  'Campania': [
    'Irpinia & Avellino',
    'Coastal Campania',
    'Sannio & Caserta',
  ],

  // ═══════════════════════════════════════════
  // LAZIO
  // ═══════════════════════════════════════════
  'Lazio': [
    'Castelli Romani & Frascati',
    'Northern Lazio',
    'Southern Lazio',
  ],

  // Regions with no sub-regions (appellations map directly)
  'Trentino-Alto Adige': [],
  'Umbria': [],
  'Marche': [],
  'Abruzzo': [],
  'Calabria': [],
  'Basilicata': [],
  'Molise': [],
  'Liguria': [],
  'Valle d\'Aosta': [],
};

// Top-level regions
export const ITALY_REGIONS = Object.keys(ITALY_SUBREGIONS);

/**
 * Every Italian PDO mapped to its immediate parent.
 * Parent is either a sub-region name or a region name (if no sub-regions).
 */
export const ITALY_APPELLATIONS = {
  // ═══════════════════════════════════════════════════════════════════
  // PIEDMONT — Langhe & Alba
  // ═══════════════════════════════════════════════════════════════════
  'Barolo': 'Langhe & Alba',
  'Barbaresco': 'Langhe & Alba',
  'Langhe': 'Langhe & Alba',
  'Alba': 'Langhe & Alba',
  'Nebbiolo d\'Alba': 'Langhe & Alba',
  'Barbera d\'Alba': 'Langhe & Alba',
  'Dolcetto d\'Alba': 'Langhe & Alba',
  'Dolcetto di Diano d\'Alba / Diano d\'Alba': 'Langhe & Alba',
  'Verduno Pelaverga / Verduno': 'Langhe & Alba',
  'Dogliani': 'Langhe & Alba',

  // PIEDMONT — Monferrato & Asti
  'Barbera d\'Asti': 'Monferrato & Asti',
  'Nizza': 'Monferrato & Asti',
  'Asti': 'Monferrato & Asti',
  'Monferrato': 'Monferrato & Asti',
  'Barbera del Monferrato': 'Monferrato & Asti',
  'Barbera del Monferrato Superiore': 'Monferrato & Asti',
  'Grignolino d\'Asti': 'Monferrato & Asti',
  'Grignolino del Monferrato Casalese': 'Monferrato & Asti',
  'Freisa d\'Asti': 'Monferrato & Asti',
  'Freisa di Chieri': 'Monferrato & Asti',
  'Ruchè di Castagnole Monferrato': 'Monferrato & Asti',
  'Malvasia di Casorzo d\'Asti / Malvasia di Casorzo / Casorzo': 'Monferrato & Asti',
  'Malvasia di Castelnuovo Don Bosco': 'Monferrato & Asti',
  'Loazzolo': 'Monferrato & Asti',
  'Cisterna d\'Asti': 'Monferrato & Asti',
  'Gabiano': 'Monferrato & Asti',
  'Rubino di Cantavenna': 'Monferrato & Asti',
  'Terre Alfieri': 'Monferrato & Asti',
  'Calosso': 'Monferrato & Asti',
  'Strevi': 'Monferrato & Asti',
  'Dolcetto d\'Asti': 'Monferrato & Asti',

  // PIEDMONT — Roero
  'Roero': 'Roero',

  // PIEDMONT — Alto Piemonte
  'Gattinara': 'Alto Piemonte',
  'Ghemme': 'Alto Piemonte',
  'Boca': 'Alto Piemonte',
  'Bramaterra': 'Alto Piemonte',
  'Lessona': 'Alto Piemonte',
  'Fara': 'Alto Piemonte',
  'Sizzano': 'Alto Piemonte',
  'Colline Novaresi': 'Alto Piemonte',
  'Coste della Sesia': 'Alto Piemonte',
  'Valli Ossolane': 'Alto Piemonte',

  // PIEDMONT — Tortona & Alessandria
  'Colli Tortonesi': 'Tortona & Alessandria',
  'Dolcetto d\'Acqui': 'Tortona & Alessandria',
  'Dolcetto di Ovada': 'Tortona & Alessandria',
  'Dolcetto di Ovada Superiore / Ovada': 'Tortona & Alessandria',
  'Cortese dell\'Alto Monferrato': 'Tortona & Alessandria',
  'Gavi / Cortese di Gavi': 'Tortona & Alessandria',
  'Brachetto d\'Acqui / Acqui': 'Tortona & Alessandria',

  // PIEDMONT — Turin & Canavese
  'Erbaluce di Caluso / Caluso': 'Turin & Canavese',
  'Carema': 'Turin & Canavese',
  'Canavese': 'Turin & Canavese',
  'Collina Torinese': 'Turin & Canavese',
  'Pinerolese': 'Turin & Canavese',
  'Valsusa': 'Turin & Canavese',

  // PIEDMONT — Regional
  'Piemonte': 'Regional Piedmont',
  'Alta Langa': 'Regional Piedmont',
  'Colline Saluzzesi': 'Regional Piedmont',
  'Albugnano': 'Regional Piedmont',

  // ═══════════════════════════════════════════════════════════════════
  // TUSCANY — Chianti Zone
  // ═══════════════════════════════════════════════════════════════════
  'Chianti': 'Chianti Zone',
  'Chianti Classico': 'Chianti Zone',
  'Vin Santo del Chianti': 'Chianti Zone',
  'Vin Santo del Chianti Classico': 'Chianti Zone',
  'Colli dell\'Etruria Centrale': 'Chianti Zone',

  // TUSCANY — Montalcino
  'Brunello di Montalcino': 'Montalcino',
  'Rosso di Montalcino': 'Montalcino',
  'Moscadello di Montalcino': 'Montalcino',
  'Sant\'Antimo': 'Montalcino',

  // TUSCANY — Montepulciano
  'Vino Nobile di Montepulciano': 'Montepulciano',
  'Rosso di Montepulciano': 'Montepulciano',
  'Vin Santo di Montepulciano': 'Montepulciano',

  // TUSCANY — Bolgheri & Coast
  'Bolgheri': 'Bolgheri & Coast',
  'Bolgheri Sassicaia': 'Bolgheri & Coast',
  'Val di Cornia': 'Bolgheri & Coast',
  'Val di Cornia Rosso / Rosso della Val di Cornia': 'Bolgheri & Coast',
  'Suvereto': 'Bolgheri & Coast',
  'Elba': 'Bolgheri & Coast',
  'Elba Aleatico Passito / Aleatico Passito dell\'Elba': 'Bolgheri & Coast',

  // TUSCANY — Maremma
  'Maremma toscana': 'Maremma',
  'Morellino di Scansano': 'Maremma',
  'Montecucco': 'Maremma',
  'Montecucco Sangiovese': 'Maremma',
  'Sovana': 'Maremma',
  'Capalbio': 'Maremma',
  'Parrina': 'Maremma',
  'Ansonica Costa dell\'Argentario': 'Maremma',
  'Bianco di Pitigliano': 'Maremma',

  // TUSCANY — Lucca & Pistoia
  'Colline Lucchesi': 'Lucca & Pistoia',
  'Montecarlo': 'Lucca & Pistoia',
  'Valdinievole': 'Lucca & Pistoia',
  'Candia dei Colli Apuani': 'Lucca & Pistoia',

  // TUSCANY — Central & Eastern
  'Vernaccia di San Gimignano': 'Central & Eastern Tuscany',
  'San Gimignano': 'Central & Eastern Tuscany',
  'Carmignano': 'Central & Eastern Tuscany',
  'Barco Reale di Carmignano': 'Central & Eastern Tuscany',
  'Vin Santo di Carmignano': 'Central & Eastern Tuscany',
  'Pomino': 'Central & Eastern Tuscany',
  'Cortona': 'Central & Eastern Tuscany',
  'Valdichiana toscana': 'Central & Eastern Tuscany',
  'Val d\'Arno di Sopra / Valdarno di Sopra': 'Central & Eastern Tuscany',
  'Val d\'Arbia': 'Central & Eastern Tuscany',
  'Orcia': 'Central & Eastern Tuscany',
  'Grance Senesi': 'Central & Eastern Tuscany',
  'Terre di Casole': 'Central & Eastern Tuscany',
  'Terre di Pisa': 'Central & Eastern Tuscany',
  'Terratico di Bibbona': 'Central & Eastern Tuscany',
  'Monteregio di Massa Marittima': 'Central & Eastern Tuscany',
  'Montescudaio': 'Central & Eastern Tuscany',
  'Bianco dell\'Empolese': 'Central & Eastern Tuscany',
  'San Torpè': 'Central & Eastern Tuscany',

  // ═══════════════════════════════════════════════════════════════════
  // VENETO — Valpolicella & Verona
  // ═══════════════════════════════════════════════════════════════════
  'Amarone della Valpolicella': 'Valpolicella & Verona',
  'Valpolicella': 'Valpolicella & Verona',
  'Valpolicella Ripasso': 'Valpolicella & Verona',
  'Recioto della Valpolicella': 'Valpolicella & Verona',
  'Bardolino': 'Valpolicella & Verona',
  'Bardolino Superiore': 'Valpolicella & Verona',
  'Bianco di Custoza / Custoza': 'Valpolicella & Verona',
  'Valdadige / Etschtaler': 'Valpolicella & Verona',
  'Valdadige Terradeiforti / Terradeiforti': 'Valpolicella & Verona',
  'Arcole': 'Valpolicella & Verona',

  // VENETO — Soave & Gambellara
  'Soave': 'Soave & Gambellara',
  'Soave Superiore': 'Soave & Gambellara',
  'Recioto di Soave': 'Soave & Gambellara',
  'Gambellara': 'Soave & Gambellara',
  'Recioto di Gambellara': 'Soave & Gambellara',
  'Lessini Durello / Durello Lessini': 'Soave & Gambellara',
  'Monti Lessini': 'Soave & Gambellara',

  // VENETO — Prosecco & Treviso
  'Prosecco': 'Prosecco & Treviso',
  'Conegliano Valdobbiadene - Prosecco / Valdobbiadene - Prosecco / Conegliano - Prosecco': 'Prosecco & Treviso',
  'Colli Asolani - Prosecco / Asolo - Prosecco': 'Prosecco & Treviso',
  'Asolo Montello / Montello Asolo': 'Prosecco & Treviso',
  'Montello Rosso / Montello': 'Prosecco & Treviso',
  'Colli di Conegliano': 'Prosecco & Treviso',

  // VENETO — Padova & Colli Euganei
  'Colli Euganei': 'Padova & Colli Euganei',
  'Colli Euganei Fior d\'Arancio / Fior d\'Arancio Colli Euganei': 'Padova & Colli Euganei',
  'Colli Berici': 'Padova & Colli Euganei',
  'Vicenza': 'Padova & Colli Euganei',
  'Breganze': 'Padova & Colli Euganei',
  'Corti Benedettine del Padovano': 'Padova & Colli Euganei',
  'Bagnoli di Sopra / Bagnoli': 'Padova & Colli Euganei',
  'Bagnoli Friularo / Friularo di Bagnoli': 'Padova & Colli Euganei',
  'Riviera del Brenta': 'Padova & Colli Euganei',
  'Merlara': 'Padova & Colli Euganei',

  // VENETO — Piave & Eastern Veneto
  'Piave': 'Piave & Eastern Veneto',
  'Piave Malanotte / Malanotte del Piave': 'Piave & Eastern Veneto',
  'Lison': 'Piave & Eastern Veneto',
  'Lison-Pramaggiore': 'Piave & Eastern Veneto',
  'Venezia': 'Piave & Eastern Veneto',
  'Vigneti della Serenissima / Serenissima': 'Piave & Eastern Veneto',

  // VENETO — Lake Garda
  'Lugana': 'Lake Garda Veneto',
  'Garda': 'Lake Garda Veneto',
  'San Martino della Battaglia': 'Lake Garda Veneto',

  // ═══════════════════════════════════════════════════════════════════
  // LOMBARDY — Franciacorta & Brescia
  // ═══════════════════════════════════════════════════════════════════
  'Franciacorta': 'Franciacorta & Brescia',
  'Curtefranca': 'Franciacorta & Brescia',
  'Cellatica': 'Franciacorta & Brescia',
  'Botticino': 'Franciacorta & Brescia',
  'Capriano del Colle': 'Franciacorta & Brescia',
  'Riviera del Garda Bresciano / Garda Bresciano': 'Franciacorta & Brescia',
  'Valtènesi': 'Franciacorta & Brescia',
  'Garda Colli Mantovani': 'Franciacorta & Brescia',
  'Lambrusco Mantovano': 'Franciacorta & Brescia',

  // LOMBARDY — Oltrepò Pavese
  'Oltrepò Pavese': 'Oltrepò Pavese',
  'Oltrepò Pavese metodo classico': 'Oltrepò Pavese',
  'Bonarda dell\'Oltrepò Pavese': 'Oltrepò Pavese',
  'Buttafuoco dell\'Oltrepò Pavese / Buttafuoco': 'Oltrepò Pavese',
  'Sangue di Giuda / Sangue di Giuda dell\'Oltrepò Pavese': 'Oltrepò Pavese',
  'Pinot nero dell\'Oltrepò Pavese': 'Oltrepò Pavese',
  'Oltrepò Pavese Pinot grigio': 'Oltrepò Pavese',
  'Casteggio': 'Oltrepò Pavese',
  'San Colombano al Lambro / San Colombano': 'Oltrepò Pavese',

  // LOMBARDY — Valtellina
  'Valtellina Superiore': 'Valtellina',
  'Sforzato di Valtellina / Sfursat di Valtellina': 'Valtellina',
  'Valtellina rosso / Rosso di Valtellina': 'Valtellina',

  // LOMBARDY — Other
  'Scanzo / Moscato di Scanzo': 'Other Lombardy',
  'Terre del Colleoni / Colleoni': 'Other Lombardy',
  'Valcalepio': 'Other Lombardy',

  // ═══════════════════════════════════════════════════════════════════
  // FRIULI VENEZIA GIULIA — Collio & Isonzo
  // ═══════════════════════════════════════════════════════════════════
  'Collio Goriziano / Collio': 'Collio & Isonzo',
  'Friuli Isonzo / Isonzo del Friuli': 'Collio & Isonzo',
  'Carso / Carso - Kras': 'Collio & Isonzo',

  // FRIULI — Colli Orientali
  'Friuli Colli Orientali': 'Colli Orientali',
  'Colli Orientali del Friuli Picolit': 'Colli Orientali',
  'Ramandolo': 'Colli Orientali',
  'Rosazzo': 'Colli Orientali',

  // FRIULI — Plains
  'Friuli / Friuli Venezia Giulia / Furlanija / Furlanija Julijska krajina': 'Friuli Plains',
  'Friuli Grave': 'Friuli Plains',
  'Friuli Annia': 'Friuli Plains',
  'Friuli Aquileia': 'Friuli Plains',
  'Friuli Latisana': 'Friuli Plains',

  // ═══════════════════════════════════════════════════════════════════
  // EMILIA-ROMAGNA — Bologna & Romagna
  // ═══════════════════════════════════════════════════════════════════
  'Romagna Albana': 'Bologna & Romagna',
  'Romagna': 'Bologna & Romagna',
  'Colli Bolognesi': 'Bologna & Romagna',
  'Colli Bolognesi Classico Pignoletto': 'Bologna & Romagna',
  'Colli d\'Imola': 'Bologna & Romagna',
  'Colli di Faenza': 'Bologna & Romagna',
  'Colli di Rimini': 'Bologna & Romagna',
  'Colli Romagna centrale': 'Bologna & Romagna',
  'Reno': 'Bologna & Romagna',

  // EMILIA-ROMAGNA — Emilia & Lambrusco
  'Lambrusco di Sorbara': 'Emilia & Lambrusco',
  'Lambrusco Grasparossa di Castelvetro': 'Emilia & Lambrusco',
  'Lambrusco Salamino di Santa Croce': 'Emilia & Lambrusco',
  'Modena / di Modena': 'Emilia & Lambrusco',
  'Reggiano': 'Emilia & Lambrusco',
  'Colli di Parma': 'Emilia & Lambrusco',
  'Colli Piacentini': 'Emilia & Lambrusco',
  'Colli di Scandiano e di Canossa': 'Emilia & Lambrusco',
  'Gutturnio': 'Emilia & Lambrusco',
  'Ortrugo dei Colli Piacentini / Ortrugo – Colli Piacentini': 'Emilia & Lambrusco',
  'Bosco Eliceo': 'Emilia & Lambrusco',

  // ═══════════════════════════════════════════════════════════════════
  // PUGLIA — Salento
  // ═══════════════════════════════════════════════════════════════════
  'Primitivo di Manduria': 'Salento',
  'Primitivo di Manduria Dolce Naturale': 'Salento',
  'Salice Salentino': 'Salento',
  'Negroamaro di Terra d\'Otranto': 'Salento',
  'Terra d\'Otranto': 'Salento',
  'Copertino': 'Salento',
  'Leverano': 'Salento',
  'Nardò': 'Salento',
  'Squinzano': 'Salento',
  'Alezio': 'Salento',
  'Galatina': 'Salento',
  'Matino': 'Salento',
  'Brindisi': 'Salento',

  // PUGLIA — Central
  'Gioia del Colle': 'Central Puglia',
  'Locorotondo': 'Central Puglia',
  'Martina / Martina Franca': 'Central Puglia',
  'Ostuni': 'Central Puglia',
  'Gravina': 'Central Puglia',
  'Colline Joniche Tarantine': 'Central Puglia',
  'Lizzano': 'Central Puglia',
  'Aleatico di Puglia': 'Central Puglia',

  // PUGLIA — Northern
  'Castel del Monte': 'Northern Puglia',
  'Castel del Monte Bombino Nero': 'Northern Puglia',
  'Castel del Monte Nero di Troia Riserva': 'Northern Puglia',
  'Castel del Monte Rosso Riserva': 'Northern Puglia',
  'Barletta': 'Northern Puglia',
  'San Severo': 'Northern Puglia',
  'Cacc\'e mmitte di Lucera': 'Northern Puglia',
  'Orta Nova': 'Northern Puglia',
  'Rosso di Cerignola': 'Northern Puglia',
  'Moscato di Trani': 'Northern Puglia',
  'Tavoliere delle Puglie / Tavoliere': 'Northern Puglia',

  // ═══════════════════════════════════════════════════════════════════
  // SICILY — Western
  // ═══════════════════════════════════════════════════════════════════
  'Marsala': 'Western Sicily',
  'Alcamo': 'Western Sicily',
  'Erice': 'Western Sicily',
  'Contea di Sclafani / Valledolmo-Contea di Sclafani': 'Western Sicily',
  'Contessa Entellina': 'Western Sicily',
  'Delia Nivolelli': 'Western Sicily',
  'Menfi': 'Western Sicily',
  'Monreale': 'Western Sicily',
  'Salaparuta': 'Western Sicily',
  'Sambuca di Sicilia': 'Western Sicily',
  'Santa Margherita di Belice': 'Western Sicily',
  'Sciacca': 'Western Sicily',
  'Riesi': 'Western Sicily',

  // SICILY — Eastern
  'Etna': 'Eastern Sicily',
  'Faro': 'Eastern Sicily',
  'Cerasuolo di Vittoria': 'Eastern Sicily',
  'Mamertino / Mamertino di Milazzo': 'Eastern Sicily',
  'Eloro': 'Eastern Sicily',
  'Noto': 'Eastern Sicily',
  'Siracusa': 'Eastern Sicily',
  'Vittoria': 'Eastern Sicily',
  'Sicilia': 'Eastern Sicily',

  // SICILY — Islands
  'Pantelleria / Moscato di Pantelleria / Passito di Pantelleria': 'Islands & Pantelleria',
  'Malvasia delle Lipari': 'Islands & Pantelleria',

  // ═══════════════════════════════════════════════════════════════════
  // SARDINIA — Gallura & Northern
  // ═══════════════════════════════════════════════════════════════════
  'Vermentino di Gallura': 'Gallura & Northern Sardinia',
  'Alghero': 'Gallura & Northern Sardinia',
  'Moscato di Sorso / Moscato di Sennori / Moscato di Sorso - Sennori': 'Gallura & Northern Sardinia',

  // SARDINIA — Central & Southern
  'Cannonau di Sardegna': 'Central & Southern Sardinia',
  'Vermentino di Sardegna': 'Central & Southern Sardinia',
  'Monica di Sardegna': 'Central & Southern Sardinia',
  'Moscato di Sardegna': 'Central & Southern Sardinia',
  'Nuragus di Cagliari': 'Central & Southern Sardinia',
  'Cagliari': 'Central & Southern Sardinia',
  'Sardegna Semidano': 'Central & Southern Sardinia',
  'Girò di Cagliari': 'Central & Southern Sardinia',
  'Nasco di Cagliari': 'Central & Southern Sardinia',
  'Vernaccia di Oristano': 'Central & Southern Sardinia',
  'Malvasia di Bosa': 'Central & Southern Sardinia',
  'Mandrolisai': 'Central & Southern Sardinia',
  'Campidano di Terralba / Terralba': 'Central & Southern Sardinia',
  'Carignano del Sulcis': 'Central & Southern Sardinia',
  'Arborea': 'Central & Southern Sardinia',

  // ═══════════════════════════════════════════════════════════════════
  // CAMPANIA — Irpinia & Avellino
  // ═══════════════════════════════════════════════════════════════════
  'Taurasi': 'Irpinia & Avellino',
  'Fiano di Avellino': 'Irpinia & Avellino',
  'Greco di Tufo': 'Irpinia & Avellino',
  'Irpinia': 'Irpinia & Avellino',

  // CAMPANIA — Coastal
  'Costa d\'Amalfi': 'Coastal Campania',
  'Penisola Sorrentina': 'Coastal Campania',
  'Capri': 'Coastal Campania',
  'Ischia': 'Coastal Campania',
  'Campi Flegrei': 'Coastal Campania',
  'Vesuvio': 'Coastal Campania',

  // CAMPANIA — Sannio & Caserta
  'Aglianico del Taburno': 'Sannio & Caserta',
  'Falanghina del Sannio': 'Sannio & Caserta',
  'Sannio': 'Sannio & Caserta',
  'Falerno del Massico': 'Sannio & Caserta',
  'Galluccio': 'Sannio & Caserta',
  'Aversa': 'Sannio & Caserta',
  'Casavecchia di Pontelatone': 'Sannio & Caserta',
  'Castel San Lorenzo': 'Sannio & Caserta',
  'Cilento': 'Sannio & Caserta',

  // ═══════════════════════════════════════════════════════════════════
  // LAZIO — Castelli Romani & Frascati
  // ═══════════════════════════════════════════════════════════════════
  'Frascati': 'Castelli Romani & Frascati',
  'Frascati Superiore': 'Castelli Romani & Frascati',
  'Cannellino di Frascati': 'Castelli Romani & Frascati',
  'Castelli Romani': 'Castelli Romani & Frascati',
  'Colli Albani': 'Castelli Romani & Frascati',
  'Colli Lanuvini': 'Castelli Romani & Frascati',
  'Marino': 'Castelli Romani & Frascati',
  'Montecompatri Colonna / Montecompatri / Colonna': 'Castelli Romani & Frascati',
  'Velletri': 'Castelli Romani & Frascati',
  'Zagarolo': 'Castelli Romani & Frascati',
  'Roma': 'Castelli Romani & Frascati',
  'Genazzano': 'Castelli Romani & Frascati',
  'Cori': 'Castelli Romani & Frascati',

  // LAZIO — Northern
  'Est! Est!! Est!!! di Montefiascone': 'Northern Lazio',
  'Colli Etruschi Viterbesi / Tuscia': 'Northern Lazio',
  'Aleatico di Gradoli': 'Northern Lazio',
  'Vignanello': 'Northern Lazio',
  'Bianco Capena': 'Northern Lazio',
  'Colli della Sabina': 'Northern Lazio',
  'Tarquinia': 'Northern Lazio',
  'Cerveteri': 'Northern Lazio',
  'Nettuno': 'Northern Lazio',

  // LAZIO — Southern
  'Cesanese del Piglio / Piglio': 'Southern Lazio',
  'Cesanese di Affile / Affile': 'Southern Lazio',
  'Cesanese di Olevano Romano / Olevano Romano': 'Southern Lazio',
  'Atina': 'Southern Lazio',
  'Circeo': 'Southern Lazio',
  'Terracina / Moscato di Terracina': 'Southern Lazio',
  'Aprilia': 'Southern Lazio',

  // ═══════════════════════════════════════════════════════════════════
  // TRENTINO-ALTO ADIGE (no subregions)
  // ═══════════════════════════════════════════════════════════════════
  'Alto Adige / dell\'Alto Adige / Südtirol / Südtiroler': 'Trentino-Alto Adige',
  'Trentino': 'Trentino-Alto Adige',
  'Trento': 'Trentino-Alto Adige',
  'Teroldego Rotaliano': 'Trentino-Alto Adige',
  'Casteller': 'Trentino-Alto Adige',
  'Lago di Caldaro / Kalterersee / Caldaro / Kalterer': 'Trentino-Alto Adige',

  // ═══════════════════════════════════════════════════════════════════
  // UMBRIA (no subregions)
  // ═══════════════════════════════════════════════════════════════════
  'Montefalco Sagrantino': 'Umbria',
  'Montefalco': 'Umbria',
  'Torgiano Rosso Riserva': 'Umbria',
  'Torgiano': 'Umbria',
  'Orvieto': 'Umbria',
  'Amelia': 'Umbria',
  'Assisi': 'Umbria',
  'Colli Altotiberini': 'Umbria',
  'Colli del Trasimeno / Trasimeno': 'Umbria',
  'Colli Martani': 'Umbria',
  'Colli Perugini': 'Umbria',
  'Lago di Corbara': 'Umbria',
  'Rosso Orvietano / Orvietano Rosso': 'Umbria',
  'Spoleto': 'Umbria',
  'Todi': 'Umbria',

  // ═══════════════════════════════════════════════════════════════════
  // MARCHE (no subregions)
  // ═══════════════════════════════════════════════════════════════════
  'Verdicchio dei Castelli di Jesi': 'Marche',
  'Castelli di Jesi Verdicchio Riserva': 'Marche',
  'Verdicchio di Matelica': 'Marche',
  'Verdicchio di Matelica Riserva': 'Marche',
  'Offida': 'Marche',
  'Terre di Offida': 'Marche',
  'Rosso Cònero': 'Marche',
  'Cònero': 'Marche',
  'Rosso Piceno / Piceno': 'Marche',
  'Lacrima di Morro / Lacrima di Morro d\'Alba': 'Marche',
  'Bianchello del Metauro': 'Marche',
  'Colli Maceratesi': 'Marche',
  'Colli Pesaresi': 'Marche',
  'Esino': 'Marche',
  'Falerio': 'Marche',
  'I Terreni di Sanseverino': 'Marche',
  'Pergola': 'Marche',
  'San Ginesio': 'Marche',
  'Serrapetrona': 'Marche',
  'Vernaccia di Serrapetrona': 'Marche',

  // ═══════════════════════════════════════════════════════════════════
  // ABRUZZO (no subregions)
  // ═══════════════════════════════════════════════════════════════════
  'Montepulciano d\u2019Abruzzo': 'Abruzzo',
  'Montepulciano d\'Abruzzo Colline Teramane': 'Abruzzo',
  'Trebbiano d\'Abruzzo': 'Abruzzo',
  'Cerasuolo d\'Abruzzo': 'Abruzzo',
  'Abruzzo': 'Abruzzo',
  'Controguerra': 'Abruzzo',
  'Terre Tollesi / Tullum': 'Abruzzo',
  'Villamagna': 'Abruzzo',
  'Ortona': 'Abruzzo',

  // ═══════════════════════════════════════════════════════════════════
  // CALABRIA (no subregions)
  // ═══════════════════════════════════════════════════════════════════
  'Cirò': 'Calabria',
  'Greco di Bianco': 'Calabria',
  'Lamezia': 'Calabria',
  'Melissa': 'Calabria',
  'Bivongi': 'Calabria',
  'Savuto': 'Calabria',
  'Scavigna': 'Calabria',
  'Terre di Cosenza': 'Calabria',
  'S. Anna di Isola Capo Rizzuto': 'Calabria',

  // ═══════════════════════════════════════════════════════════════════
  // BASILICATA (no subregions)
  // ═══════════════════════════════════════════════════════════════════
  'Aglianico del Vulture': 'Basilicata',
  'Aglianico del Vulture Superiore': 'Basilicata',
  'Grottino di Roccanova': 'Basilicata',
  'Terre dell\'Alta Val d\'Agri': 'Basilicata',
  'Matera': 'Basilicata',

  // ═══════════════════════════════════════════════════════════════════
  // MOLISE (no subregions)
  // ═══════════════════════════════════════════════════════════════════
  'Molise / del Molise': 'Molise',
  'Biferno': 'Molise',
  'Tintilia del Molise': 'Molise',
  'Pentro di Isernia / Pentro': 'Molise',

  // ═══════════════════════════════════════════════════════════════════
  // LIGURIA (no subregions)
  // ═══════════════════════════════════════════════════════════════════
  'Cinque Terre / Cinque Terre Sciacchetrà': 'Liguria',
  'Colli di Luni': 'Liguria',
  'Colline di Levanto': 'Liguria',
  'Portofino / Golfo del Tigullio - Portofino': 'Liguria',
  'Pornassio / Ormeasco di Pornassio': 'Liguria',
  'Riviera ligure di Ponente': 'Liguria',
  'Rossese di Dolceacqua / Dolceacqua': 'Liguria',
  'Val Polcèvera': 'Liguria',

  // ═══════════════════════════════════════════════════════════════════
  // VALLE D'AOSTA (no subregions)
  // ═══════════════════════════════════════════════════════════════════
  'Valle d\'Aosta / Vallée d\'Aoste': 'Valle d\'Aosta',

  // ═══════════════════════════════════════════════════════════════════
  // MULTI-REGION — shared appellations
  // These span multiple administrative regions and are assigned to the
  // most prominent or geographically central region.
  // ═══════════════════════════════════════════════════════════════════
  'delle Venezie / Beneških okolišev': 'Piave & Eastern Veneto',
};
