/**
 * Seed Sonoma producers batch 2 (2010-2020)
 * Lynmar, Freeman, Martinelli, Paul Hobbs, Siduri, Jordan, Silver Oak,
 * Ridge Lytton Springs, Stonestreet, MacRostie, Ramey, Aperture,
 * Three Sticks, Patz & Hall, Hanzell, Hartford, Twomey
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
  flavorMentions: string[];
}

const wines: WineEntry[] = [
  {
    producer: 'Lynmar Estate',
    producerSlug: 'lynmar-estate',
    producerDesc: 'Russian River Valley estate since 1990. Elegant Pinot Noir and Chardonnay from Quail Hill vineyard.',
    wine: 'Lynmar Estate Quail Hill Pinot Noir',
    wineSlug: 'lynmar-quail-hill-pinot',
    region: 'Russian River Valley',
    grapes: ['Pinot Noir'],
    vintages: [
      { year: 2020, criticAvg: 94, vivinoScore: 4.4, priceUsd: 65 },
      { year: 2019, criticAvg: 95, vivinoScore: 4.5, priceUsd: 62 },
      { year: 2018, criticAvg: 94, vivinoScore: 4.4, priceUsd: 60 },
      { year: 2017, criticAvg: 93, vivinoScore: 4.3, priceUsd: 58 },
      { year: 2016, criticAvg: 94, vivinoScore: 4.4, priceUsd: 55 },
      { year: 2015, criticAvg: 95, vivinoScore: 4.5, priceUsd: 52 },
      { year: 2014, criticAvg: 93, vivinoScore: 4.3, priceUsd: 50 },
      { year: 2013, criticAvg: 94, vivinoScore: 4.4, priceUsd: 48 },
      { year: 2012, criticAvg: 95, vivinoScore: 4.5, priceUsd: 45 },
      { year: 2011, criticAvg: 92, vivinoScore: 4.2, priceUsd: 42 },
      { year: 2010, criticAvg: 94, vivinoScore: 4.4, priceUsd: 40 },
    ],
    flavorMentions: ['Cherry', 'Rose Petal', 'Spice', 'Earth', 'Cola'],
  },
  {
    producer: 'Freeman Vineyard & Winery',
    producerSlug: 'freeman-vineyard',
    producerDesc: 'Ken and Akiko Freeman\'s boutique winery. Burgundian approach to Russian River Pinot and Chardonnay.',
    wine: 'Freeman Russian River Valley Pinot Noir',
    wineSlug: 'freeman-rrv-pinot',
    region: 'Russian River Valley',
    grapes: ['Pinot Noir'],
    vintages: [
      { year: 2020, criticAvg: 93, vivinoScore: 4.3, priceUsd: 55 },
      { year: 2019, criticAvg: 94, vivinoScore: 4.4, priceUsd: 52 },
      { year: 2018, criticAvg: 93, vivinoScore: 4.3, priceUsd: 50 },
      { year: 2017, criticAvg: 92, vivinoScore: 4.2, priceUsd: 48 },
      { year: 2016, criticAvg: 93, vivinoScore: 4.3, priceUsd: 45 },
      { year: 2015, criticAvg: 94, vivinoScore: 4.4, priceUsd: 42 },
      { year: 2014, criticAvg: 92, vivinoScore: 4.2, priceUsd: 40 },
      { year: 2013, criticAvg: 93, vivinoScore: 4.3, priceUsd: 38 },
      { year: 2012, criticAvg: 94, vivinoScore: 4.4, priceUsd: 35 },
      { year: 2011, criticAvg: 91, vivinoScore: 4.1, priceUsd: 32 },
      { year: 2010, criticAvg: 93, vivinoScore: 4.3, priceUsd: 30 },
    ],
    flavorMentions: ['Raspberry', 'Violet', 'Black Tea', 'Mushroom', 'Herbs'],
  },
  {
    producer: 'Martinelli Winery',
    producerSlug: 'martinelli-winery',
    producerDesc: 'Fifth-generation Sonoma family. Jackass Hill vineyard legend. Big, concentrated wines.',
    wine: 'Martinelli Russian River Valley Pinot Noir',
    wineSlug: 'martinelli-rrv-pinot',
    region: 'Russian River Valley',
    grapes: ['Pinot Noir'],
    vintages: [
      { year: 2020, criticAvg: 94, vivinoScore: 4.4, priceUsd: 60 },
      { year: 2019, criticAvg: 95, vivinoScore: 4.5, priceUsd: 58 },
      { year: 2018, criticAvg: 94, vivinoScore: 4.4, priceUsd: 55 },
      { year: 2017, criticAvg: 93, vivinoScore: 4.3, priceUsd: 52 },
      { year: 2016, criticAvg: 94, vivinoScore: 4.4, priceUsd: 50 },
      { year: 2015, criticAvg: 95, vivinoScore: 4.5, priceUsd: 48 },
      { year: 2014, criticAvg: 93, vivinoScore: 4.3, priceUsd: 45 },
      { year: 2013, criticAvg: 94, vivinoScore: 4.4, priceUsd: 42 },
      { year: 2012, criticAvg: 95, vivinoScore: 4.5, priceUsd: 40 },
      { year: 2011, criticAvg: 92, vivinoScore: 4.2, priceUsd: 38 },
      { year: 2010, criticAvg: 94, vivinoScore: 4.4, priceUsd: 35 },
    ],
    flavorMentions: ['Blackberry', 'Plum', 'Cocoa', 'Licorice', 'Forest Floor'],
  },
  {
    producer: 'Paul Hobbs Winery',
    producerSlug: 'paul-hobbs',
    producerDesc: 'Master winemaker. Global consulting legend. Russian River estate wines of exceptional precision.',
    wine: 'Paul Hobbs Russian River Valley Pinot Noir',
    wineSlug: 'paul-hobbs-rrv-pinot',
    region: 'Russian River Valley',
    grapes: ['Pinot Noir'],
    vintages: [
      { year: 2020, criticAvg: 94, vivinoScore: 4.4, priceUsd: 70 },
      { year: 2019, criticAvg: 95, vivinoScore: 4.5, priceUsd: 68 },
      { year: 2018, criticAvg: 94, vivinoScore: 4.4, priceUsd: 65 },
      { year: 2017, criticAvg: 93, vivinoScore: 4.3, priceUsd: 62 },
      { year: 2016, criticAvg: 94, vivinoScore: 4.4, priceUsd: 60 },
      { year: 2015, criticAvg: 95, vivinoScore: 4.5, priceUsd: 58 },
      { year: 2014, criticAvg: 93, vivinoScore: 4.3, priceUsd: 55 },
      { year: 2013, criticAvg: 94, vivinoScore: 4.4, priceUsd: 52 },
      { year: 2012, criticAvg: 95, vivinoScore: 4.5, priceUsd: 50 },
      { year: 2011, criticAvg: 92, vivinoScore: 4.2, priceUsd: 48 },
      { year: 2010, criticAvg: 94, vivinoScore: 4.4, priceUsd: 45 },
    ],
    flavorMentions: ['Dark Cherry', 'Lavender', 'Graphite', 'Sage', 'Iron'],
  },
  {
    producer: 'Siduri Wines',
    producerSlug: 'siduri-wines',
    producerDesc: 'Pinot Noir specialists since 1994. Adam Lee\'s vision. Wide range of single-vineyard bottlings.',
    wine: 'Siduri Russian River Valley Pinot Noir',
    wineSlug: 'siduri-rrv-pinot',
    region: 'Russian River Valley',
    grapes: ['Pinot Noir'],
    vintages: [
      { year: 2020, criticAvg: 92, vivinoScore: 4.2, priceUsd: 35 },
      { year: 2019, criticAvg: 93, vivinoScore: 4.3, priceUsd: 33 },
      { year: 2018, criticAvg: 92, vivinoScore: 4.2, priceUsd: 32 },
      { year: 2017, criticAvg: 91, vivinoScore: 4.1, priceUsd: 30 },
      { year: 2016, criticAvg: 92, vivinoScore: 4.2, priceUsd: 28 },
      { year: 2015, criticAvg: 93, vivinoScore: 4.3, priceUsd: 26 },
      { year: 2014, criticAvg: 91, vivinoScore: 4.1, priceUsd: 25 },
      { year: 2013, criticAvg: 92, vivinoScore: 4.2, priceUsd: 24 },
      { year: 2012, criticAvg: 93, vivinoScore: 4.3, priceUsd: 22 },
      { year: 2011, criticAvg: 90, vivinoScore: 4.0, priceUsd: 20 },
      { year: 2010, criticAvg: 92, vivinoScore: 4.2, priceUsd: 18 },
    ],
    flavorMentions: ['Cranberry', 'Pomegranate', 'Clove', 'Wet Stone', 'Tobacco'],
  },
  {
    producer: 'Jordan Vineyard & Winery',
    producerSlug: 'jordan-vineyard',
    producerDesc: 'Alexander Valley icon since 1972. Bordeaux-inspired elegance. Estate-grown Cabernet Sauvignon.',
    wine: 'Jordan Alexander Valley Cabernet Sauvignon',
    wineSlug: 'jordan-av-cabernet',
    region: 'Alexander Valley',
    grapes: ['Cabernet Sauvignon'],
    vintages: [
      { year: 2020, criticAvg: 93, vivinoScore: 4.3, priceUsd: 60 },
      { year: 2019, criticAvg: 94, vivinoScore: 4.4, priceUsd: 58 },
      { year: 2018, criticAvg: 93, vivinoScore: 4.3, priceUsd: 55 },
      { year: 2017, criticAvg: 92, vivinoScore: 4.2, priceUsd: 52 },
      { year: 2016, criticAvg: 93, vivinoScore: 4.3, priceUsd: 50 },
      { year: 2015, criticAvg: 94, vivinoScore: 4.4, priceUsd: 48 },
      { year: 2014, criticAvg: 93, vivinoScore: 4.3, priceUsd: 45 },
      { year: 2013, criticAvg: 94, vivinoScore: 4.4, priceUsd: 42 },
      { year: 2012, criticAvg: 93, vivinoScore: 4.3, priceUsd: 40 },
      { year: 2011, criticAvg: 91, vivinoScore: 4.1, priceUsd: 38 },
      { year: 2010, criticAvg: 93, vivinoScore: 4.3, priceUsd: 35 },
    ],
    flavorMentions: ['Cassis', 'Cedar', 'Olive', 'Tobacco', 'Graphite'],
  },
  {
    producer: 'Silver Oak',
    producerSlug: 'silver-oak',
    producerDesc: 'Alexander Valley Cabernet icon since 1972. American oak aging. Consistently approachable style.',
    wine: 'Silver Oak Alexander Valley Cabernet Sauvignon',
    wineSlug: 'silver-oak-av-cabernet',
    region: 'Alexander Valley',
    grapes: ['Cabernet Sauvignon'],
    vintages: [
      { year: 2019, criticAvg: 93, vivinoScore: 4.3, priceUsd: 90 },
      { year: 2018, criticAvg: 94, vivinoScore: 4.4, priceUsd: 88 },
      { year: 2017, criticAvg: 93, vivinoScore: 4.3, priceUsd: 85 },
      { year: 2016, criticAvg: 94, vivinoScore: 4.4, priceUsd: 82 },
      { year: 2015, criticAvg: 95, vivinoScore: 4.5, priceUsd: 80 },
      { year: 2014, criticAvg: 93, vivinoScore: 4.3, priceUsd: 78 },
      { year: 2013, criticAvg: 94, vivinoScore: 4.4, priceUsd: 75 },
      { year: 2012, criticAvg: 93, vivinoScore: 4.3, priceUsd: 72 },
      { year: 2011, criticAvg: 92, vivinoScore: 4.2, priceUsd: 70 },
      { year: 2010, criticAvg: 94, vivinoScore: 4.4, priceUsd: 68 },
    ],
    flavorMentions: ['Vanilla', 'Blackberry', 'Dill', 'Cocoa', 'Leather'],
  },
  {
    producer: 'Ridge Vineyards',
    producerSlug: 'ridge-vineyards',
    producerDesc: 'California legend since 1962. Lytton Springs old-vine Zinfandel. Natural winemaking pioneer.',
    wine: 'Ridge Lytton Springs',
    wineSlug: 'ridge-lytton-springs',
    region: 'Dry Creek Valley',
    grapes: ['Zinfandel', 'Petite Sirah', 'Carignane'],
    vintages: [
      { year: 2020, criticAvg: 94, vivinoScore: 4.4, priceUsd: 42 },
      { year: 2019, criticAvg: 95, vivinoScore: 4.5, priceUsd: 40 },
      { year: 2018, criticAvg: 94, vivinoScore: 4.4, priceUsd: 38 },
      { year: 2017, criticAvg: 93, vivinoScore: 4.3, priceUsd: 36 },
      { year: 2016, criticAvg: 94, vivinoScore: 4.4, priceUsd: 35 },
      { year: 2015, criticAvg: 95, vivinoScore: 4.5, priceUsd: 34 },
      { year: 2014, criticAvg: 94, vivinoScore: 4.4, priceUsd: 32 },
      { year: 2013, criticAvg: 95, vivinoScore: 4.5, priceUsd: 30 },
      { year: 2012, criticAvg: 94, vivinoScore: 4.4, priceUsd: 28 },
      { year: 2011, criticAvg: 93, vivinoScore: 4.3, priceUsd: 26 },
      { year: 2010, criticAvg: 94, vivinoScore: 4.4, priceUsd: 25 },
    ],
    flavorMentions: ['Briary', 'Black Pepper', 'Raspberry', 'Tar', 'Licorice'],
  },
  {
    producer: 'Stonestreet Estate Vineyards',
    producerSlug: 'stonestreet-estate',
    producerDesc: 'Alexander Mountain Estate. High-elevation Cabernet and Chardonnay. Jackson Family Wines.',
    wine: 'Stonestreet Estate Cabernet Sauvignon',
    wineSlug: 'stonestreet-estate-cabernet',
    region: 'Alexander Valley',
    grapes: ['Cabernet Sauvignon'],
    vintages: [
      { year: 2020, criticAvg: 93, vivinoScore: 4.3, priceUsd: 55 },
      { year: 2019, criticAvg: 94, vivinoScore: 4.4, priceUsd: 52 },
      { year: 2018, criticAvg: 93, vivinoScore: 4.3, priceUsd: 50 },
      { year: 2017, criticAvg: 92, vivinoScore: 4.2, priceUsd: 48 },
      { year: 2016, criticAvg: 93, vivinoScore: 4.3, priceUsd: 45 },
      { year: 2015, criticAvg: 94, vivinoScore: 4.4, priceUsd: 42 },
      { year: 2014, criticAvg: 93, vivinoScore: 4.3, priceUsd: 40 },
      { year: 2013, criticAvg: 94, vivinoScore: 4.4, priceUsd: 38 },
      { year: 2012, criticAvg: 93, vivinoScore: 4.3, priceUsd: 35 },
      { year: 2011, criticAvg: 91, vivinoScore: 4.1, priceUsd: 32 },
      { year: 2010, criticAvg: 93, vivinoScore: 4.3, priceUsd: 30 },
    ],
    flavorMentions: ['Blackcurrant', 'Mountain Herbs', 'Espresso', 'Slate', 'Violet'],
  },
  {
    producer: 'MacRostie Winery',
    producerSlug: 'macrostie-winery',
    producerDesc: 'Steve MacRostie\'s 40-year legacy. Sonoma Coast Pinot and Chardonnay specialist.',
    wine: 'MacRostie Sonoma Coast Pinot Noir',
    wineSlug: 'macrostie-sonoma-coast-pinot',
    region: 'Sonoma Coast',
    grapes: ['Pinot Noir'],
    vintages: [
      { year: 2020, criticAvg: 92, vivinoScore: 4.2, priceUsd: 35 },
      { year: 2019, criticAvg: 93, vivinoScore: 4.3, priceUsd: 33 },
      { year: 2018, criticAvg: 92, vivinoScore: 4.2, priceUsd: 32 },
      { year: 2017, criticAvg: 91, vivinoScore: 4.1, priceUsd: 30 },
      { year: 2016, criticAvg: 92, vivinoScore: 4.2, priceUsd: 28 },
      { year: 2015, criticAvg: 93, vivinoScore: 4.3, priceUsd: 26 },
      { year: 2014, criticAvg: 91, vivinoScore: 4.1, priceUsd: 25 },
      { year: 2013, criticAvg: 92, vivinoScore: 4.2, priceUsd: 24 },
      { year: 2012, criticAvg: 93, vivinoScore: 4.3, priceUsd: 22 },
      { year: 2011, criticAvg: 90, vivinoScore: 4.0, priceUsd: 20 },
      { year: 2010, criticAvg: 92, vivinoScore: 4.2, priceUsd: 18 },
    ],
    flavorMentions: ['Strawberry', 'White Pepper', 'Chamomile', 'Sea Salt', 'Thyme'],
  },
  {
    producer: 'Ramey Wine Cellars',
    producerSlug: 'ramey-wine-cellars',
    producerDesc: 'David Ramey\'s celebrated project. Burgundian Chardonnay master. Elegant single-vineyard focus.',
    wine: 'Ramey Russian River Valley Chardonnay',
    wineSlug: 'ramey-rrv-chardonnay',
    region: 'Russian River Valley',
    grapes: ['Chardonnay'],
    vintages: [
      { year: 2020, criticAvg: 93, vivinoScore: 4.3, priceUsd: 45 },
      { year: 2019, criticAvg: 94, vivinoScore: 4.4, priceUsd: 42 },
      { year: 2018, criticAvg: 93, vivinoScore: 4.3, priceUsd: 40 },
      { year: 2017, criticAvg: 92, vivinoScore: 4.2, priceUsd: 38 },
      { year: 2016, criticAvg: 93, vivinoScore: 4.3, priceUsd: 35 },
      { year: 2015, criticAvg: 94, vivinoScore: 4.4, priceUsd: 32 },
      { year: 2014, criticAvg: 93, vivinoScore: 4.3, priceUsd: 30 },
      { year: 2013, criticAvg: 94, vivinoScore: 4.4, priceUsd: 28 },
      { year: 2012, criticAvg: 93, vivinoScore: 4.3, priceUsd: 26 },
      { year: 2011, criticAvg: 91, vivinoScore: 4.1, priceUsd: 24 },
      { year: 2010, criticAvg: 93, vivinoScore: 4.3, priceUsd: 22 },
    ],
    flavorMentions: ['Lemon Curd', 'Hazelnut', 'Brioche', 'Wet Stone', 'White Flower'],
  },
  {
    producer: 'Aperture Cellars',
    producerSlug: 'aperture-cellars',
    producerDesc: 'Jesse Katz\'s Alexander Valley project. Photographer\'s eye for detail. Bold red blends.',
    wine: 'Aperture Alexander Valley Cabernet Sauvignon',
    wineSlug: 'aperture-av-cabernet',
    region: 'Alexander Valley',
    grapes: ['Cabernet Sauvignon'],
    vintages: [
      { year: 2020, criticAvg: 94, vivinoScore: 4.4, priceUsd: 65 },
      { year: 2019, criticAvg: 95, vivinoScore: 4.5, priceUsd: 62 },
      { year: 2018, criticAvg: 94, vivinoScore: 4.4, priceUsd: 60 },
      { year: 2017, criticAvg: 93, vivinoScore: 4.3, priceUsd: 58 },
      { year: 2016, criticAvg: 94, vivinoScore: 4.4, priceUsd: 55 },
      { year: 2015, criticAvg: 95, vivinoScore: 4.5, priceUsd: 52 },
      { year: 2014, criticAvg: 93, vivinoScore: 4.3, priceUsd: 50 },
      { year: 2013, criticAvg: 94, vivinoScore: 4.4, priceUsd: 48 },
      { year: 2012, criticAvg: 93, vivinoScore: 4.3, priceUsd: 45 },
      { year: 2011, criticAvg: 92, vivinoScore: 4.2, priceUsd: 42 },
      { year: 2010, criticAvg: 94, vivinoScore: 4.4, priceUsd: 40 },
    ],
    flavorMentions: ['Black Cherry', 'Mocha', 'Graphite', 'Bay Leaf', 'Dark Chocolate'],
  },
  {
    producer: 'Three Sticks Wines',
    producerSlug: 'three-sticks-wines',
    producerDesc: 'Bill Price\'s Sonoma project. Durell Vineyard pioneer. Elegant Pinot and Chardonnay.',
    wine: 'Three Sticks Sonoma Coast Pinot Noir',
    wineSlug: 'three-sticks-sonoma-pinot',
    region: 'Sonoma Coast',
    grapes: ['Pinot Noir'],
    vintages: [
      { year: 2020, criticAvg: 93, vivinoScore: 4.3, priceUsd: 55 },
      { year: 2019, criticAvg: 94, vivinoScore: 4.4, priceUsd: 52 },
      { year: 2018, criticAvg: 93, vivinoScore: 4.3, priceUsd: 50 },
      { year: 2017, criticAvg: 92, vivinoScore: 4.2, priceUsd: 48 },
      { year: 2016, criticAvg: 93, vivinoScore: 4.3, priceUsd: 45 },
      { year: 2015, criticAvg: 94, vivinoScore: 4.4, priceUsd: 42 },
      { year: 2014, criticAvg: 92, vivinoScore: 4.2, priceUsd: 40 },
      { year: 2013, criticAvg: 93, vivinoScore: 4.3, priceUsd: 38 },
      { year: 2012, criticAvg: 94, vivinoScore: 4.4, priceUsd: 35 },
      { year: 2011, criticAvg: 91, vivinoScore: 4.1, priceUsd: 32 },
      { year: 2010, criticAvg: 93, vivinoScore: 4.3, priceUsd: 30 },
    ],
    flavorMentions: ['Boysenberry', 'Rose Hip', 'Sandalwood', 'Dried Herbs', 'Mineral'],
  },
  {
    producer: 'Patz & Hall',
    producerSlug: 'patz-and-hall',
    producerDesc: 'Sonoma single-vineyard specialists since 1988. James Hall\'s Burgundian precision.',
    wine: 'Patz & Hall Sonoma Coast Pinot Noir',
    wineSlug: 'patz-hall-sonoma-pinot',
    region: 'Sonoma Coast',
    grapes: ['Pinot Noir'],
    vintages: [
      { year: 2020, criticAvg: 93, vivinoScore: 4.3, priceUsd: 50 },
      { year: 2019, criticAvg: 94, vivinoScore: 4.4, priceUsd: 48 },
      { year: 2018, criticAvg: 93, vivinoScore: 4.3, priceUsd: 45 },
      { year: 2017, criticAvg: 92, vivinoScore: 4.2, priceUsd: 42 },
      { year: 2016, criticAvg: 93, vivinoScore: 4.3, priceUsd: 40 },
      { year: 2015, criticAvg: 94, vivinoScore: 4.4, priceUsd: 38 },
      { year: 2014, criticAvg: 92, vivinoScore: 4.2, priceUsd: 35 },
      { year: 2013, criticAvg: 93, vivinoScore: 4.3, priceUsd: 32 },
      { year: 2012, criticAvg: 94, vivinoScore: 4.4, priceUsd: 30 },
      { year: 2011, criticAvg: 91, vivinoScore: 4.1, priceUsd: 28 },
      { year: 2010, criticAvg: 93, vivinoScore: 4.3, priceUsd: 25 },
    ],
    flavorMentions: ['Wild Cherry', 'Sage', 'Wet Earth', 'Cinnamon', 'Iron'],
  },
  {
    producer: 'Hanzell Vineyards',
    producerSlug: 'hanzell-vineyards',
    producerDesc: 'California wine history since 1953. First temperature-controlled fermentation. Sonoma Mountain estate.',
    wine: 'Hanzell Sonoma Valley Pinot Noir',
    wineSlug: 'hanzell-sonoma-pinot',
    region: 'Sonoma Valley',
    grapes: ['Pinot Noir'],
    vintages: [
      { year: 2020, criticAvg: 94, vivinoScore: 4.4, priceUsd: 85 },
      { year: 2019, criticAvg: 95, vivinoScore: 4.5, priceUsd: 82 },
      { year: 2018, criticAvg: 94, vivinoScore: 4.4, priceUsd: 80 },
      { year: 2017, criticAvg: 93, vivinoScore: 4.3, priceUsd: 78 },
      { year: 2016, criticAvg: 94, vivinoScore: 4.4, priceUsd: 75 },
      { year: 2015, criticAvg: 95, vivinoScore: 4.5, priceUsd: 72 },
      { year: 2014, criticAvg: 93, vivinoScore: 4.3, priceUsd: 70 },
      { year: 2013, criticAvg: 94, vivinoScore: 4.4, priceUsd: 68 },
      { year: 2012, criticAvg: 95, vivinoScore: 4.5, priceUsd: 65 },
      { year: 2011, criticAvg: 92, vivinoScore: 4.2, priceUsd: 62 },
      { year: 2010, criticAvg: 94, vivinoScore: 4.4, priceUsd: 60 },
    ],
    flavorMentions: ['Red Plum', 'Tea Leaf', 'Saffron', 'Forest Floor', 'Truffle'],
  },
  {
    producer: 'Hartford Family Winery',
    producerSlug: 'hartford-family',
    producerDesc: 'Don Hartford\'s single-vineyard focus since 1994. Jackson Family Wines. Old-vine Zin and Pinot.',
    wine: 'Hartford Russian River Valley Pinot Noir',
    wineSlug: 'hartford-rrv-pinot',
    region: 'Russian River Valley',
    grapes: ['Pinot Noir'],
    vintages: [
      { year: 2020, criticAvg: 93, vivinoScore: 4.3, priceUsd: 45 },
      { year: 2019, criticAvg: 94, vivinoScore: 4.4, priceUsd: 42 },
      { year: 2018, criticAvg: 93, vivinoScore: 4.3, priceUsd: 40 },
      { year: 2017, criticAvg: 92, vivinoScore: 4.2, priceUsd: 38 },
      { year: 2016, criticAvg: 93, vivinoScore: 4.3, priceUsd: 35 },
      { year: 2015, criticAvg: 94, vivinoScore: 4.4, priceUsd: 32 },
      { year: 2014, criticAvg: 92, vivinoScore: 4.2, priceUsd: 30 },
      { year: 2013, criticAvg: 93, vivinoScore: 4.3, priceUsd: 28 },
      { year: 2012, criticAvg: 94, vivinoScore: 4.4, priceUsd: 26 },
      { year: 2011, criticAvg: 91, vivinoScore: 4.1, priceUsd: 24 },
      { year: 2010, criticAvg: 93, vivinoScore: 4.3, priceUsd: 22 },
    ],
    flavorMentions: ['Black Cherry', 'Violet', 'Clove', 'Loam', 'Sassafras'],
  },
  {
    producer: 'Twomey Cellars',
    producerSlug: 'twomey-cellars',
    producerDesc: 'Silver Oak sister winery. Duncan family\'s Pinot Noir and Sauvignon Blanc project.',
    wine: 'Twomey Russian River Valley Pinot Noir',
    wineSlug: 'twomey-rrv-pinot',
    region: 'Russian River Valley',
    grapes: ['Pinot Noir'],
    vintages: [
      { year: 2020, criticAvg: 93, vivinoScore: 4.3, priceUsd: 55 },
      { year: 2019, criticAvg: 94, vivinoScore: 4.4, priceUsd: 52 },
      { year: 2018, criticAvg: 93, vivinoScore: 4.3, priceUsd: 50 },
      { year: 2017, criticAvg: 92, vivinoScore: 4.2, priceUsd: 48 },
      { year: 2016, criticAvg: 93, vivinoScore: 4.3, priceUsd: 45 },
      { year: 2015, criticAvg: 94, vivinoScore: 4.4, priceUsd: 42 },
      { year: 2014, criticAvg: 92, vivinoScore: 4.2, priceUsd: 40 },
      { year: 2013, criticAvg: 93, vivinoScore: 4.3, priceUsd: 38 },
      { year: 2012, criticAvg: 94, vivinoScore: 4.4, priceUsd: 35 },
      { year: 2011, criticAvg: 91, vivinoScore: 4.1, priceUsd: 32 },
      { year: 2010, criticAvg: 93, vivinoScore: 4.3, priceUsd: 30 },
    ],
    flavorMentions: ['Bing Cherry', 'Rose', 'Baking Spice', 'Cola', 'Mushroom'],
  },
];

async function getOrCreateRegion(name: string): Promise<string> {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const regionId = `region-${slug}`;
  const region = await client.fetch(
    `*[_type == "region" && _id == $id][0]{ _id }`,
    { id: regionId }
  );
  if (!region) {
    await client.createIfNotExists({
      _type: 'region',
      _id: regionId,
      name: name,
      slug: { _type: 'slug', current: slug },
      country: 'USA',
    });
  }
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
  console.log('Seeding Sonoma producers batch 2 (2010-2020)');
  console.log('='.repeat(60));

  let totalCreated = 0;
  let totalSkipped = 0;

  for (const entry of wines) {
    console.log(`\n${entry.producer}`);
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
        flavorMentions: entry.flavorMentions,
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
  console.log(`Run: npx tsx scripts/generate-reviews.ts --limit 200`);
}

main().catch(console.error);
