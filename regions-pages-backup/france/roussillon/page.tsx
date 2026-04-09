import RegionLayout from '@/components/RegionLayout';

const ROUSSILLON_APPELLATIONS = [
  { name: 'Côtes du Roussillon', slug: 'cotes-du-roussillon' },
  { name: 'Collioure', slug: 'collioure' },
  { name: 'Banyuls', slug: 'banyuls' },
  { name: 'Maury', slug: 'maury' },
  { name: 'Rivesaltes', slug: 'rivesaltes' },
];

export default function RoussillonPage() {
  return (
    <RegionLayout
      title="Roussillon"
      level="region"
      parentRegion="france"
      sidebarLinks={ROUSSILLON_APPELLATIONS}
      contentFile="roussillon-guide.md"
    />
  );
}
