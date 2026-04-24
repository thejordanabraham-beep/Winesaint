import GrapesClient from './GrapesClient';

const API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000/api';

async function getGrapes() {
  try {
    // Fetch all grapes from Payload
    const response = await fetch(`${API_URL}/grapes?limit=500&sort=name`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('Failed to fetch grapes');
      return { grapes: [], totalGrapes: 0, essentialCount: 0 };
    }

    const data = await response.json();
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
