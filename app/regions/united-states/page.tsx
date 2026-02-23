import RegionLayout from '@/components/RegionLayout';

const UNITED_STATES_SUB_REGIONS = [
  { name: 'California', slug: 'california' },
  { name: 'Oregon', slug: 'oregon' },
  { name: 'Washington', slug: 'washington' },
];

export default function UnitedStatesPage() {
  return (
    <RegionLayout
      title="United States"
      level="country"
      sidebarLinks={UNITED_STATES_SUB_REGIONS}
      contentFile="united-states-guide.md"
    />
  );
}
