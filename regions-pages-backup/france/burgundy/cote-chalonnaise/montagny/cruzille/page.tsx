import RegionLayout from '@/components/RegionLayout';

export default function CruzillePage() {
  return (
    <RegionLayout
      title="Cruzille"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="cruzille-guide.md"
    />
  );
}
