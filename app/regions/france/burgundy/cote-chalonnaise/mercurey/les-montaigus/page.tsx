import RegionLayout from '@/components/RegionLayout';

export default function LesMontaigusPage() {
  return (
    <RegionLayout
      title="Les Montaigus"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/mercurey"
      classification="premier-cru"
      contentFile="les-montaigus-guide.md"
    />
  );
}
