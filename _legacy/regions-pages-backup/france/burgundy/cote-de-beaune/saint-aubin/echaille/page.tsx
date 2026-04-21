import RegionLayout from '@/components/RegionLayout';

export default function EchaillePage() {
  return (
    <RegionLayout
      title="Echaille"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/saint-aubin"
      classification="premier-cru"
      contentFile="echaille-guide.md"
    />
  );
}
