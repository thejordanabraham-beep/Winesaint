import RegionLayout from '@/components/RegionLayout';

export default function EngelbergPage() {
  return (
    <RegionLayout
      title="Engelberg"
      level="vineyard"
      parentRegion="france/alsace/bas-rhin"
      classification="grand-cru"
      contentFile="engelberg-guide.md"
    />
  );
}
