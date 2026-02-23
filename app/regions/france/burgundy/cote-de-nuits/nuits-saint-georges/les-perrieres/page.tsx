import RegionLayout from '@/components/RegionLayout';

export default function LesPerriresPage() {
  return (
    <RegionLayout
      title="Les Perrières"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="les-perrieres-guide.md"
    />
  );
}
