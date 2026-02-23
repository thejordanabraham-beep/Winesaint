import RegionLayout from '@/components/RegionLayout';

const PELOPONNESE_REGIONS = [
  { name: 'Nemea', slug: 'nemea' },
  { name: 'Mantinia', slug: 'mantinia' },
  { name: 'Patras', slug: 'patras' },
];

export default function PeloponnesePage() {
  return (
    <RegionLayout
      title="Peloponnese"
      level="region"
      parentRegion="greece"
      sidebarLinks={PELOPONNESE_REGIONS}
      contentFile="peloponnese-guide.md"
    />
  );
}
