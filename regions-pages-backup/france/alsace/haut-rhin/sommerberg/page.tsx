import RegionLayout from '@/components/RegionLayout';

export default function SommerbergPage() {
  return (
    <RegionLayout
      title="Sommerberg"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="sommerberg-guide.md"
    />
  );
}
