import RegionLayout from '@/components/RegionLayout';

export default function LesCorbeauxPage() {
  return (
    <RegionLayout
      title="Les Corbeaux"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/gevrey-chambertin"
      classification="premier-cru"
      contentFile="les-corbeaux-guide.md"
    />
  );
}
