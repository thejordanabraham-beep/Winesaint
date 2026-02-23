import RegionLayout from '@/components/RegionLayout';

export default function ChameryPage() {
  return (
    <RegionLayout
      title="Chamery"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="chamery-guide.md"
    />
  );
}
