/**
 * Seed Sonoma/California Pinot Noir & Chardonnay producers 2010-2020
 * Williams Selyem, Kosta Browne, Littorai, Kistler, Marcassin,
 * Peter Michael, Flowers, Hirsch, Rochioli, Gary Farrell,
 * Merry Edwards, Failla, Peay, Cobb, DuMOL
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
    producer: 'Williams Selyem',
    producerSlug: 'williams-selyem',
    producerDesc: 'Iconic Russian River producer. Cult status since the 1980s. Known for elegant, terroir-driven Pinot Noir.',
    wine: 'Williams Selyem Russian River Valley Pinot Noir',
    wineSlug: 'williams-selyem-rrv-pinot',
    region: 'Russian River Valley',
    grapes: ['Pinot Noir'],
    vintages: [
      { year: 2020, criticAvg: 94, vivinoScore: 4.4, priceUsd: 75 },
      { year: 2019, criticAvg: 95, vivinoScore: 4.5, priceUsd: 72 },
      { year: 2018, criticAvg: 94, vivinoScore: 4.4, priceUsd: 70 },
      { year: 2017, criticAvg: 93, vivinoScore: 4.3, priceUsd: 68 },
      { year: 2016, criticAvg: 94, vivinoScore: 4.4, priceUsd: 65 },
      { year: 2015, criticAvg: 95, vivinoScore: 4.5, priceUsd: 62 },
      { year: 2014, criticAvg: 93, vivinoScore: 4.3, priceUsd: 60 },
      { year: 2013, criticAvg: 94, vivinoScore: 4.4, priceUsd: 58 },
      { year: 2012, criticAvg: 95, vivinoScore: 4.5, priceUsd: 55 },
      { year: 2011, criticAvg: 92, vivinoScore: 4.2, priceUsd: 52 },
      { year: 2010, criticAvg: 94, vivinoScore: 4.4, priceUsd: 50 },
    ],
    flavorMentions: ['Bing Cherry', 'Black Tea', 'Spice', 'Sarsaparilla', 'Earth'],
  },
  {
    producer: 'Kosta Browne',
    producerSlug: 'kosta-browne',
    producerDesc: 'Modern Sonoma icon. Plush, expressive Pinot Noirs. Founded by two restaurant sommeliers in 1997.',
    wine: 'Kosta Browne Sonoma Coast Pinot Noir',
    wineSlug: 'kosta-browne-sonoma-coast-pinot',
    region: 'Sonoma Coast',
    grapes: ['Pinot Noir'],
    vintages: [
      { year: 2020, criticAvg: 94, vivinoScore: 4.4, priceUsd: 85 },
      { year: 2019, criticAvg: 95, vivinoScore: 4.5, priceUsd: 82 },
      { year: 2018, criticAvg: 94, vivinoScore: 4.4, priceUsd: 80 },
      { year: 2017, criticAvg: 93, vivinoScore: 4.3, priceUsd: 78 },
      { year: 2016, criticAvg: 94, vivinoScore: 4.4, priceUsd: 75 },
      { year: 2015, criticAvg: 95, vivinoScore: 4.5, priceUsd: 72 },
      { year: 2014, criticAvg: 94, vivinoScore: 4.4, priceUsd: 70 },
      { year: 2013, criticAvg: 93, vivinoScore: 4.3, priceUsd: 68 },
      { year: 2012, criticAvg: 95, vivinoScore: 4.5, priceUsd: 65 },
      { year: 2011, criticAvg: 92, vivinoScore: 4.2, priceUsd: 62 },
      { year: 2010, criticAvg: 94, vivinoScore: 4.4, priceUsd: 60 },
    ],
    flavorMentions: ['Boysenberry', 'Dried Strawberry', 'Forest Floor', 'Mocha', 'Sea Spray'],
  },
  {
    producer: 'Littorai',
    producerSlug: 'littorai',
    producerDesc: 'Ted Lemon\'s biodynamic project. Burgundian approach. Single-vineyard focus from Sonoma Coast and Anderson Valley.',
    wine: 'Littorai Sonoma Coast Pinot Noir',
    wineSlug: 'littorai-sonoma-coast-pinot',
    region: 'Sonoma Coast',
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
    flavorMentions: ['Blood Orange', 'Lavender', 'Crushed Stone', 'Herbs', 'Iron'],
  },
  {
    producer: 'Kistler Vineyards',
    producerSlug: 'kistler-vineyards',
    producerDesc: 'California Chardonnay benchmark since 1979. Burgundian methods. Ridge-top Sonoma vineyards.',
    wine: 'Kistler Les Noisetiers Chardonnay',
    wineSlug: 'kistler-les-noisetiers-chard',
    region: 'Sonoma Coast',
    grapes: ['Chardonnay'],
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
    flavorMentions: ['Citrus', 'Stone Fruit', 'Minerality', 'Hazelnut', 'Chamomile'],
  },
  {
    producer: 'Marcassin',
    producerSlug: 'marcassin',
    producerDesc: 'Helen Turley\'s cult project. California\'s most collectible Pinot Noir and Chardonnay. Tiny production.',
    wine: 'Marcassin Marcassin Vineyard Pinot Noir',
    wineSlug: 'marcassin-pinot',
    region: 'Sonoma Coast',
    grapes: ['Pinot Noir'],
    vintages: [
      { year: 2018, criticAvg: 97, vivinoScore: 4.7, priceUsd: 350 },
      { year: 2017, criticAvg: 96, vivinoScore: 4.6, priceUsd: 340 },
      { year: 2016, criticAvg: 97, vivinoScore: 4.7, priceUsd: 330 },
      { year: 2015, criticAvg: 98, vivinoScore: 4.8, priceUsd: 320 },
      { year: 2014, criticAvg: 96, vivinoScore: 4.6, priceUsd: 310 },
      { year: 2013, criticAvg: 97, vivinoScore: 4.7, priceUsd: 300 },
      { year: 2012, criticAvg: 98, vivinoScore: 4.8, priceUsd: 290 },
      { year: 2011, criticAvg: 95, vivinoScore: 4.5, priceUsd: 280 },
      { year: 2010, criticAvg: 97, vivinoScore: 4.7, priceUsd: 270 },
    ],
    flavorMentions: ['Framboise', 'Forest Floor', 'Black Cherry', 'Earth', 'Spice Box'],
  },
  {
    producer: 'Peter Michael Winery',
    producerSlug: 'peter-michael',
    producerDesc: 'Knights Valley estate. Bordeaux and Burgundy varieties. Founded 1982 by Sir Peter Michael.',
    wine: 'Peter Michael Ma Belle-Fille Chardonnay',
    wineSlug: 'peter-michael-ma-belle-fille',
    region: 'Knights Valley',
    grapes: ['Chardonnay'],
    vintages: [
      { year: 2020, criticAvg: 96, vivinoScore: 4.6, priceUsd: 125 },
      { year: 2019, criticAvg: 97, vivinoScore: 4.7, priceUsd: 120 },
      { year: 2018, criticAvg: 96, vivinoScore: 4.6, priceUsd: 115 },
      { year: 2017, criticAvg: 95, vivinoScore: 4.5, priceUsd: 110 },
      { year: 2016, criticAvg: 96, vivinoScore: 4.6, priceUsd: 105 },
      { year: 2015, criticAvg: 97, vivinoScore: 4.7, priceUsd: 100 },
      { year: 2014, criticAvg: 95, vivinoScore: 4.5, priceUsd: 95 },
      { year: 2013, criticAvg: 96, vivinoScore: 4.6, priceUsd: 90 },
      { year: 2012, criticAvg: 97, vivinoScore: 4.7, priceUsd: 85 },
      { year: 2011, criticAvg: 94, vivinoScore: 4.4, priceUsd: 80 },
      { year: 2010, criticAvg: 96, vivinoScore: 4.6, priceUsd: 75 },
    ],
    flavorMentions: ['Lemon Curd', 'Brioche', 'Honeysuckle', 'Mineral', 'White Peach'],
  },
  {
    producer: 'Flowers Vineyards',
    producerSlug: 'flowers-vineyards',
    producerDesc: 'Extreme Sonoma Coast pioneer since 1989. Ocean-influenced vineyards. Organic farming.',
    wine: 'Flowers Sonoma Coast Pinot Noir',
    wineSlug: 'flowers-sonoma-coast-pinot',
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
    flavorMentions: ['Cranberry', 'Blood Orange', 'Forest Floor', 'Black Tea', 'Licorice'],
  },
  {
    producer: 'Hirsch Vineyards',
    producerSlug: 'hirsch-vineyards',
    producerDesc: 'True Sonoma Coast pioneer. San Andreas Fault terroir. 40-year-old vines. Organic and biodynamic.',
    wine: 'Hirsch San Andreas Fault Pinot Noir',
    wineSlug: 'hirsch-san-andreas-pinot',
    region: 'Sonoma Coast',
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
    flavorMentions: ['Red Cherry', 'Pine Forest', 'Bramble', 'Minerality', 'Smoke'],
  },
  {
    producer: 'Rochioli Vineyards',
    producerSlug: 'rochioli-vineyards',
    producerDesc: 'Russian River Valley legend since 1930s. Third-generation family. Helped establish the AVA.',
    wine: 'Rochioli Estate Pinot Noir',
    wineSlug: 'rochioli-estate-pinot',
    region: 'Russian River Valley',
    grapes: ['Pinot Noir'],
    vintages: [
      { year: 2020, criticAvg: 94, vivinoScore: 4.4, priceUsd: 75 },
      { year: 2019, criticAvg: 95, vivinoScore: 4.5, priceUsd: 72 },
      { year: 2018, criticAvg: 94, vivinoScore: 4.4, priceUsd: 70 },
      { year: 2017, criticAvg: 93, vivinoScore: 4.3, priceUsd: 68 },
      { year: 2016, criticAvg: 94, vivinoScore: 4.4, priceUsd: 65 },
      { year: 2015, criticAvg: 95, vivinoScore: 4.5, priceUsd: 62 },
      { year: 2014, criticAvg: 93, vivinoScore: 4.3, priceUsd: 60 },
      { year: 2013, criticAvg: 94, vivinoScore: 4.4, priceUsd: 58 },
      { year: 2012, criticAvg: 95, vivinoScore: 4.5, priceUsd: 55 },
      { year: 2011, criticAvg: 92, vivinoScore: 4.2, priceUsd: 52 },
      { year: 2010, criticAvg: 94, vivinoScore: 4.4, priceUsd: 50 },
    ],
    flavorMentions: ['Raspberry', 'Rose Petal', 'Cedar', 'White Pepper', 'Minerality'],
  },
  {
    producer: 'Gary Farrell',
    producerSlug: 'gary-farrell',
    producerDesc: 'Russian River benchmark since 1982. Single-vineyard focus. Elegant, balanced style.',
    wine: 'Gary Farrell Russian River Selection Pinot Noir',
    wineSlug: 'gary-farrell-rrv-pinot',
    region: 'Russian River Valley',
    grapes: ['Pinot Noir'],
    vintages: [
      { year: 2020, criticAvg: 93, vivinoScore: 4.3, priceUsd: 45 },
      { year: 2019, criticAvg: 94, vivinoScore: 4.4, priceUsd: 42 },
      { year: 2018, criticAvg: 93, vivinoScore: 4.3, priceUsd: 40 },
      { year: 2017, criticAvg: 92, vivinoScore: 4.2, priceUsd: 38 },
      { year: 2016, criticAvg: 93, vivinoScore: 4.3, priceUsd: 36 },
      { year: 2015, criticAvg: 94, vivinoScore: 4.4, priceUsd: 34 },
      { year: 2014, criticAvg: 92, vivinoScore: 4.2, priceUsd: 32 },
      { year: 2013, criticAvg: 93, vivinoScore: 4.3, priceUsd: 30 },
      { year: 2012, criticAvg: 94, vivinoScore: 4.4, priceUsd: 28 },
      { year: 2011, criticAvg: 91, vivinoScore: 4.1, priceUsd: 26 },
      { year: 2010, criticAvg: 93, vivinoScore: 4.3, priceUsd: 24 },
    ],
    flavorMentions: ['Cherry Cola', 'Rose', 'Pine', 'Tamarind', 'Fennel'],
  },
  {
    producer: 'Merry Edwards',
    producerSlug: 'merry-edwards',
    producerDesc: 'Russian River trailblazer. Pioneer of California Pinot Noir. Rich, complex style since 1997.',
    wine: 'Merry Edwards Russian River Valley Pinot Noir',
    wineSlug: 'merry-edwards-rrv-pinot',
    region: 'Russian River Valley',
    grapes: ['Pinot Noir'],
    vintages: [
      { year: 2020, criticAvg: 93, vivinoScore: 4.3, priceUsd: 60 },
      { year: 2019, criticAvg: 94, vivinoScore: 4.4, priceUsd: 58 },
      { year: 2018, criticAvg: 93, vivinoScore: 4.3, priceUsd: 55 },
      { year: 2017, criticAvg: 92, vivinoScore: 4.2, priceUsd: 52 },
      { year: 2016, criticAvg: 93, vivinoScore: 4.3, priceUsd: 50 },
      { year: 2015, criticAvg: 94, vivinoScore: 4.4, priceUsd: 48 },
      { year: 2014, criticAvg: 92, vivinoScore: 4.2, priceUsd: 45 },
      { year: 2013, criticAvg: 93, vivinoScore: 4.3, priceUsd: 42 },
      { year: 2012, criticAvg: 94, vivinoScore: 4.4, priceUsd: 40 },
      { year: 2011, criticAvg: 91, vivinoScore: 4.1, priceUsd: 38 },
      { year: 2010, criticAvg: 93, vivinoScore: 4.3, priceUsd: 35 },
    ],
    flavorMentions: ['Pomegranate', 'Plum', 'Anise', 'Cola', 'Menthol'],
  },
  {
    producer: 'Failla',
    producerSlug: 'failla',
    producerDesc: 'Ehren Jordan\'s project. Cool-climate specialist. Sonoma Coast and Willamette Valley focus.',
    wine: 'Failla Sonoma Coast Pinot Noir',
    wineSlug: 'failla-sonoma-coast-pinot',
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
    flavorMentions: ['Wild Berry', 'Pine', 'Cinnamon', 'Earth', 'Floral'],
  },
  {
    producer: 'Peay Vineyards',
    producerSlug: 'peay-vineyards',
    producerDesc: 'Far west Sonoma Coast. Family estate since 1996. Wild, remote terroir near the Pacific.',
    wine: 'Peay Sonoma Coast Pinot Noir',
    wineSlug: 'peay-sonoma-coast-pinot',
    region: 'Sonoma Coast',
    grapes: ['Pinot Noir'],
    vintages: [
      { year: 2020, criticAvg: 94, vivinoScore: 4.4, priceUsd: 55 },
      { year: 2019, criticAvg: 95, vivinoScore: 4.5, priceUsd: 52 },
      { year: 2018, criticAvg: 94, vivinoScore: 4.4, priceUsd: 50 },
      { year: 2017, criticAvg: 93, vivinoScore: 4.3, priceUsd: 48 },
      { year: 2016, criticAvg: 94, vivinoScore: 4.4, priceUsd: 45 },
      { year: 2015, criticAvg: 95, vivinoScore: 4.5, priceUsd: 42 },
      { year: 2014, criticAvg: 93, vivinoScore: 4.3, priceUsd: 40 },
      { year: 2013, criticAvg: 94, vivinoScore: 4.4, priceUsd: 38 },
      { year: 2012, criticAvg: 95, vivinoScore: 4.5, priceUsd: 35 },
      { year: 2011, criticAvg: 92, vivinoScore: 4.2, priceUsd: 32 },
      { year: 2010, criticAvg: 94, vivinoScore: 4.4, priceUsd: 30 },
    ],
    flavorMentions: ['Wild Strawberry', 'Rose', 'Herbs', 'Truffle', 'Chalk'],
  },
  {
    producer: 'Cobb Wines',
    producerSlug: 'cobb-wines',
    producerDesc: 'Ross Cobb\'s family project. Coastlands Vineyard pioneers. True Sonoma Coast terroir.',
    wine: 'Cobb Sonoma Coast Pinot Noir',
    wineSlug: 'cobb-sonoma-coast-pinot',
    region: 'Sonoma Coast',
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
    flavorMentions: ['Red Cherry', 'Wild Strawberry', 'Lilac', 'Garrigue', 'Salt'],
  },
  {
    producer: 'DuMOL',
    producerSlug: 'dumol',
    producerDesc: 'Andy Smith\'s Russian River project since 1996. Burgundian-styled wines. Cool-climate focus.',
    wine: 'DuMOL Russian River Valley Pinot Noir',
    wineSlug: 'dumol-rrv-pinot',
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
    flavorMentions: ['Rose Petal', 'Violet', 'Blueberry', 'Cedar', 'Wintergreen'],
  },
];

async function getOrCreateRegion(name: string): Promise<string> {
  let region = await client.fetch(
    `*[_type == "region" && name == $name][0]{ _id }`,
    { name }
  );
  if (!region) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const newRegion = await client.create({
      _type: 'region',
      _id: `region-${slug}`,
      name,
      country: 'USA',
    });
    return newRegion._id;
  }
  return region._id;
}

async function getOrCreateProducer(entry: WineEntry): Promise<string> {
  let producer = await client.fetch(
    `*[_type == "producer" && name == $name][0]{ _id }`,
    { name: entry.producer }
  );
  if (!producer) {
    const newProducer = await client.create({
      _type: 'producer',
      _id: `producer-${entry.producerSlug}`,
      name: entry.producer,
      description: entry.producerDesc,
    });
    return newProducer._id;
  }
  return producer._id;
}

async function main() {
  console.log('Seeding Sonoma Pinot Noir & Chardonnay producers (2010-2020)');
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
