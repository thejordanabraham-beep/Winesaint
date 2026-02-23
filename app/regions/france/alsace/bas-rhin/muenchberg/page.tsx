import RegionLayout from '@/components/RegionLayout';

export default function MuenchbergPage() {
  return (
    <RegionLayout
      title="Muenchberg"
      level="vineyard"
      parentRegion="france/alsace/bas-rhin"
      classification="grand-cru"
      contentFile="muenchberg-guide.md"
    />
  );
}
