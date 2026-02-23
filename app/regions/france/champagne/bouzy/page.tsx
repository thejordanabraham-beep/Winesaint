import RegionLayout from '@/components/RegionLayout';

export default function BouzyPage() {
  return (
    <RegionLayout
      title="Bouzy"
      level="vineyard"
      parentRegion="france/champagne"
      classification="grand-cru"
      contentFile="bouzy-guide.md"
    />
  );
}
