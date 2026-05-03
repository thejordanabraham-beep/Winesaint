/**
 * Greece Wine Region Hierarchy
 * Groups 33 PDOs into geographic regions.
 * Names are in Greek script matching the GeoJSON.
 */

export const GREECE_SUBREGIONS = {
  'Macedonia': [],
  'Peloponnese': [],
  'Crete': [],
  'Aegean Islands': [],
  'Thessaly & Central Greece': [],
  'Epirus & Ionian': [],
};

export const GREECE_REGIONS = Object.keys(GREECE_SUBREGIONS);

export const GREECE_APPELLATIONS = {
  // Macedonia (Northern Greece)
  'Νάουσα': 'Macedonia',                    // Naoussa
  'Γουμένισσα': 'Macedonia',                // Goumenissa
  'Αμύνταιο': 'Macedonia',                  // Amyntaio
  'Πλαγιές Μελίτωνα': 'Macedonia',          // Slopes of Meliton

  // Peloponnese
  'Νεμέα': 'Peloponnese',                   // Nemea
  'Μαντινεία': 'Peloponnese',               // Mantinia
  'Πάτρα': 'Peloponnese',                   // Patra
  'Μαυροδάφνη Πατρών': 'Peloponnese',       // Mavrodaphne of Patras
  'Μοσχάτο Πατρών': 'Peloponnese',          // Muscat of Patras
  'Μοσχάτος Ρίου Πάτρας': 'Peloponnese',   // Muscat of Rio Patras
  'Μονεμβασία- Malvasia': 'Peloponnese',    // Monemvasia Malvasia

  // Crete
  'Αρχάνες': 'Crete',                       // Archanes
  'Δαφνές': 'Crete',                        // Dafnes
  'Πεζά': 'Crete',                          // Peza
  'Σητεία': 'Crete',                        // Sitia
  'Malvasia Σητείας': 'Crete',              // Malvasia of Sitia
  'Χάνδακας - Candia': 'Crete',             // Heraklion/Candia
  'Malvasia Χάνδακας-Candia': 'Crete',      // Malvasia of Candia

  // Aegean Islands
  'Σαντορίνη': 'Aegean Islands',            // Santorini
  'Σάμος': 'Aegean Islands',                // Samos
  'Λήμνος': 'Aegean Islands',               // Lemnos
  'Μοσχάτος Λήμνου': 'Aegean Islands',      // Muscat of Lemnos
  'Πάρος': 'Aegean Islands',                // Paros
  'Malvasia Πάρος': 'Aegean Islands',        // Malvasia of Paros
  'Ρόδος': 'Aegean Islands',                // Rhodes
  'Μοσχάτος Ρόδου': 'Aegean Islands',       // Muscat of Rhodes

  // Thessaly & Central Greece
  'Ραψάνη': 'Thessaly & Central Greece',    // Rapsani
  'Μεσενικόλα': 'Thessaly & Central Greece', // Messenikola
  'Αγχίαλος': 'Thessaly & Central Greece',  // Anchialos

  // Epirus & Ionian Islands
  'Ζίτσα': 'Epirus & Ionian',              // Zitsa
  'Ρομπόλα Κεφαλληνίας': 'Epirus & Ionian', // Robola of Cephalonia
  'Μαυροδάφνη Κεφαλληνίας': 'Epirus & Ionian', // Mavrodaphne of Cephalonia
  'Μοσχάτος Κεφαλληνίας': 'Epirus & Ionian', // Muscat of Cephalonia
};
