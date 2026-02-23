import RegionLayout from '@/components/RegionLayout';

export default function GenevriresPage() {
  return (
    <RegionLayout
      title="Genevrières"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/meursault"
      classification="premier-cru"
      contentFile="genevrieres-guide.md"
    />
  );
}
