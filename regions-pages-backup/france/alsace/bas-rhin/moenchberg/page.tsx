import RegionLayout from '@/components/RegionLayout';

export default function MoenchbergPage() {
  return (
    <RegionLayout
      title="Moenchberg"
      level="vineyard"
      parentRegion="france/alsace/bas-rhin"
      classification="grand-cru"
      contentFile="moenchberg-guide.md"
    />
  );
}
