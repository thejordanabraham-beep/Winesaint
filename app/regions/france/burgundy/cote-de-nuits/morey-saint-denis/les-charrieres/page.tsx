import RegionLayout from '@/components/RegionLayout';

export default function LesCharriresPage() {
  return (
    <RegionLayout
      title="Les Charrières"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/morey-saint-denis"
      classification="premier-cru"
      contentFile="les-charrieres-guide.md"
    />
  );
}
