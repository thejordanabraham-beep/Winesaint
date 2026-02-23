import RegionLayout from '@/components/RegionLayout';

const GREECE_REGIONS = [
  { name: 'Santorini', slug: 'santorini' },
  { name: 'Crete', slug: 'crete' },
  { name: 'Cephalonia', slug: 'cephalonia' },
  { name: 'Samos', slug: 'samos' },
  { name: 'Northern Greece', slug: 'northern-greece' },
  { name: 'Peloponnese', slug: 'peloponnese' },
  { name: 'Rapsani', slug: 'rapsani' },
  { name: 'Attica', slug: 'attica' },
];

export default function GreecePage() {
  return (
    <RegionLayout
      title="Greece"
      level="country"
      sidebarLinks={GREECE_REGIONS}
      contentFile="greece-guide.md"
    />
  );
}
