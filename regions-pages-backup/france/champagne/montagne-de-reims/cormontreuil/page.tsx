import RegionLayout from '@/components/RegionLayout';

export default async function CormontreuilPage() {
  return (
    <RegionLayout
      title="Cormontreuil"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="cormontreuil-guide.md"
    />
  );
}
