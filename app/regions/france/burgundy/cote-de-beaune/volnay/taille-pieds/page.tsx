import RegionLayout from '@/components/RegionLayout';

export default function TaillePiedsPage() {
  return (
    <RegionLayout
      title="Taille Pieds"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/volnay"
      classification="premier-cru"
      contentFile="taille-pieds-guide.md"
    />
  );
}
