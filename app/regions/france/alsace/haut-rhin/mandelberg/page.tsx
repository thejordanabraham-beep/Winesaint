import RegionLayout from '@/components/RegionLayout';

export default function MandelbergPage() {
  return (
    <RegionLayout
      title="Mandelberg"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="mandelberg-guide.md"
    />
  );
}
