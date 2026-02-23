import RegionLayout from '@/components/RegionLayout';

export default async function RasteauPage() {
  return (
    <RegionLayout
      title="Rasteau"
      level="sub-region"
      parentRegion="france/southern-rhone"
      contentFile="rasteau-guide.md"
    />
  );
}
