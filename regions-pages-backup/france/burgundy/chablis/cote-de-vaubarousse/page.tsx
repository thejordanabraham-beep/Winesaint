import RegionLayout from '@/components/RegionLayout';

export default function CtedeVaubaroussePage() {
  return (
    <RegionLayout
      title="Côte de Vaubarousse"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="premier-cru"
      contentFile="cote-de-vaubarousse-guide.md"
    />
  );
}
