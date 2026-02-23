import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function main() {
  // Check how the existing "Wine Saint" reviews got their scores
  const winesWithReviews = await sanityClient.fetch(`
    *[_type == "review" && reviewerName == "Wine Saint"][0...10] {
      _id,
      score,
      wine->{
        _id,
        name,
        vintage,
        criticAvg,
        vivinoScore,
        producer->{name}
      }
    }
  `);

  console.log('='.repeat(70));
  console.log('EXISTING "WINE SAINT" REVIEWS - HOW DO THEY HAVE SCORES?');
  console.log('='.repeat(70));

  winesWithReviews.forEach((review: any, i: number) => {
    console.log(`\n${i + 1}. ${review.wine?.name} ${review.wine?.vintage || 'NV'}`);
    console.log(`   Producer: ${review.wine?.producer?.name}`);
    console.log(`   Review Score: ${review.score}`);
    console.log(`   Wine criticAvg: ${review.wine?.criticAvg || 'NULL'}`);
    console.log(`   Wine vivinoScore: ${review.wine?.vivinoScore || 'NULL'}`);
  });

  // Check stats
  const stats = await sanityClient.fetch(`
    {
      "winesSaintReviews": count(*[_type == "review" && reviewerName == "Wine Saint"]),
      "winesWithCriticAvg": count(*[_type == "wine" && defined(criticAvg)]),
      "winesWithVivino": count(*[_type == "wine" && defined(vivinoScore)])
    }
  `);

  console.log('\n' + '='.repeat(70));
  console.log('STATS:');
  console.log(`  Wine Saint reviews: ${stats.winesSaintReviews}`);
  console.log(`  Wines with criticAvg: ${stats.winesWithCriticAvg}`);
  console.log(`  Wines with vivinoScore: ${stats.winesWithVivino}`);
}

main();
