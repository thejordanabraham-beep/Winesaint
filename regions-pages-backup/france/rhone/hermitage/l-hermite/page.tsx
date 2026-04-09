import RegionLayout from '@/components/RegionLayout';

export default function LHermitePage() {
  return (
    <RegionLayout
      title="L'Hermite"
      level="vineyard"
      parentRegion="france/rhone/hermitage"
      classification="climat"
      contentFile="l-hermite-guide.md"
    />
  );
}
