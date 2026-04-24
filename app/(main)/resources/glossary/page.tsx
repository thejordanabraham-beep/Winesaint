import GlossaryClient from './GlossaryClient';

const API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000/api';

async function getGlossaryTerms() {
  try {
    const response = await fetch(`${API_URL}/glossary?limit=1000&sort=term`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('Failed to fetch glossary terms');
      return [];
    }

    const data = await response.json();
    return data.docs || [];
  } catch (error) {
    console.error('Error fetching glossary:', error);
    return [];
  }
}

export default async function GlossaryPage() {
  const terms = await getGlossaryTerms();

  return <GlossaryClient terms={terms} />;
}
