import RegionLayout from '@/components/RegionLayout';

export default function CotesDeBlayePage() {
  return (
    <RegionLayout
      title="Côtes de Blaye"
      level="sub-region"
      parentRegion="france/bordeaux"
      contentFile="cotes-de-blaye-guide.md"
    />
  );
}
