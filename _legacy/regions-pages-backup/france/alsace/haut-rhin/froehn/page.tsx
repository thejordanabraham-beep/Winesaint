import RegionLayout from '@/components/RegionLayout';

export default function FroehnPage() {
  return (
    <RegionLayout
      title="Froehn"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="froehn-guide.md"
    />
  );
}
