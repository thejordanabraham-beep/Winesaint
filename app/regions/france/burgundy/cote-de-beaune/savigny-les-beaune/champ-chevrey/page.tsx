import RegionLayout from '@/components/RegionLayout';

export default function ChampChevreyPage() {
  return (
    <RegionLayout
      title="Champ Chevrey"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/savigny-les-beaune"
      classification="premier-cru"
      contentFile="champ-chevrey-guide.md"
    />
  );
}
