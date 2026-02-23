import RegionLayout from '@/components/RegionLayout';

export default function AVigneRougePage() {
  return (
    <RegionLayout
      title="A Vigne Rouge"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="a-vigne-rouge-guide.md"
    />
  );
}
