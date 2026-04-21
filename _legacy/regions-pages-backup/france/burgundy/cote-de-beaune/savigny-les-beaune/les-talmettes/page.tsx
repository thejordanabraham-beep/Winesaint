import RegionLayout from '@/components/RegionLayout';

export default function LesTalmettesPage() {
  return (
    <RegionLayout
      title="Les Talmettes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/savigny-les-beaune"
      classification="premier-cru"
      contentFile="les-talmettes-guide.md"
    />
  );
}
