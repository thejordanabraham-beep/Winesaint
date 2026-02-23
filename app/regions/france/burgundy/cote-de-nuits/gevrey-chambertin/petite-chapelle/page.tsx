import RegionLayout from '@/components/RegionLayout';

export default function PetiteChapellePage() {
  return (
    <RegionLayout
      title="Petite Chapelle"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/gevrey-chambertin"
      classification="premier-cru"
      contentFile="petite-chapelle-guide.md"
    />
  );
}
