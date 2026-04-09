import RegionLayout from '@/components/RegionLayout';

export default function MaisonBlanchePage() {
  return (
    <RegionLayout
      title="Maison Blanche"
      level="vineyard"
      parentRegion="france/rhone/hermitage"
      classification="climat"
      contentFile="maison-blanche-guide.md"
    />
  );
}
