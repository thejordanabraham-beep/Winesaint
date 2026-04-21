import RegionLayout from '@/components/RegionLayout';

export default function EsChampsPage() {
  return (
    <RegionLayout
      title="Es Champs"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/saint-aubin"
      classification="premier-cru"
      contentFile="es-champs-guide.md"
    />
  );
}
