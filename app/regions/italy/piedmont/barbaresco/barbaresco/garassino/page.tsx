import RegionLayout from '@/components/RegionLayout';

export default function GarassinoPage() {
  return (
    <RegionLayout
      title="Garassino"
      level="vineyard"
      parentRegion="italy/piedmont/barbaresco/barbaresco"
      classification="mga"
      contentFile="garassino-guide.md"
    />
  );
}
