import RegionLayout from '@/components/RegionLayout';

export default function FranksteinPage() {
  return (
    <RegionLayout
      title="Frankstein"
      level="vineyard"
      parentRegion="france/alsace/bas-rhin"
      classification="grand-cru"
      contentFile="frankstein-guide.md"
    />
  );
}
