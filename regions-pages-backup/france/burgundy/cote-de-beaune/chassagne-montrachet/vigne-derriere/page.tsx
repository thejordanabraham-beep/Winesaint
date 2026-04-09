import RegionLayout from '@/components/RegionLayout';

export default function VigneDerrierePage() {
  return (
    <RegionLayout
      title="Vigne Derriere"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="vigne-derriere-vineyard-guide.md"
    />
  );
}
