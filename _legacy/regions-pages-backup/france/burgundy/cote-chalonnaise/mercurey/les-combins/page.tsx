import RegionLayout from '@/components/RegionLayout';

export default function LesCombinsPage() {
  return (
    <RegionLayout
      title="Les Combins"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/mercurey"
      classification="premier-cru"
      contentFile="les-combins-guide.md"
    />
  );
}
