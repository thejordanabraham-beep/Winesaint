import RegionLayout from '@/components/RegionLayout';

const JURA_APPELLATIONS = [
  { name: 'Arbois', slug: 'arbois' },
  { name: 'Château-Chalon', slug: 'chateau-chalon' },
  { name: 'L\'Étoile', slug: 'l-etoile' },
  { name: 'Côtes du Jura', slug: 'cotes-du-jura' },
];

export default function JuraPage() {
  return (
    <RegionLayout
      title="Jura"
      level="region"
      parentRegion="france"
      sidebarLinks={JURA_APPELLATIONS}
      contentFile="jura-guide.md"
    />
  );
}
