import RegionLayout from '@/components/RegionLayout';

export default function MambourgPage() {
  return (
    <RegionLayout
      title="Mambourg"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="mambourg-guide.md"
    />
  );
}
