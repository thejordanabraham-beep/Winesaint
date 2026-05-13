import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function GET() {
  try {
    const payload = await getPayload({ config });

    // Fetch all wines with producer/region resolved
    const wineResult = await payload.find({
      collection: 'wines',
      pagination: false,
      depth: 1,
    });

    const wines = wineResult.docs || [];

    // Fetch all reviews
    const reviewResult = await payload.find({
      collection: 'reviews',
      pagination: false,
      depth: 0,
    });

    const reviews = reviewResult.docs || [];

    // Create a map of wine ID to review
    const reviewsByWine = new Map<string | number, typeof reviews[0]>();
    for (const review of reviews) {
      const wineId = typeof review.wine === 'object' ? review.wine?.id : review.wine;
      if (wineId && !reviewsByWine.has(wineId)) {
        reviewsByWine.set(wineId, review);
      }
    }

    // Transform to match expected frontend format
    const transformedWines = wines.map((wine) => {
      const review = reviewsByWine.get(wine.id);
      const producer = typeof wine.producer === 'object' ? wine.producer : null;
      const region = typeof wine.region === 'object' ? wine.region : null;

      return {
        _id: String(wine.id),
        name: wine.name,
        slug: wine.slug,
        vintage: wine.vintage,
        wineType: wine.wineType,
        producer: producer ? {
          name: producer.name,
          slug: producer.slug,
        } : null,
        region: region ? {
          name: region.name,
          slug: region.slug,
          country: region.country,
        } : null,
        review: review ? {
          score: review.score,
          tastingNotes: review.tastingNotes,
          reviewerName: review.reviewer || 'Wine Saint',
          drinkingWindowStart: review.drinkingWindowStart,
          drinkingWindowEnd: review.drinkingWindowEnd,
        } : undefined,
      };
    });

    return NextResponse.json(transformedWines);
  } catch (error) {
    console.error('Error fetching wines:', error);
    return NextResponse.json([], { status: 200 });
  }
}
