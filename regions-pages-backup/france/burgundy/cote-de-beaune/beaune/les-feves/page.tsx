import RegionLayout from '@/components/RegionLayout';

export default function LesFvesPage() {
  return (
    <RegionLayout
      title="Les Fèves"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="les-feves-guide.md"
    />
  );
}
