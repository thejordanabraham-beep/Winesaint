import RegionLayout from '@/components/RegionLayout';

export default function LesLuretsPage() {
  return (
    <RegionLayout
      title="Les Lurets"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/volnay"
      classification="premier-cru"
      contentFile="les-lurets-guide.md"
    />
  );
}
