import RegionLayout from '@/components/RegionLayout';

export default function GuercherePage() {
  return (
    <RegionLayout
      title="Guerchere"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="guerchere-vineyard-guide.md"
    />
  );
}
