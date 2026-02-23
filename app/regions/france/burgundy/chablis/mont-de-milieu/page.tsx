import RegionLayout from '@/components/RegionLayout';

export default function MontdeMilieuPage() {
  return (
    <RegionLayout
      title="Mont de Milieu"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="premier-cru"
      contentFile="mont-de-milieu-guide.md"
    />
  );
}
