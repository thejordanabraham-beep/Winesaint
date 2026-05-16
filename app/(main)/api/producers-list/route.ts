import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function GET() {
  try {
    const payload = await getPayload({ config });

    // Fetch all producers
    const producerResult = await payload.find({
      collection: 'producers',
      depth: 1,
      limit: 1000,
      sort: 'name',
    });

    const producers = producerResult.docs;

    // Count wines per producer
    const wineResult = await payload.find({
      collection: 'wines',
      depth: 0,
      pagination: false,
    });

    const wineCountByProducer = new Map<string | number, number>();
    for (const wine of wineResult.docs) {
      const producerId = typeof wine.producer === 'number' ? wine.producer : (wine.producer as { id: number })?.id;
      if (producerId) {
        wineCountByProducer.set(producerId, (wineCountByProducer.get(producerId) || 0) + 1);
      }
    }

    // Transform for frontend
    const transformedProducers = producers.map(producer => {
      const region = typeof producer.region === 'object' ? producer.region : null;

      return {
        id: producer.id,
        name: producer.name,
        slug: producer.slug,
        summary: producer.summary,
        region: region ? {
          id: region.id,
          name: region.name,
          slug: region.slug,
          country: region.country,
        } : null,
        country: producer.country,
        wineCount: wineCountByProducer.get(producer.id) || 0,
      };
    });

    return NextResponse.json(transformedProducers);
  } catch (error) {
    console.error('Error fetching producers:', error);
    return NextResponse.json([], { status: 200 });
  }
}
