import RegionLayout from '@/components/RegionLayout';

export default function EichbergPage() {
  return (
    <RegionLayout
      title="Eichberg"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="eichberg-guide.md"
    />
  );
}
