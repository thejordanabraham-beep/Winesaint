import RegionLayout from '@/components/RegionLayout';

const PELOPONNESE_REGIONS = [
  { name: 'Nemea', slug: 'nemea' },
  { name: 'Mantinia', slug: 'mantinia' },
  { name: 'Patras', slug: 'patras' },
];

export default function PatrasPage() {
  return (
    <RegionLayout
      title="Patras"
      level="sub-region"
      parentRegion="greece/peloponnese"
      sidebarLinks={PELOPONNESE_REGIONS}
      contentFile="patras-guide.md"
    />
  );
}
