import { getPayload } from 'payload'
import config from '@payload-config'
import GlossaryClient from './GlossaryClient';

async function getGlossaryTerms() {
  try {
    const payload = await getPayload({ config })
    const data = await payload.find({
      collection: 'glossary',
      limit: 1000,
      sort: 'term',
    })
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
