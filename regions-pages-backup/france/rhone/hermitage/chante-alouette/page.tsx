import RegionLayout from '@/components/RegionLayout';

export default function ChanteAlouettePage() {
  return (
    <RegionLayout
      title="Chante Alouette"
      level="vineyard"
      parentRegion="france/rhone/hermitage"
      classification="climat"
      contentFile="chante-alouette-guide.md"
    />
  );
}
