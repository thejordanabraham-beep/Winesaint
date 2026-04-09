import RegionLayout from '@/components/RegionLayout';

export default function OsterbergPage() {
  return (
    <RegionLayout
      title="Osterberg"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="osterberg-guide.md"
    />
  );
}
