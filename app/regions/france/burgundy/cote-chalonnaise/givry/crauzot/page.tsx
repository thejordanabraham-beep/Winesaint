import RegionLayout from '@/components/RegionLayout';

export default function CrauzotPage() {
  return (
    <RegionLayout
      title="Crauzot"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="crauzot-guide.md"
    />
  );
}
