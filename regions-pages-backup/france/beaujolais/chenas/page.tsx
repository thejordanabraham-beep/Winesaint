import RegionLayout from '@/components/RegionLayout';

export default async function ChenasPage() {
  return (
    <RegionLayout
      title="Chénas"
      level="sub-region"
      parentRegion="france/beaujolais"
      contentFile="chénas-guide.md"
    />
  );
}
