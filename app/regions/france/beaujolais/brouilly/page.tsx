import RegionLayout from '@/components/RegionLayout';

export default async function BrouillyPage() {
  return (
    <RegionLayout
      title="Brouilly"
      level="sub-region"
      parentRegion="france/beaujolais"
      contentFile="brouilly-guide.md"
    />
  );
}
