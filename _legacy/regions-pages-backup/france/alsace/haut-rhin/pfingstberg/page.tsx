import RegionLayout from '@/components/RegionLayout';

export default function PfingstbergPage() {
  return (
    <RegionLayout
      title="Pfingstberg"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="pfingstberg-guide.md"
    />
  );
}
