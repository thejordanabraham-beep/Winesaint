import RegionLayout from '@/components/RegionLayout';

export default async function VinsobresPage() {
  return (
    <RegionLayout
      title="Vinsobres"
      level="sub-region"
      parentRegion="france/southern-rhone"
      contentFile="vinsobres-guide.md"
    />
  );
}
