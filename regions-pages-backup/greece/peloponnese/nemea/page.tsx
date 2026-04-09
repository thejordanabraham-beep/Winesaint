import RegionLayout from '@/components/RegionLayout';

const PELOPONNESE_REGIONS = [
  { name: 'Nemea', slug: 'nemea' },
  { name: 'Mantinia', slug: 'mantinia' },
  { name: 'Patras', slug: 'patras' },
];

export default function NemeaPage() {
  return (
    <RegionLayout
      title="Nemea"
      level="sub-region"
      parentRegion="greece/peloponnese"
      sidebarLinks={PELOPONNESE_REGIONS}
      contentFile="nemea-guide.md"
    />
  );
}
