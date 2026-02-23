import RegionLayout from '@/components/RegionLayout';

export default function LassollePage() {
  return (
    <RegionLayout
      title="Lassolle"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/volnay"
      classification="premier-cru"
      contentFile="lassolle-guide.md"
    />
  );
}
