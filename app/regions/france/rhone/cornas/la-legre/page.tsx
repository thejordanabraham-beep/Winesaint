import RegionLayout from '@/components/RegionLayout';

export default function LaLgrePage() {
  return (
    <RegionLayout
      title="La Lègre"
      level="vineyard"
      parentRegion="france/rhone/cornas"
      classification="climat"
      contentFile="la-legre-guide.md"
    />
  );
}
