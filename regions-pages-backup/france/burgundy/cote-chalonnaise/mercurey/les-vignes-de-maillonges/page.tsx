import RegionLayout from '@/components/RegionLayout';

export default function LesvignesdeMaillongesPage() {
  return (
    <RegionLayout
      title="Les vignes de Maillonges"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/mercurey"
      classification="premier-cru"
      contentFile="les-vignes-de-maillonges-guide.md"
    />
  );
}
