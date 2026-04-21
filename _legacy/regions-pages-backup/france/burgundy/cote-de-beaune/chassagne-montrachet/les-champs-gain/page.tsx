import RegionLayout from '@/components/RegionLayout';

export default function LesChampsGainPage() {
  return (
    <RegionLayout
      title="Les Champs Gain"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="les-champs-gain-vineyard-guide.md"
    />
  );
}
