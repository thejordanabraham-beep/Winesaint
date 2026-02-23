import RegionLayout from '@/components/RegionLayout';

export default async function MontgenostPage() {
  return (
    <RegionLayout
      title="Montgenost"
      level="village"
      parentRegion="france/champagne/cote-de-sezanne"
      contentFile="montgenost-guide.md"
    />
  );
}
