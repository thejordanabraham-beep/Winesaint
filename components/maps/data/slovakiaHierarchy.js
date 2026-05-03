/**
 * Slovakia Wine Region Hierarchy
 * Maps all 8 Slovak PDOs into 2 regions.
 */

export const SLOVAKIA_SUBREGIONS = {
  'Western Slovakia': [],
  'Central & Eastern Slovakia': [],
};

export const SLOVAKIA_REGIONS = Object.keys(SLOVAKIA_SUBREGIONS);

export const SLOVAKIA_APPELLATIONS = {
  // Western Slovakia
  'Malokarpatská / Malokarpatské / Malokarpatský': 'Western Slovakia',
  'Nitrianska / Nitrianske / Nitriansky': 'Western Slovakia',
  'Južnoslovenská / Južnoslovenské / Južnoslovenský': 'Western Slovakia',
  'Karpatská perla': 'Western Slovakia',
  'Skalický rubín': 'Western Slovakia',

  // Central & Eastern Slovakia
  'Stredoslovenská / Stredoslovenský / Stredoslovenské': 'Central & Eastern Slovakia',
  'Východoslovenská / Východoslovenský / Východoslovenské': 'Central & Eastern Slovakia',
  'Vinohradnícka oblasť Tokaj': 'Central & Eastern Slovakia',
};
