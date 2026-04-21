import RegionLayout from '@/components/RegionLayout';

export default function VaucoupinPage() {
  return (
    <RegionLayout
      title="Vaucoupin"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="premier-cru"
      contentFile="vaucoupin-guide.md"
    />
  );
}
