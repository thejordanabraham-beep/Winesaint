import RegionLayout from '@/components/RegionLayout';

export default function VigneBlanchePage() {
  return (
    <RegionLayout
      title="Vigne Blanche"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="vigne-blanche-vineyard-guide.md"
    />
  );
}
