import RegionLayout from '@/components/RegionLayout';

export default function MarckrainPage() {
  return (
    <RegionLayout
      title="Marckrain"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="marckrain-guide.md"
    />
  );
}
