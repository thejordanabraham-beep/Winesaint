import RegionLayout from '@/components/RegionLayout';

export default function BeauregardPage() {
  return (
    <RegionLayout
      title="Beauregard"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/santenay"
      classification="premier-cru"
      contentFile="beauregard-guide.md"
    />
  );
}
