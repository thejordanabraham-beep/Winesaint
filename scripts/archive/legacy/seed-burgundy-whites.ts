/**
 * Seed Burgundy white wine producers (2015-2022)
 * Dauvissat, Bonneau du Martray, Sauzet, Roulot, Comtes Lafon, Méo-Camuzet
 */

import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@sanity/client';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

interface WineEntry {
  producer: string;
  producerSlug: string;
  producerDesc: string;
  wine: string;
  wineSlug: string;
  region: string;
  grapes: string[];
  vintages: { year: number; criticAvg: number; vivinoScore: number; priceUsd: number }[];
}

const wines: WineEntry[] = [
  // DAUVISSAT - Chablis
  {
    producer: 'Domaine Vincent Dauvissat',
    producerSlug: 'vincent-dauvissat',
    producerDesc: 'Reference point for Chablis. Biodynamic farming. Intense minerality and longevity.',
    wine: 'Dauvissat Chablis',
    wineSlug: 'dauvissat-chablis',
    region: 'Chablis',
    grapes: ['Chardonnay'],
    vintages: [
      { year: 2022, criticAvg: 92, vivinoScore: 4.2, priceUsd: 65 },
      { year: 2021, criticAvg: 91, vivinoScore: 4.1, priceUsd: 60 },
      { year: 2020, criticAvg: 93, vivinoScore: 4.3, priceUsd: 58 },
      { year: 2019, criticAvg: 92, vivinoScore: 4.2, priceUsd: 55 },
      { year: 2018, criticAvg: 91, vivinoScore: 4.1, priceUsd: 52 },
      { year: 2017, criticAvg: 92, vivinoScore: 4.2, priceUsd: 50 },
      { year: 2016, criticAvg: 93, vivinoScore: 4.3, priceUsd: 48 },
      { year: 2015, criticAvg: 92, vivinoScore: 4.2, priceUsd: 45 },
    ],
  },
  {
    producer: 'Domaine Vincent Dauvissat',
    producerSlug: 'vincent-dauvissat',
    producerDesc: 'Reference point for Chablis. Biodynamic farming. Intense minerality and longevity.',
    wine: 'Dauvissat Chablis 1er Cru La Forest',
    wineSlug: 'dauvissat-chablis-la-forest',
    region: 'Chablis',
    grapes: ['Chardonnay'],
    vintages: [
      { year: 2022, criticAvg: 94, vivinoScore: 4.4, priceUsd: 120 },
      { year: 2021, criticAvg: 93, vivinoScore: 4.3, priceUsd: 115 },
      { year: 2020, criticAvg: 95, vivinoScore: 4.5, priceUsd: 110 },
      { year: 2019, criticAvg: 94, vivinoScore: 4.4, priceUsd: 105 },
      { year: 2018, criticAvg: 93, vivinoScore: 4.3, priceUsd: 100 },
      { year: 2017, criticAvg: 94, vivinoScore: 4.4, priceUsd: 95 },
      { year: 2016, criticAvg: 95, vivinoScore: 4.5, priceUsd: 90 },
      { year: 2015, criticAvg: 94, vivinoScore: 4.4, priceUsd: 85 },
    ],
  },
  {
    producer: 'Domaine Vincent Dauvissat',
    producerSlug: 'vincent-dauvissat',
    producerDesc: 'Reference point for Chablis. Biodynamic farming. Intense minerality and longevity.',
    wine: 'Dauvissat Chablis 1er Cru Vaillons',
    wineSlug: 'dauvissat-chablis-vaillons',
    region: 'Chablis',
    grapes: ['Chardonnay'],
    vintages: [
      { year: 2022, criticAvg: 94, vivinoScore: 4.4, priceUsd: 115 },
      { year: 2021, criticAvg: 93, vivinoScore: 4.3, priceUsd: 110 },
      { year: 2020, criticAvg: 94, vivinoScore: 4.4, priceUsd: 105 },
      { year: 2019, criticAvg: 93, vivinoScore: 4.3, priceUsd: 100 },
      { year: 2018, criticAvg: 92, vivinoScore: 4.2, priceUsd: 95 },
      { year: 2017, criticAvg: 93, vivinoScore: 4.3, priceUsd: 90 },
      { year: 2016, criticAvg: 94, vivinoScore: 4.4, priceUsd: 85 },
      { year: 2015, criticAvg: 93, vivinoScore: 4.3, priceUsd: 80 },
    ],
  },
  {
    producer: 'Domaine Vincent Dauvissat',
    producerSlug: 'vincent-dauvissat',
    producerDesc: 'Reference point for Chablis. Biodynamic farming. Intense minerality and longevity.',
    wine: 'Dauvissat Chablis Grand Cru Les Preuses',
    wineSlug: 'dauvissat-chablis-preuses',
    region: 'Chablis',
    grapes: ['Chardonnay'],
    vintages: [
      { year: 2022, criticAvg: 96, vivinoScore: 4.6, priceUsd: 280 },
      { year: 2021, criticAvg: 95, vivinoScore: 4.5, priceUsd: 270 },
      { year: 2020, criticAvg: 97, vivinoScore: 4.7, priceUsd: 260 },
      { year: 2019, criticAvg: 96, vivinoScore: 4.6, priceUsd: 250 },
      { year: 2018, criticAvg: 95, vivinoScore: 4.5, priceUsd: 240 },
      { year: 2017, criticAvg: 96, vivinoScore: 4.6, priceUsd: 230 },
      { year: 2016, criticAvg: 97, vivinoScore: 4.7, priceUsd: 220 },
      { year: 2015, criticAvg: 96, vivinoScore: 4.6, priceUsd: 210 },
    ],
  },
  {
    producer: 'Domaine Vincent Dauvissat',
    producerSlug: 'vincent-dauvissat',
    producerDesc: 'Reference point for Chablis. Biodynamic farming. Intense minerality and longevity.',
    wine: 'Dauvissat Petit Chablis',
    wineSlug: 'dauvissat-petit-chablis',
    region: 'Chablis',
    grapes: ['Chardonnay'],
    vintages: [
      { year: 2022, criticAvg: 89, vivinoScore: 4.0, priceUsd: 40 },
      { year: 2021, criticAvg: 88, vivinoScore: 3.9, priceUsd: 38 },
      { year: 2020, criticAvg: 90, vivinoScore: 4.0, priceUsd: 36 },
      { year: 2019, criticAvg: 89, vivinoScore: 4.0, priceUsd: 34 },
      { year: 2018, criticAvg: 88, vivinoScore: 3.9, priceUsd: 32 },
      { year: 2017, criticAvg: 89, vivinoScore: 4.0, priceUsd: 30 },
      { year: 2016, criticAvg: 90, vivinoScore: 4.0, priceUsd: 28 },
      { year: 2015, criticAvg: 89, vivinoScore: 4.0, priceUsd: 26 },
    ],
  },

  // BONNEAU DU MARTRAY - Corton-Charlemagne
  {
    producer: 'Domaine Bonneau du Martray',
    producerSlug: 'bonneau-du-martray',
    producerDesc: 'Iconic Corton-Charlemagne producer. Biodynamic since 2010. Pure, mineral-driven whites.',
    wine: 'Bonneau du Martray Corton-Charlemagne Grand Cru',
    wineSlug: 'bonneau-du-martray-corton-charlemagne',
    region: 'Corton-Charlemagne',
    grapes: ['Chardonnay'],
    vintages: [
      { year: 2022, criticAvg: 95, vivinoScore: 4.5, priceUsd: 350 },
      { year: 2021, criticAvg: 94, vivinoScore: 4.4, priceUsd: 340 },
      { year: 2020, criticAvg: 96, vivinoScore: 4.6, priceUsd: 330 },
      { year: 2019, criticAvg: 95, vivinoScore: 4.5, priceUsd: 320 },
      { year: 2018, criticAvg: 95, vivinoScore: 4.5, priceUsd: 310 },
      { year: 2017, criticAvg: 96, vivinoScore: 4.6, priceUsd: 300 },
      { year: 2016, criticAvg: 95, vivinoScore: 4.5, priceUsd: 290 },
      { year: 2015, criticAvg: 94, vivinoScore: 4.4, priceUsd: 280 },
    ],
  },

  // SAUZET - Puligny-Montrachet
  {
    producer: 'Domaine Étienne Sauzet',
    producerSlug: 'etienne-sauzet',
    producerDesc: 'Top Puligny estate. Biodynamic since 2010. Grace, purity, and richness.',
    wine: 'Sauzet Puligny-Montrachet',
    wineSlug: 'sauzet-puligny-montrachet',
    region: 'Puligny-Montrachet',
    grapes: ['Chardonnay'],
    vintages: [
      { year: 2022, criticAvg: 92, vivinoScore: 4.2, priceUsd: 110 },
      { year: 2021, criticAvg: 91, vivinoScore: 4.1, priceUsd: 105 },
      { year: 2020, criticAvg: 93, vivinoScore: 4.3, priceUsd: 100 },
      { year: 2019, criticAvg: 92, vivinoScore: 4.2, priceUsd: 95 },
      { year: 2018, criticAvg: 91, vivinoScore: 4.1, priceUsd: 90 },
      { year: 2017, criticAvg: 92, vivinoScore: 4.2, priceUsd: 85 },
      { year: 2016, criticAvg: 93, vivinoScore: 4.3, priceUsd: 80 },
      { year: 2015, criticAvg: 92, vivinoScore: 4.2, priceUsd: 75 },
    ],
  },
  {
    producer: 'Domaine Étienne Sauzet',
    producerSlug: 'etienne-sauzet',
    producerDesc: 'Top Puligny estate. Biodynamic since 2010. Grace, purity, and richness.',
    wine: 'Sauzet Puligny-Montrachet 1er Cru La Garenne',
    wineSlug: 'sauzet-puligny-la-garenne',
    region: 'Puligny-Montrachet',
    grapes: ['Chardonnay'],
    vintages: [
      { year: 2022, criticAvg: 94, vivinoScore: 4.4, priceUsd: 180 },
      { year: 2021, criticAvg: 93, vivinoScore: 4.3, priceUsd: 175 },
      { year: 2020, criticAvg: 94, vivinoScore: 4.4, priceUsd: 170 },
      { year: 2019, criticAvg: 93, vivinoScore: 4.3, priceUsd: 165 },
      { year: 2018, criticAvg: 93, vivinoScore: 4.3, priceUsd: 160 },
      { year: 2017, criticAvg: 94, vivinoScore: 4.4, priceUsd: 155 },
      { year: 2016, criticAvg: 94, vivinoScore: 4.4, priceUsd: 150 },
      { year: 2015, criticAvg: 93, vivinoScore: 4.3, priceUsd: 145 },
    ],
  },
  {
    producer: 'Domaine Étienne Sauzet',
    producerSlug: 'etienne-sauzet',
    producerDesc: 'Top Puligny estate. Biodynamic since 2010. Grace, purity, and richness.',
    wine: 'Sauzet Puligny-Montrachet 1er Cru Combettes',
    wineSlug: 'sauzet-puligny-combettes',
    region: 'Puligny-Montrachet',
    grapes: ['Chardonnay'],
    vintages: [
      { year: 2022, criticAvg: 95, vivinoScore: 4.5, priceUsd: 280 },
      { year: 2021, criticAvg: 94, vivinoScore: 4.4, priceUsd: 270 },
      { year: 2020, criticAvg: 95, vivinoScore: 4.5, priceUsd: 260 },
      { year: 2019, criticAvg: 94, vivinoScore: 4.4, priceUsd: 250 },
      { year: 2018, criticAvg: 94, vivinoScore: 4.4, priceUsd: 240 },
      { year: 2017, criticAvg: 95, vivinoScore: 4.5, priceUsd: 230 },
      { year: 2016, criticAvg: 95, vivinoScore: 4.5, priceUsd: 220 },
      { year: 2015, criticAvg: 94, vivinoScore: 4.4, priceUsd: 210 },
    ],
  },
  {
    producer: 'Domaine Étienne Sauzet',
    producerSlug: 'etienne-sauzet',
    producerDesc: 'Top Puligny estate. Biodynamic since 2010. Grace, purity, and richness.',
    wine: 'Sauzet Puligny-Montrachet 1er Cru Champ Gain',
    wineSlug: 'sauzet-puligny-champ-gain',
    region: 'Puligny-Montrachet',
    grapes: ['Chardonnay'],
    vintages: [
      { year: 2022, criticAvg: 94, vivinoScore: 4.4, priceUsd: 190 },
      { year: 2021, criticAvg: 93, vivinoScore: 4.3, priceUsd: 185 },
      { year: 2020, criticAvg: 94, vivinoScore: 4.4, priceUsd: 180 },
      { year: 2019, criticAvg: 93, vivinoScore: 4.3, priceUsd: 175 },
      { year: 2018, criticAvg: 93, vivinoScore: 4.3, priceUsd: 170 },
      { year: 2017, criticAvg: 94, vivinoScore: 4.4, priceUsd: 165 },
      { year: 2016, criticAvg: 94, vivinoScore: 4.4, priceUsd: 160 },
      { year: 2015, criticAvg: 93, vivinoScore: 4.3, priceUsd: 155 },
    ],
  },
  {
    producer: 'Domaine Étienne Sauzet',
    producerSlug: 'etienne-sauzet',
    producerDesc: 'Top Puligny estate. Biodynamic since 2010. Grace, purity, and richness.',
    wine: 'Sauzet Bâtard-Montrachet Grand Cru',
    wineSlug: 'sauzet-batard-montrachet',
    region: 'Bâtard-Montrachet',
    grapes: ['Chardonnay'],
    vintages: [
      { year: 2022, criticAvg: 96, vivinoScore: 4.6, priceUsd: 550 },
      { year: 2021, criticAvg: 95, vivinoScore: 4.5, priceUsd: 530 },
      { year: 2020, criticAvg: 97, vivinoScore: 4.7, priceUsd: 510 },
      { year: 2019, criticAvg: 96, vivinoScore: 4.6, priceUsd: 490 },
      { year: 2018, criticAvg: 95, vivinoScore: 4.5, priceUsd: 470 },
      { year: 2017, criticAvg: 96, vivinoScore: 4.6, priceUsd: 450 },
      { year: 2016, criticAvg: 97, vivinoScore: 4.7, priceUsd: 430 },
      { year: 2015, criticAvg: 96, vivinoScore: 4.6, priceUsd: 410 },
    ],
  },

  // ROULOT - Meursault
  {
    producer: 'Domaine Roulot',
    producerSlug: 'domaine-roulot',
    producerDesc: 'Jean-Marc Roulot\'s legendary Meursault estate. Precision and purity.',
    wine: 'Roulot Meursault',
    wineSlug: 'roulot-meursault',
    region: 'Meursault',
    grapes: ['Chardonnay'],
    vintages: [
      { year: 2022, criticAvg: 92, vivinoScore: 4.2, priceUsd: 150 },
      { year: 2021, criticAvg: 91, vivinoScore: 4.1, priceUsd: 145 },
      { year: 2020, criticAvg: 93, vivinoScore: 4.3, priceUsd: 140 },
      { year: 2019, criticAvg: 92, vivinoScore: 4.2, priceUsd: 135 },
      { year: 2018, criticAvg: 92, vivinoScore: 4.2, priceUsd: 130 },
      { year: 2017, criticAvg: 92, vivinoScore: 4.2, priceUsd: 125 },
      { year: 2016, criticAvg: 93, vivinoScore: 4.3, priceUsd: 120 },
      { year: 2015, criticAvg: 92, vivinoScore: 4.2, priceUsd: 115 },
    ],
  },
  {
    producer: 'Domaine Roulot',
    producerSlug: 'domaine-roulot',
    producerDesc: 'Jean-Marc Roulot\'s legendary Meursault estate. Precision and purity.',
    wine: 'Roulot Meursault Meix Chavaux',
    wineSlug: 'roulot-meursault-meix-chavaux',
    region: 'Meursault',
    grapes: ['Chardonnay'],
    vintages: [
      { year: 2022, criticAvg: 93, vivinoScore: 4.3, priceUsd: 200 },
      { year: 2021, criticAvg: 92, vivinoScore: 4.2, priceUsd: 195 },
      { year: 2020, criticAvg: 94, vivinoScore: 4.4, priceUsd: 190 },
      { year: 2019, criticAvg: 93, vivinoScore: 4.3, priceUsd: 185 },
      { year: 2018, criticAvg: 93, vivinoScore: 4.3, priceUsd: 180 },
      { year: 2017, criticAvg: 93, vivinoScore: 4.3, priceUsd: 175 },
      { year: 2016, criticAvg: 94, vivinoScore: 4.4, priceUsd: 170 },
      { year: 2015, criticAvg: 93, vivinoScore: 4.3, priceUsd: 165 },
    ],
  },
  {
    producer: 'Domaine Roulot',
    producerSlug: 'domaine-roulot',
    producerDesc: 'Jean-Marc Roulot\'s legendary Meursault estate. Precision and purity.',
    wine: 'Roulot Meursault Vireuils',
    wineSlug: 'roulot-meursault-vireuils',
    region: 'Meursault',
    grapes: ['Chardonnay'],
    vintages: [
      { year: 2022, criticAvg: 93, vivinoScore: 4.3, priceUsd: 190 },
      { year: 2021, criticAvg: 92, vivinoScore: 4.2, priceUsd: 185 },
      { year: 2020, criticAvg: 93, vivinoScore: 4.3, priceUsd: 180 },
      { year: 2019, criticAvg: 92, vivinoScore: 4.2, priceUsd: 175 },
      { year: 2018, criticAvg: 92, vivinoScore: 4.2, priceUsd: 170 },
      { year: 2017, criticAvg: 93, vivinoScore: 4.3, priceUsd: 165 },
      { year: 2016, criticAvg: 93, vivinoScore: 4.3, priceUsd: 160 },
      { year: 2015, criticAvg: 92, vivinoScore: 4.2, priceUsd: 155 },
    ],
  },
  {
    producer: 'Domaine Roulot',
    producerSlug: 'domaine-roulot',
    producerDesc: 'Jean-Marc Roulot\'s legendary Meursault estate. Precision and purity.',
    wine: 'Roulot Meursault 1er Cru Clos des Bouchères',
    wineSlug: 'roulot-meursault-boucheres',
    region: 'Meursault',
    grapes: ['Chardonnay'],
    vintages: [
      { year: 2022, criticAvg: 95, vivinoScore: 4.5, priceUsd: 350 },
      { year: 2021, criticAvg: 94, vivinoScore: 4.4, priceUsd: 340 },
      { year: 2020, criticAvg: 95, vivinoScore: 4.5, priceUsd: 330 },
      { year: 2019, criticAvg: 94, vivinoScore: 4.4, priceUsd: 320 },
      { year: 2018, criticAvg: 94, vivinoScore: 4.4, priceUsd: 310 },
      { year: 2017, criticAvg: 95, vivinoScore: 4.5, priceUsd: 300 },
      { year: 2016, criticAvg: 95, vivinoScore: 4.5, priceUsd: 290 },
      { year: 2015, criticAvg: 94, vivinoScore: 4.4, priceUsd: 280 },
    ],
  },
  {
    producer: 'Domaine Roulot',
    producerSlug: 'domaine-roulot',
    producerDesc: 'Jean-Marc Roulot\'s legendary Meursault estate. Precision and purity.',
    wine: 'Roulot Meursault 1er Cru Perrières',
    wineSlug: 'roulot-meursault-perrieres',
    region: 'Meursault',
    grapes: ['Chardonnay'],
    vintages: [
      { year: 2022, criticAvg: 96, vivinoScore: 4.6, priceUsd: 500 },
      { year: 2021, criticAvg: 95, vivinoScore: 4.5, priceUsd: 485 },
      { year: 2020, criticAvg: 97, vivinoScore: 4.7, priceUsd: 470 },
      { year: 2019, criticAvg: 96, vivinoScore: 4.6, priceUsd: 455 },
      { year: 2018, criticAvg: 95, vivinoScore: 4.5, priceUsd: 440 },
      { year: 2017, criticAvg: 96, vivinoScore: 4.6, priceUsd: 425 },
      { year: 2016, criticAvg: 96, vivinoScore: 4.6, priceUsd: 410 },
      { year: 2015, criticAvg: 95, vivinoScore: 4.5, priceUsd: 395 },
    ],
  },

  // COMTES LAFON - Meursault
  {
    producer: 'Domaine des Comtes Lafon',
    producerSlug: 'comtes-lafon',
    producerDesc: 'Legendary Meursault estate. Organic pioneer. Rich, textured, long-lived whites.',
    wine: 'Comtes Lafon Meursault',
    wineSlug: 'comtes-lafon-meursault',
    region: 'Meursault',
    grapes: ['Chardonnay'],
    vintages: [
      { year: 2022, criticAvg: 92, vivinoScore: 4.2, priceUsd: 120 },
      { year: 2021, criticAvg: 91, vivinoScore: 4.1, priceUsd: 115 },
      { year: 2020, criticAvg: 93, vivinoScore: 4.3, priceUsd: 110 },
      { year: 2019, criticAvg: 92, vivinoScore: 4.2, priceUsd: 105 },
      { year: 2018, criticAvg: 92, vivinoScore: 4.2, priceUsd: 100 },
      { year: 2017, criticAvg: 92, vivinoScore: 4.2, priceUsd: 95 },
      { year: 2016, criticAvg: 93, vivinoScore: 4.3, priceUsd: 90 },
      { year: 2015, criticAvg: 92, vivinoScore: 4.2, priceUsd: 85 },
    ],
  },
  {
    producer: 'Domaine des Comtes Lafon',
    producerSlug: 'comtes-lafon',
    producerDesc: 'Legendary Meursault estate. Organic pioneer. Rich, textured, long-lived whites.',
    wine: 'Comtes Lafon Meursault Clos de la Barre',
    wineSlug: 'comtes-lafon-clos-de-la-barre',
    region: 'Meursault',
    grapes: ['Chardonnay'],
    vintages: [
      { year: 2022, criticAvg: 93, vivinoScore: 4.3, priceUsd: 180 },
      { year: 2021, criticAvg: 92, vivinoScore: 4.2, priceUsd: 175 },
      { year: 2020, criticAvg: 94, vivinoScore: 4.4, priceUsd: 170 },
      { year: 2019, criticAvg: 93, vivinoScore: 4.3, priceUsd: 165 },
      { year: 2018, criticAvg: 93, vivinoScore: 4.3, priceUsd: 160 },
      { year: 2017, criticAvg: 93, vivinoScore: 4.3, priceUsd: 155 },
      { year: 2016, criticAvg: 94, vivinoScore: 4.4, priceUsd: 150 },
      { year: 2015, criticAvg: 93, vivinoScore: 4.3, priceUsd: 145 },
    ],
  },
  {
    producer: 'Domaine des Comtes Lafon',
    producerSlug: 'comtes-lafon',
    producerDesc: 'Legendary Meursault estate. Organic pioneer. Rich, textured, long-lived whites.',
    wine: 'Comtes Lafon Meursault Désirée',
    wineSlug: 'comtes-lafon-desiree',
    region: 'Meursault',
    grapes: ['Chardonnay'],
    vintages: [
      { year: 2022, criticAvg: 93, vivinoScore: 4.3, priceUsd: 200 },
      { year: 2021, criticAvg: 92, vivinoScore: 4.2, priceUsd: 195 },
      { year: 2020, criticAvg: 94, vivinoScore: 4.4, priceUsd: 190 },
      { year: 2019, criticAvg: 93, vivinoScore: 4.3, priceUsd: 185 },
      { year: 2018, criticAvg: 93, vivinoScore: 4.3, priceUsd: 180 },
      { year: 2017, criticAvg: 93, vivinoScore: 4.3, priceUsd: 175 },
      { year: 2016, criticAvg: 94, vivinoScore: 4.4, priceUsd: 170 },
      { year: 2015, criticAvg: 93, vivinoScore: 4.3, priceUsd: 165 },
    ],
  },
  {
    producer: 'Domaine des Comtes Lafon',
    producerSlug: 'comtes-lafon',
    producerDesc: 'Legendary Meursault estate. Organic pioneer. Rich, textured, long-lived whites.',
    wine: 'Comtes Lafon Meursault 1er Cru Goutte d\'Or',
    wineSlug: 'comtes-lafon-goutte-dor',
    region: 'Meursault',
    grapes: ['Chardonnay'],
    vintages: [
      { year: 2022, criticAvg: 95, vivinoScore: 4.5, priceUsd: 350 },
      { year: 2021, criticAvg: 94, vivinoScore: 4.4, priceUsd: 340 },
      { year: 2020, criticAvg: 96, vivinoScore: 4.6, priceUsd: 330 },
      { year: 2019, criticAvg: 95, vivinoScore: 4.5, priceUsd: 320 },
      { year: 2018, criticAvg: 95, vivinoScore: 4.5, priceUsd: 310 },
      { year: 2017, criticAvg: 95, vivinoScore: 4.5, priceUsd: 300 },
      { year: 2016, criticAvg: 96, vivinoScore: 4.6, priceUsd: 290 },
      { year: 2015, criticAvg: 95, vivinoScore: 4.5, priceUsd: 280 },
    ],
  },
  {
    producer: 'Domaine des Comtes Lafon',
    producerSlug: 'comtes-lafon',
    producerDesc: 'Legendary Meursault estate. Organic pioneer. Rich, textured, long-lived whites.',
    wine: 'Comtes Lafon Meursault 1er Cru Perrières',
    wineSlug: 'comtes-lafon-perrieres',
    region: 'Meursault',
    grapes: ['Chardonnay'],
    vintages: [
      { year: 2022, criticAvg: 96, vivinoScore: 4.6, priceUsd: 450 },
      { year: 2021, criticAvg: 95, vivinoScore: 4.5, priceUsd: 440 },
      { year: 2020, criticAvg: 97, vivinoScore: 4.7, priceUsd: 430 },
      { year: 2019, criticAvg: 96, vivinoScore: 4.6, priceUsd: 420 },
      { year: 2018, criticAvg: 95, vivinoScore: 4.5, priceUsd: 410 },
      { year: 2017, criticAvg: 96, vivinoScore: 4.6, priceUsd: 400 },
      { year: 2016, criticAvg: 96, vivinoScore: 4.6, priceUsd: 390 },
      { year: 2015, criticAvg: 95, vivinoScore: 4.5, priceUsd: 380 },
    ],
  },

  // MÉO-CAMUZET - Vosne-Romanée (RED)
  {
    producer: 'Domaine Méo-Camuzet',
    producerSlug: 'meo-camuzet',
    producerDesc: 'Top Vosne-Romanée estate. Elegant, perfumed Pinot Noir. Henri Jayer\'s influence.',
    wine: 'Méo-Camuzet Vosne-Romanée',
    wineSlug: 'meo-camuzet-vosne-romanee',
    region: 'Vosne-Romanée',
    grapes: ['Pinot Noir'],
    vintages: [
      { year: 2022, criticAvg: 92, vivinoScore: 4.2, priceUsd: 150 },
      { year: 2021, criticAvg: 91, vivinoScore: 4.1, priceUsd: 145 },
      { year: 2020, criticAvg: 93, vivinoScore: 4.3, priceUsd: 140 },
      { year: 2019, criticAvg: 92, vivinoScore: 4.2, priceUsd: 135 },
      { year: 2018, criticAvg: 92, vivinoScore: 4.2, priceUsd: 130 },
      { year: 2017, criticAvg: 92, vivinoScore: 4.2, priceUsd: 125 },
      { year: 2016, criticAvg: 93, vivinoScore: 4.3, priceUsd: 120 },
      { year: 2015, criticAvg: 92, vivinoScore: 4.2, priceUsd: 115 },
    ],
  },
  {
    producer: 'Domaine Méo-Camuzet',
    producerSlug: 'meo-camuzet',
    producerDesc: 'Top Vosne-Romanée estate. Elegant, perfumed Pinot Noir. Henri Jayer\'s influence.',
    wine: 'Méo-Camuzet Vosne-Romanée 1er Cru Les Chaumes',
    wineSlug: 'meo-camuzet-les-chaumes',
    region: 'Vosne-Romanée',
    grapes: ['Pinot Noir'],
    vintages: [
      { year: 2022, criticAvg: 94, vivinoScore: 4.4, priceUsd: 280 },
      { year: 2021, criticAvg: 93, vivinoScore: 4.3, priceUsd: 270 },
      { year: 2020, criticAvg: 95, vivinoScore: 4.5, priceUsd: 260 },
      { year: 2019, criticAvg: 94, vivinoScore: 4.4, priceUsd: 250 },
      { year: 2018, criticAvg: 94, vivinoScore: 4.4, priceUsd: 240 },
      { year: 2017, criticAvg: 94, vivinoScore: 4.4, priceUsd: 230 },
      { year: 2016, criticAvg: 95, vivinoScore: 4.5, priceUsd: 220 },
      { year: 2015, criticAvg: 94, vivinoScore: 4.4, priceUsd: 210 },
    ],
  },
  {
    producer: 'Domaine Méo-Camuzet',
    producerSlug: 'meo-camuzet',
    producerDesc: 'Top Vosne-Romanée estate. Elegant, perfumed Pinot Noir. Henri Jayer\'s influence.',
    wine: 'Méo-Camuzet Vosne-Romanée 1er Cru Aux Brûlées',
    wineSlug: 'meo-camuzet-aux-brulees',
    region: 'Vosne-Romanée',
    grapes: ['Pinot Noir'],
    vintages: [
      { year: 2022, criticAvg: 95, vivinoScore: 4.5, priceUsd: 450 },
      { year: 2021, criticAvg: 94, vivinoScore: 4.4, priceUsd: 440 },
      { year: 2020, criticAvg: 96, vivinoScore: 4.6, priceUsd: 430 },
      { year: 2019, criticAvg: 95, vivinoScore: 4.5, priceUsd: 420 },
      { year: 2018, criticAvg: 95, vivinoScore: 4.5, priceUsd: 410 },
      { year: 2017, criticAvg: 95, vivinoScore: 4.5, priceUsd: 400 },
      { year: 2016, criticAvg: 96, vivinoScore: 4.6, priceUsd: 390 },
      { year: 2015, criticAvg: 95, vivinoScore: 4.5, priceUsd: 380 },
    ],
  },
  {
    producer: 'Domaine Méo-Camuzet',
    producerSlug: 'meo-camuzet',
    producerDesc: 'Top Vosne-Romanée estate. Elegant, perfumed Pinot Noir. Henri Jayer\'s influence.',
    wine: 'Méo-Camuzet Nuits-Saint-Georges 1er Cru Aux Boudots',
    wineSlug: 'meo-camuzet-aux-boudots',
    region: 'Nuits-Saint-Georges',
    grapes: ['Pinot Noir'],
    vintages: [
      { year: 2022, criticAvg: 94, vivinoScore: 4.4, priceUsd: 250 },
      { year: 2021, criticAvg: 93, vivinoScore: 4.3, priceUsd: 240 },
      { year: 2020, criticAvg: 95, vivinoScore: 4.5, priceUsd: 230 },
      { year: 2019, criticAvg: 94, vivinoScore: 4.4, priceUsd: 220 },
      { year: 2018, criticAvg: 94, vivinoScore: 4.4, priceUsd: 210 },
      { year: 2017, criticAvg: 94, vivinoScore: 4.4, priceUsd: 200 },
      { year: 2016, criticAvg: 95, vivinoScore: 4.5, priceUsd: 190 },
      { year: 2015, criticAvg: 94, vivinoScore: 4.4, priceUsd: 180 },
    ],
  },
  {
    producer: 'Domaine Méo-Camuzet',
    producerSlug: 'meo-camuzet',
    producerDesc: 'Top Vosne-Romanée estate. Elegant, perfumed Pinot Noir. Henri Jayer\'s influence.',
    wine: 'Méo-Camuzet Clos de Vougeot Grand Cru',
    wineSlug: 'meo-camuzet-clos-vougeot',
    region: 'Clos de Vougeot',
    grapes: ['Pinot Noir'],
    vintages: [
      { year: 2022, criticAvg: 96, vivinoScore: 4.6, priceUsd: 550 },
      { year: 2021, criticAvg: 95, vivinoScore: 4.5, priceUsd: 530 },
      { year: 2020, criticAvg: 97, vivinoScore: 4.7, priceUsd: 510 },
      { year: 2019, criticAvg: 96, vivinoScore: 4.6, priceUsd: 490 },
      { year: 2018, criticAvg: 95, vivinoScore: 4.5, priceUsd: 470 },
      { year: 2017, criticAvg: 96, vivinoScore: 4.6, priceUsd: 450 },
      { year: 2016, criticAvg: 96, vivinoScore: 4.6, priceUsd: 430 },
      { year: 2015, criticAvg: 95, vivinoScore: 4.5, priceUsd: 410 },
    ],
  },
];

