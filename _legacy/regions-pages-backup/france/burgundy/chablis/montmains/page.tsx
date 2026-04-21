import RegionLayout from '@/components/RegionLayout';

export default function MontmainsPage() {
  return (
    <RegionLayout
      title="Montmains"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="premier-cru"
      contentFile="montmains-guide.md"
    />
  );
}
