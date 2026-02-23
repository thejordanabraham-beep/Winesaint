import RegionLayout from '@/components/RegionLayout';

export default function RabourcPage() {
  return (
    <RegionLayout
      title="Rabourcé"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/rully"
      classification="premier-cru"
      contentFile="rabource-guide.md"
    />
  );
}
