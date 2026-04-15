import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client';

export async function GET() {
  try {
    const query = `*[_type == "wine"] | order(vintage desc, name asc) {
      _id,
      name,
      "slug": slug.current,
      vintage,
      priceUsd,
      grapeVarieties,
      producer->{ name },
      region->{ name, country },
      climat->{ name, classification },
      "review": *[_type == "review" && wine._ref == ^._id] | order(reviewDate desc)[0] {
        score,
        tastingNotes,
        reviewerName,
        reviewDate,
        flavorProfile,
        foodPairings,
        drinkThisIf,
        drinkingWindowStart,
        drinkingWindowEnd
      }
    }`;

    const wines = await client.fetch(query);
    return NextResponse.json(wines);
  } catch (error) {
    console.error('Error fetching wines:', error);
    return NextResponse.json({ error: 'Failed to fetch wines' }, { status: 500 });
  }
}
