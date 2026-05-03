import { getPayload } from 'payload'
import config from '@payload-config'
import GrapesClient from './GrapesClient';

async function getGrapes() {
  try {
    const payload = await getPayload({ config })
    const data = await payload.find({
      collection: 'grapes',
      limit: 500,
      sort: 'name',
    })

    const grapes = data.docs || [];
    const essentialCount = grapes.filter((g: any) => g.isEssential).length;

    return {
      grapes,
      totalGrapes: data.totalDocs || grapes.length,
      essentialCount,
    };
  } catch (error) {
    console.error('Error fetching grapes:', error);
    return { grapes: [], totalGrapes: 0, essentialCount: 0 };
  }
}

export default async function GrapesPage() {
  const { grapes, totalGrapes, essentialCount } = await getGrapes();

  return (
    <GrapesClient
      grapes={grapes}
      totalGrapes={totalGrapes}
      essentialCount={essentialCount}
    />
  );
}
