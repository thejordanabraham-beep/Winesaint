import RegionLayout from '@/components/RegionLayout';

export default function VignesDessousPage() {
  return (
    <RegionLayout
      title="Vignes Dessous"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="vignes-dessous-guide.md"
    />
  );
}
