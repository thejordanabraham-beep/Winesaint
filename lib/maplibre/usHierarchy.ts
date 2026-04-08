/**
 * United States Wine Region Hierarchy
 *
 * Maps all 276 US AVAs into a multi-level hierarchy:
 *   State → Region → Sub-region → AVA (all flat within sub-regions)
 *
 * The US AVA system has overlapping boundaries (an AVA can be inside
 * multiple parent AVAs). We pick the most specific/local parent for
 * each AVA to create a clean tree.
 *
 * Phase 1: California (154 AVAs)
 * Future phases: Oregon, Washington, New York, etc.
 */

export const US_SUBREGIONS = {
  'California': [
    'Napa Valley',
    'Sonoma',
    'Mendocino',
    'Lake County',
    'Central Coast',
    'Paso Robles',
    'Santa Ynez Valley',
    'Monterey',
    'San Benito',
    'San Francisco Bay',
    'Sierra Foothills',
    'Lodi',
    'South Coast',
    'Other California',
  ],
  'Oregon': [
    'Willamette Valley',
    'Southern Oregon',
    'Other Oregon',
  ],
  'Washington': [
    'Yakima Valley',
    'Walla Walla Valley',
    'Greater Columbia Valley',
    'Other Washington',
  ],
  'New York': [],
  'Virginia': [],
  'Texas': [],
  'Other States': [],
};

export const US_REGIONS = Object.keys(US_SUBREGIONS);

/**
 * Primary parent assignment for each AVA.
 * Multi-parent AVAs are assigned to their most specific/local parent.
 */
