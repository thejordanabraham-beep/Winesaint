import RegionLayout from '@/components/RegionLayout';

export default function BeauroyPage() {
  return (
    <RegionLayout
      title="Beauroy"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="premier-cru"
      contentFile="beauroy-guide.md"
    />
  );
}
