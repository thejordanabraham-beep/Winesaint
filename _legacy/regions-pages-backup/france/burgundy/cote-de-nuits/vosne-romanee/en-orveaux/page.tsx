import RegionLayout from '@/components/RegionLayout';

export default function EnOrveauxPage() {
  return (
    <RegionLayout
      title="En Orveaux"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/vosne-romanee"
      classification="premier-cru"
      contentFile="en-orveaux-guide.md"
    />
  );
}
