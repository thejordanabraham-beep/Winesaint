import RegionLayout from '@/components/RegionLayout';

export default function ChampsPimontPage() {
  return (
    <RegionLayout
      title="Champs Pimont"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="champs-pimont-guide.md"
    />
  );
}
