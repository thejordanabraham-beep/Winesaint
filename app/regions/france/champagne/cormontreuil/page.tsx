import RegionLayout from '@/components/RegionLayout';

export default function CormontreuilPage() {
  return (
    <RegionLayout
      title="Cormontreuil"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="cormontreuil-guide.md"
    />
  );
}
