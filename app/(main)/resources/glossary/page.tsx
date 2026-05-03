import glossaryData from '@/app/data/glossary.json';
import GlossaryClient from './GlossaryClient';

export default function GlossaryPage() {
  const terms = (glossaryData as any).terms;
  const categories = (glossaryData as any).categories;

  return <GlossaryClient terms={terms} categories={categories} />;
}
