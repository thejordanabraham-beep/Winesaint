import RegionLayout from '@/components/RegionLayout';

export default async function ChateauGrilletPage() {
  return (
    <RegionLayout
      title="Château-Grillet"
      level="sub-region"
      parentRegion="france/northern-rhone"
      contentFile="château-grillet-guide.md"
    />
  );
}
