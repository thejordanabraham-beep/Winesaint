import RegionLayout from '@/components/RegionLayout';

export default function SousFrtillePage() {
  return (
    <RegionLayout
      title="Sous Frétille"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pernand-vergelesses"
      classification="premier-cru"
      contentFile="sous-fretille-guide.md"
    />
  );
}
