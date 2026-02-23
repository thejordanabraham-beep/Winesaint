import RegionLayout from '@/components/RegionLayout';

export default function LesMitansPage() {
  return (
    <RegionLayout
      title="Les Mitans"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/volnay"
      classification="premier-cru"
      contentFile="les-mitans-guide.md"
    />
  );
}
