import RegionLayout from '@/components/RegionLayout';

export default async function FleuriePage() {
  return (
    <RegionLayout
      title="Fleurie"
      level="sub-region"
      parentRegion="france/beaujolais"
      contentFile="fleurie-guide.md"
    />
  );
}
