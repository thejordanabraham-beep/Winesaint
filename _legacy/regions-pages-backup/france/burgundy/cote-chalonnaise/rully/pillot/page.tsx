import RegionLayout from '@/components/RegionLayout';

export default function PillotPage() {
  return (
    <RegionLayout
      title="Pillot"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/rully"
      classification="premier-cru"
      contentFile="pillot-guide.md"
    />
  );
}
