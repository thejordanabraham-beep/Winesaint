import RegionLayout from '@/components/RegionLayout';

export default async function JulienasPage() {
  return (
    <RegionLayout
      title="Juliénas"
      level="sub-region"
      parentRegion="france/beaujolais"
      contentFile="juliénas-guide.md"
    />
  );
}
