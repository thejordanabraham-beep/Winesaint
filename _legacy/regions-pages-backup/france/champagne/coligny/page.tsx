import RegionLayout from '@/components/RegionLayout';

export default function ColignyPage() {
  return (
    <RegionLayout
      title="Coligny"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="coligny-guide.md"
    />
  );
}
