import RegionLayout from '@/components/RegionLayout';

const PELOPONNESE_REGIONS = [
  { name: 'Nemea', slug: 'nemea' },
  { name: 'Mantinia', slug: 'mantinia' },
  { name: 'Patras', slug: 'patras' },
];

export default function MantiniaPage() {
  return (
    <RegionLayout
      title="Mantinia"
      level="sub-region"
      parentRegion="greece/peloponnese"
      sidebarLinks={PELOPONNESE_REGIONS}
      contentFile="mantinia-guide.md"
    />
  );
}
