import RegionLayout from '@/components/RegionLayout';

export default function LesBetauxPage() {
  return (
    <RegionLayout
      title="Les Betaux"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-betaux-guide.md"
    />
  );
}
