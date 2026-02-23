import RegionLayout from '@/components/RegionLayout';

export default function LesCrasPage() {
  return (
    <RegionLayout
      title="Les Cras"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/vougeot"
      classification="premier-cru"
      contentFile="les-cras-guide.md"
    />
  );
}
