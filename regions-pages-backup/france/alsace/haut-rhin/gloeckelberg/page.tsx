import RegionLayout from '@/components/RegionLayout';

export default function GloeckelbergPage() {
  return (
    <RegionLayout
      title="Gloeckelberg"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="gloeckelberg-guide.md"
    />
  );
}
