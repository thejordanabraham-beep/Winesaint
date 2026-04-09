import RegionLayout from '@/components/RegionLayout';

export default function EnChouPage() {
  return (
    <RegionLayout
      title="En Choué"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="en-choue-guide.md"
    />
  );
}
