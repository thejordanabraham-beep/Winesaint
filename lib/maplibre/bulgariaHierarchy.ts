/**
 * Bulgaria Wine Region Hierarchy
 * Groups 52 PDOs into 5 wine regions based on Bulgaria's official wine zones.
 * Names are in Cyrillic matching the GeoJSON.
 */

export const BULGARIA_SUBREGIONS = {
  'Thracian Lowlands': [],
  'Danubian Plain': [],
  'Black Sea': [],
  'Struma Valley': [],
  'Rose Valley': [],
};

export const BULGARIA_REGIONS = Object.keys(BULGARIA_SUBREGIONS);

export const BULGARIA_APPELLATIONS = {
  // Thracian Lowlands (Southern Bulgaria — Plovdiv, Haskovo, Stara Zagora area)
  'Пловдив': 'Thracian Lowlands',
  'Асеновград': 'Thracian Lowlands',
  'Брестник': 'Thracian Lowlands',
  'Перущица': 'Thracian Lowlands',
  'Хисаря': 'Thracian Lowlands',
  'Карлово': 'Thracian Lowlands',
  'Пазарджик': 'Thracian Lowlands',
  'Септември': 'Thracian Lowlands',
  'Стара Загора': 'Thracian Lowlands',
  'Хасково': 'Thracian Lowlands',
  'Стамболово': 'Thracian Lowlands',
  'Любимец': 'Thracian Lowlands',
  'Ивайловград': 'Thracian Lowlands',
  'Сакар': 'Thracian Lowlands',
  'Ямбол': 'Thracian Lowlands',
  'Болярово': 'Thracian Lowlands',
  'Нова Загора': 'Thracian Lowlands',
  'Сливен': 'Thracian Lowlands',
  'Шивачево': 'Thracian Lowlands',

  // Danubian Plain (Northern Bulgaria — Pleven, Rousse, Vidin area)
  'Плевен': 'Danubian Plain',
  'Свищов': 'Danubian Plain',
  'Сухиндол': 'Danubian Plain',
  'Павликени': 'Danubian Plain',
  'Лясковец': 'Danubian Plain',
  'Оряховица': 'Danubian Plain',
  'Ловеч': 'Danubian Plain',
  'Русе': 'Danubian Plain',
  'Монтана': 'Danubian Plain',
  'Видин': 'Danubian Plain',
  'Лом': 'Danubian Plain',
  'Враца': 'Danubian Plain',
  'Лозица': 'Danubian Plain',
  'Ново село': 'Danubian Plain',

  // Black Sea (Eastern Bulgaria — Varna, Burgas, Shumen area)
  'Варна': 'Black Sea',
  'Евксиноград': 'Black Sea',
  'Велики Преслав': 'Black Sea',
  'Шумен': 'Black Sea',
  'Търговище': 'Black Sea',
  'Нови Пазар': 'Black Sea',
  'Хан Крум': 'Black Sea',
  'Драгоево': 'Black Sea',
  'Хърсово': 'Black Sea',
  'Върбица': 'Black Sea',
  'Славянци': 'Black Sea',
  'Поморие': 'Black Sea',
  'Карнобат': 'Black Sea',
  'Сунгурларе': 'Black Sea',
  'Южно Черноморие': 'Black Sea',
  'Черноморски район': 'Black Sea',

  // Struma Valley (Southwest — Melnik area)
  'Мелник': 'Struma Valley',
  'Долината на Струма': 'Struma Valley',
  'Сандански': 'Struma Valley',
};
