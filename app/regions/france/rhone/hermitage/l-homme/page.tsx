import RegionLayout from '@/components/RegionLayout';

export default function LHommePage() {
  return (
    <RegionLayout
      title="L'Homme"
      level="vineyard"
      parentRegion="france/rhone/hermitage"
      classification="climat"
      contentFile="l-homme-guide.md"
    />
  );
}