async function getOrCreateRegion(name: string): Promise<string> {
  const slug = name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/\s+/g, '-')
    .replace(/['']/g, '');
  const regionId = `region-${slug}`;
  await client.createIfNotExists({
    _type: 'region',
    _id: regionId,
    name: name,
    slug: { _type: 'slug', current: slug },
    country: 'France',
  });
  return regionId;
}

async function getOrCreateProducer(entry: WineEntry): Promise<string> {
  const producerId = `producer-${entry.producerSlug}`;
  await client.createIfNotExists({
    _type: 'producer',
    _id: producerId,
    name: entry.producer,
    description: entry.producerDesc,
  });
  return producerId;
}

async function main() {
  console.log('Seeding Burgundy producers (2015-2022)');
  console.log('='.repeat(60));

  let totalCreated = 0;
  let totalSkipped = 0;

  for (const entry of wines) {
    console.log(`\n${entry.wine}`);
    const producerId = await getOrCreateProducer(entry);
    const regionId = await getOrCreateRegion(entry.region);

    for (const vintage of entry.vintages) {
      const slug = `${entry.wineSlug}-${vintage.year}`;

      const existing = await client.fetch(
        `*[_type == "wine" && slug.current == $slug][0]{ _id }`,
        { slug }
      );

      if (existing) {
        process.stdout.write('.');
        totalSkipped++;
        continue;
      }

      const wineDoc = {
        _type: 'wine',
        _id: `wine-${slug}`,
        name: entry.wine,
        slug: { _type: 'slug', current: slug },
        vintage: vintage.year,
        grapeVarieties: entry.grapes,
        priceUsd: vintage.priceUsd,
        criticAvg: vintage.criticAvg,
        vivinoScore: vintage.vivinoScore,
        producer: { _type: 'reference', _ref: producerId },
        region: { _type: 'reference', _ref: regionId },
        hasAiReview: false,
      };

      await client.createOrReplace(wineDoc);
      process.stdout.write('+');
      totalCreated++;
    }
  }

  console.log(`\n\n${'='.repeat(60)}`);
  console.log(`Done: ${totalCreated} created, ${totalSkipped} skipped`);
  console.log(`Run: npx tsx scripts/generate-reviews.ts --limit 250`);
}

main().catch(console.error);
