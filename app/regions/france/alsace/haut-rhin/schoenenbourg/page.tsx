import RegionLayout from '@/components/RegionLayout';

export default function SchoenenbourgPage() {
  return (
    <RegionLayout
      title="Schoenenbourg"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="schoenenbourg-guide.md"
    />
  );
}