export const US_APPELLATIONS = {
  // ═══════════════════════════════════════════════════════════════════
  // CALIFORNIA — Napa Valley
  // ═══════════════════════════════════════════════════════════════════
  'Napa Valley': 'Napa Valley',
  'Atlas Peak': 'Napa Valley',
  'Calistoga': 'Napa Valley',
  'Chiles Valley': 'Napa Valley',
  'Coombsville': 'Napa Valley',
  'Crystal Springs of Napa Valley ': 'Napa Valley',
  'Diamond Mountain District': 'Napa Valley',
  'Howell Mountain': 'Napa Valley',
  'Los Carneros': 'Napa Valley',
  'Mt. Veeder': 'Napa Valley',
  'Oak Knoll District of Napa Valley': 'Napa Valley',
  'Oakville': 'Napa Valley',
  'Rutherford': 'Napa Valley',
  'Spring Mountain District': 'Napa Valley',
  'St. Helena': 'Napa Valley',
  'Stags Leap District': 'Napa Valley',
  'Wild Horse Valley': 'Napa Valley',
  'Yountville': 'Napa Valley',

  // ═══════════════════════════════════════════════════════════════════
  // CALIFORNIA — Sonoma (flat — all Sonoma county AVAs together)
  // ═══════════════════════════════════════════════════════════════════
  'Sonoma Coast': 'Sonoma',
  'Sonoma Valley': 'Sonoma',
  'Sonoma Mountain': 'Sonoma',
  'Northern Sonoma': 'Sonoma',
  'Alexander Valley': 'Sonoma',
  'Bennett Valley': 'Sonoma',
  'Chalk Hill': 'Sonoma',
  'Dry Creek Valley': 'Sonoma',
  'Fort Ross-Seaview': 'Sonoma',
  'Fountaingrove District': 'Sonoma',
  'Green Valley of Russian River Valley': 'Sonoma',
  'Knights Valley': 'Sonoma',
  'Moon Mountain District Sonoma County': 'Sonoma',
  'Petaluma Gap': 'Sonoma',
  'Pine Mountain-Cloverdale Peak': 'Sonoma',
  'Rockpile': 'Sonoma',
  'Russian River Valley': 'Sonoma',
  'West Sonoma Coast': 'Sonoma',

  // ═══════════════════════════════════════════════════════════════════
  // CALIFORNIA — Mendocino
  // ═══════════════════════════════════════════════════════════════════
  'Mendocino': 'Mendocino',
  'Anderson Valley': 'Mendocino',
  'Cole Ranch': 'Mendocino',
  'Covelo': 'Mendocino',
  'Dos Rios': 'Mendocino',
  'Eagle Peak Mendocino County': 'Mendocino',
  'McDowell Valley': 'Mendocino',
  'Mendocino Ridge': 'Mendocino',
  'Potter Valley': 'Mendocino',
  'Redwood Valley': 'Mendocino',
  'Yorkville Highlands': 'Mendocino',

  // ═══════════════════════════════════════════════════════════════════
  // CALIFORNIA — Lake County
  // ═══════════════════════════════════════════════════════════════════
  'Clear Lake': 'Lake County',
  'Big Valley District-Lake County': 'Lake County',
  'High Valley': 'Lake County',
  'Kelsey Bench-Lake County': 'Lake County',
  'Red Hills Lake County': 'Lake County',
  'Upper Lake Valley': 'Lake County',
  'Long Valley-Lake County': 'Lake County',
  'Guenoc Valley': 'Lake County',

  // ═══════════════════════════════════════════════════════════════════
  // CALIFORNIA — North Coast standalones (under Other California)
  // ═══════════════════════════════════════════════════════════════════
  'North Coast': 'Other California',
  'Benmore Valley': 'Other California',
  'Comptche': 'Other California',
  'Solano County Green Valley': 'Other California',
  'Suisun Valley': 'Other California',

  // ═══════════════════════════════════════════════════════════════════
  // CALIFORNIA — Central Coast (top-level + standalones)
  // ═══════════════════════════════════════════════════════════════════
  'Central Coast': 'Central Coast',
  'Alisos Canyon': 'Central Coast',
  'Arroyo Grande Valley': 'Central Coast',
  'Carmel Valley': 'Central Coast',
  'Edna Valley': 'Central Coast',
  'San Antonio Valley': 'Central Coast',
  'San Luis Obispo Coast': 'Central Coast',
  'Santa Maria Valley': 'Central Coast',
  'York Mountain': 'Central Coast',
  'Santa Cruz Mountains': 'Central Coast',
  'Ben Lomond Mountain': 'Central Coast',
  'Gabilan Mountains': 'Central Coast',

  // ═══════════════════════════════════════════════════════════════════
  // CALIFORNIA — Paso Robles
  // ═══════════════════════════════════════════════════════════════════
  'Paso Robles': 'Paso Robles',
  'Adelaida District': 'Paso Robles',
  'Creston District': 'Paso Robles',
  'El Pomar District': 'Paso Robles',
  'Paso Robles Estrella District': 'Paso Robles',
  'Paso Robles Geneseo District': 'Paso Robles',
  'Paso Robles Highlands District': 'Paso Robles',
  'Paso Robles Willow Creek District': 'Paso Robles',
  'San Juan Creek': 'Paso Robles',
  'San Miguel District': 'Paso Robles',
  'Santa Margarita Ranch': 'Paso Robles',
  'Templeton Gap District': 'Paso Robles',

  // ═══════════════════════════════════════════════════════════════════
  // CALIFORNIA — Santa Ynez Valley
  // ═══════════════════════════════════════════════════════════════════
  'Santa Ynez Valley': 'Santa Ynez Valley',
  'Ballard Canyon': 'Santa Ynez Valley',
  'Happy Canyon of Santa Barbara': 'Santa Ynez Valley',
  'Los Olivos District': 'Santa Ynez Valley',
  'Sta. Rita Hills': 'Santa Ynez Valley',

  // ═══════════════════════════════════════════════════════════════════
  // CALIFORNIA — Monterey
  // ═══════════════════════════════════════════════════════════════════
  'Monterey': 'Monterey',
  'Arroyo Seco': 'Monterey',
  'Chalone': 'Monterey',
  'Hames Valley': 'Monterey',
  'Mt. Harlan': 'Monterey',
  'San Bernabe': 'Monterey',
  'San Lucas': 'Monterey',
  'Santa Lucia Highlands': 'Monterey',

  // ═══════════════════════════════════════════════════════════════════
  // CALIFORNIA — San Benito
  // ═══════════════════════════════════════════════════════════════════
  'San Benito': 'San Benito',
  'Cienega Valley': 'San Benito',
  'Lime Kiln Valley': 'San Benito',
  'Paicines': 'San Benito',

  // ═══════════════════════════════════════════════════════════════════
  // CALIFORNIA — San Francisco Bay
  // ═══════════════════════════════════════════════════════════════════
  'San Francisco Bay': 'San Francisco Bay',
  'Lamorinda': 'San Francisco Bay',
  'Livermore Valley': 'San Francisco Bay',
  'Pacheco Pass': 'San Francisco Bay',
  'Santa Clara Valley': 'San Francisco Bay',
  'San Ysidro District': 'San Francisco Bay',
  'Contra Costa': 'San Francisco Bay',

  // ═══════════════════════════════════════════════════════════════════
  // CALIFORNIA — Sierra Foothills
  // ═══════════════════════════════════════════════════════════════════
  'Sierra Foothills': 'Sierra Foothills',
  'California Shenandoah Valley': 'Sierra Foothills',
  'El Dorado': 'Sierra Foothills',
  'Fair Play': 'Sierra Foothills',
  'Fiddletown': 'Sierra Foothills',
  'North Yuba': 'Sierra Foothills',

  // ═══════════════════════════════════════════════════════════════════
  // CALIFORNIA — Lodi
  // ═══════════════════════════════════════════════════════════════════
  'Lodi': 'Lodi',
  'Alta Mesa': 'Lodi',
  'Borden Ranch': 'Lodi',
  'Clements Hills': 'Lodi',
  'Cosumnes River': 'Lodi',
  'Jahant': 'Lodi',
  'Mokelumne River': 'Lodi',
  'Sloughhouse': 'Lodi',

  // ═══════════════════════════════════════════════════════════════════
  // CALIFORNIA — South Coast
  // ═══════════════════════════════════════════════════════════════════
  'South Coast': 'South Coast',
  'Ramona Valley': 'South Coast',
  'San Luis Rey': 'South Coast',
  'San Pasqual Valley': 'South Coast',
  'Temecula Valley': 'South Coast',
  'Cucamonga Valley': 'South Coast',
  'Malibu Coast': 'South Coast',
  'Malibu-Newton Canyon': 'South Coast',
  'Saddle Rock-Malibu': 'South Coast',
  'Palos Verdes Peninsula': 'South Coast',
  'Leona Valley': 'South Coast',
  'Yucaipa Valley': 'South Coast',

  // ═══════════════════════════════════════════════════════════════════
  // CALIFORNIA — Other California (standalones, Central Valley, etc.)
  // ═══════════════════════════════════════════════════════════════════
  'Antelope Valley of the California High Desert': 'Other California',
  'Capay Valley': 'Other California',
  'Clarksburg': 'Other California',
  'Merritt Island': 'Other California',
  'Diablo Grande': 'Other California',
  'Dunnigan Hills': 'Other California',
  'Inwood Valley': 'Other California',
  'Madera': 'Other California',
  'Manton Valley': 'Other California',
  'Paulsell Valley': 'Other California',
  'River Junction': 'Other California',
  'Salado Creek': 'Other California',
  'Seiad Valley': 'Other California',
  'Sierra Pelona Valley': 'Other California',
  'Squaw Valley-Miramonte': 'Other California',
  'Tehachapi Mountains': 'Other California',
  'Tracy Hills': 'Other California',
  'Trinity Lakes': 'Other California',
  'Willow Creek': 'Other California',
  'Winters Highlands': 'Other California',

  // ═══════════════════════════════════════════════════════════════════
  // OREGON — Willamette Valley
  // ═══════════════════════════════════════════════════════════════════
  'Willamette Valley': 'Willamette Valley',
  'Chehalem Mountains': 'Willamette Valley',
  'Dundee Hills': 'Willamette Valley',
  'Eola-Amity Hills': 'Willamette Valley',
  'Laurelwood District': 'Willamette Valley',
  'Lower Long Tom': 'Willamette Valley',
  'McMinnville': 'Willamette Valley',
  'Mount Pisgah, Polk County, Oregon': 'Willamette Valley',
  'Ribbon Ridge': 'Willamette Valley',
  'Tualatin Hills': 'Willamette Valley',
  'Van Duzer Corridor': 'Willamette Valley',
  'Yamhill-Carlton': 'Willamette Valley',

  // ═══════════════════════════════════════════════════════════════════
  // OREGON — Southern Oregon
  // ═══════════════════════════════════════════════════════════════════
  'Southern Oregon': 'Southern Oregon',
  'Applegate Valley': 'Southern Oregon',
  'Elkton Oregon': 'Southern Oregon',
  'Red Hill Douglas County, Oregon': 'Southern Oregon',
  'Rogue Valley': 'Southern Oregon',
  'Umpqua Valley': 'Southern Oregon',

  // ═══════════════════════════════════════════════════════════════════
  // OREGON — Other Oregon
  // ═══════════════════════════════════════════════════════════════════
  'Columbia Gorge': 'Other Oregon',

  // ═══════════════════════════════════════════════════════════════════
  // WASHINGTON — Yakima Valley
  // ═══════════════════════════════════════════════════════════════════
  'Yakima Valley': 'Yakima Valley',
  'Rattlesnake Hills': 'Yakima Valley',
  'Red Mountain': 'Yakima Valley',
  'Snipes Mountain': 'Yakima Valley',
  'Candy Mountain': 'Yakima Valley',
  'Goose Gap': 'Yakima Valley',
  'Naches Heights': 'Yakima Valley',

  // ═══════════════════════════════════════════════════════════════════
  // WASHINGTON — Walla Walla Valley
  // ═══════════════════════════════════════════════════════════════════
  'Walla Walla Valley': 'Walla Walla Valley',
  'The Rocks District of Milton-Freewater': 'Walla Walla Valley',

  // ═══════════════════════════════════════════════════════════════════
  // WASHINGTON — Greater Columbia Valley
  // ═══════════════════════════════════════════════════════════════════
  'Columbia Valley': 'Greater Columbia Valley',
  'Ancient Lakes of Columbia Valley': 'Greater Columbia Valley',
  'Beverly Washington': 'Greater Columbia Valley',
  'Horse Heaven Hills': 'Greater Columbia Valley',
  'Lake Chelan': 'Greater Columbia Valley',
  'Rocky Reach': 'Greater Columbia Valley',
  'Royal Slope': 'Greater Columbia Valley',
  'The Burn of Columbia Valley': 'Greater Columbia Valley',
  'Wahluke Slope': 'Greater Columbia Valley',
  'White Bluffs': 'Greater Columbia Valley',

  // ═══════════════════════════════════════════════════════════════════
  // WASHINGTON — Other Washington
  // ═══════════════════════════════════════════════════════════════════
  'Puget Sound': 'Other Washington',
  'Lewis-Clark Valley': 'Other Washington',

  // ═══════════════════════════════════════════════════════════════════
  // NEW YORK (flat under state for now)
  // ═══════════════════════════════════════════════════════════════════
  'Finger Lakes': 'New York',
  'Cayuga Lake': 'New York',
  'Seneca Lake': 'New York',
  'Hudson River Region': 'New York',
  'Long Island': 'New York',
  'North Fork of Long Island': 'New York',
  'The Hamptons, Long Island': 'New York',
  'Niagara Escarpment': 'New York',
  'Champlain Valley of New York': 'New York',
  'Upper Hudson': 'New York',

  // ═══════════════════════════════════════════════════════════════════
  // VIRGINIA (flat under state for now)
  // ═══════════════════════════════════════════════════════════════════
  'Monticello': 'Virginia',
  'Shenandoah Valley': 'Virginia',
  'Middleburg Virginia': 'Virginia',
  'North Fork of Roanoke': 'Virginia',
  'Northern Neck George Washington Birthplace': 'Virginia',
  'Rocky Knob': 'Virginia',
  'Virginia Peninsula': 'Virginia',
  'Virginia\u2019s Eastern Shore': 'Virginia',

  // ═══════════════════════════════════════════════════════════════════
  // TEXAS (flat under state for now)
  // ═══════════════════════════════════════════════════════════════════
  'Texas Hill Country': 'Texas',
  'Texas High Plains': 'Texas',
  'Texas Davis Mountains': 'Texas',
  'Texoma': 'Texas',
  'Bell Mountain': 'Texas',
  'Escondido Valley': 'Texas',
  'Fredericksburg in the Texas Hill Country': 'Texas',

  // ═══════════════════════════════════════════════════════════════════
  // OTHER STATES
  // ═══════════════════════════════════════════════════════════════════
  // Multi-state
  'Ozark Mountain': 'Other States',
  'Arkansas Mountain': 'Other States',
  'Ozark Highlands': 'Other States',
  'Altus': 'Other States',
  'Augusta': 'Other States',
  'Hermann': 'Other States',
  'Ohio River Valley': 'Other States',
  'Mississippi Delta': 'Other States',
  'Upper Mississippi River Valley': 'Other States',
  'Lake Erie': 'Other States',
  'Cumberland Valley': 'Other States',
  'Appalachian High Country': 'Other States',

  // Pennsylvania & New Jersey
  'Central Delaware Valley': 'Other States',
  'Lancaster Valley': 'Other States',
  'Lehigh Valley': 'Other States',
  'Outer Coastal Plain': 'Other States',
  'Warren Hills': 'Other States',
  'Cape May Peninsula': 'Other States',

  // Connecticut & Massachusetts
  'Southeastern New England': 'Other States',
  'Western Connecticut Highlands': 'Other States',
  'Eastern Connecticut Highlands': 'Other States',
  'Martha\'s Vineyard': 'Other States',

  // North Carolina
  'Yadkin Valley': 'Other States',
  'Swan Creek': 'Other States',
  'Haw River Valley': 'Other States',
  'Crest of the Blue Ridge Henderson County': 'Other States',
  'Upper Hiwassee Highlands': 'Other States',

  // Georgia
  'Dahlonega Plateau': 'Other States',
  'Upper Cumberland': 'Other States',

  // Tennessee / Catoctin / Maryland
  'Catoctin': 'Other States',
  'Linganore': 'Other States',

  // Michigan
  'Fennville': 'Other States',
  'Lake Michigan Shore': 'Other States',
  'Leelanau Peninsula': 'Other States',
  'Old Mission Peninsula': 'Other States',
  'Tip of the Mitt': 'Other States',

  // Ohio
  'Grand River Valley': 'Other States',
  'Isle St. George': 'Other States',
  'Loramie Creek': 'Other States',
  'Kanawha River Valley': 'Other States',

  // Indiana
  'Indiana Uplands': 'Other States',

  // Wisconsin / Iowa
  'Wisconsin Ledge': 'Other States',
  'Lake Wisconsin': 'Other States',
  'Loess Hills District': 'Other States',
  'Alexandria Lakes': 'Other States',

  // Colorado
  'Grand Valley': 'Other States',
  'West Elks': 'Other States',

  // Idaho
  'Snake River Valley': 'Other States',
  'Eagle Foothills': 'Other States',

  // Arizona
  'Verde Valley': 'Other States',
  'Sonoita': 'Other States',
  'Willcox': 'Other States',

  // New Mexico
  'Mesilla Valley': 'Other States',
  'Middle Rio Grande Valley': 'Other States',
  'Mimbres Valley': 'Other States',

  // Hawaii
  'Ulupalakua': 'Other States',

  // Illinois
  'Shawnee Hills': 'Other States',

};
