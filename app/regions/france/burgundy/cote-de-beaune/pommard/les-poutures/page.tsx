import RegionLayout from '@/components/RegionLayout';

export default function LesPouturesPage() {
  return (
    <RegionLayout
      title="Les Poutures"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pommard"
      classification="premier-cru"
      contentFile="les-poutures-guide.md"
    />
  );
}
