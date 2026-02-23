import RegionLayout from '@/components/RegionLayout';

export default function GeisbergPage() {
  return (
    <RegionLayout
      title="Geisberg"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="geisberg-guide.md"
    />
  );
}
