import RegionLayout from '@/components/RegionLayout';

const LOIRE_VALLEY_SUB_REGIONS = [
  { name: 'Pays Nantais', slug: 'pays-nantais' },
  { name: 'Anjou-Saumur', slug: 'anjou-saumur' },
  { name: 'Touraine', slug: 'touraine' },
  { name: 'Centre-Loire', slug: 'centre-loire' },
];

export default function LoireValleyPage() {
  return (
    <RegionLayout
      title="Loire Valley"
      level="region"
      parentRegion="france"
      sidebarLinks={LOIRE_VALLEY_SUB_REGIONS}
      sidebarTitle="Sub-Regions"
      contentFile="loire-valley-guide.md"
    />
  );
}
