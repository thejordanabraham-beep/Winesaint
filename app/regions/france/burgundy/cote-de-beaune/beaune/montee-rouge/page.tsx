import RegionLayout from '@/components/RegionLayout';

export default function MonteRougePage() {
  return (
    <RegionLayout
      title="Montée Rouge"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="montee-rouge-guide.md"
    />
  );
}
