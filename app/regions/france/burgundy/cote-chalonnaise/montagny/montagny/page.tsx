import RegionLayout from '@/components/RegionLayout';

export default function MontagnyPage() {
  return (
    <RegionLayout
      title="Montagny"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="montagny-guide.md"
    />
  );
}
