import RegionLayout from '@/components/RegionLayout';

// Touraine appellations - consolidated structure
const TOURAINE_APPELLATIONS = [
  { name: 'Vouvray', slug: 'vouvray' },
  { name: 'Montlouis-sur-Loire', slug: 'montlouis-sur-loire' },
  { name: 'Chinon', slug: 'chinon' },
  { name: 'Bourgueil', slug: 'bourgueil' },
  { name: 'Saint-Nicolas-de-Bourgueil', slug: 'saint-nicolas-de-bourgueil' },
  { name: 'Touraine', slug: 'touraine' },
  { name: 'Cheverny', slug: 'cheverny' },
];

export default function TourainePage() {
  return (
    <RegionLayout
      title="Touraine"
      level="sub-region"
      parentRegion="france/loire-valley"
      sidebarLinks={TOURAINE_APPELLATIONS}
      contentFile="touraine-guide.md"
    />
  );
}
