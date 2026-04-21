import RegionLayout from '@/components/RegionLayout';

export default async function MorgonPage() {
  return (
    <RegionLayout
      title="Morgon"
      level="sub-region"
      parentRegion="france/beaujolais"
      contentFile="morgon-guide.md"
    />
  );
}
