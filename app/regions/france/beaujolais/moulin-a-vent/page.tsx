import RegionLayout from '@/components/RegionLayout';

export default async function MoulinAVentPage() {
  return (
    <RegionLayout
      title="Moulin-à-Vent"
      level="sub-region"
      parentRegion="france/beaujolais"
      contentFile="moulin-à-vent-guide.md"
    />
  );
}
