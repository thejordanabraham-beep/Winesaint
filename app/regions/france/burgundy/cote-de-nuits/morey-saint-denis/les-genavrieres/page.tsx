import RegionLayout from '@/components/RegionLayout';

export default function LesGenavriresPage() {
  return (
    <RegionLayout
      title="Les Genavrières"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/morey-saint-denis"
      classification="premier-cru"
      contentFile="les-genavrieres-guide.md"
    />
  );
}
