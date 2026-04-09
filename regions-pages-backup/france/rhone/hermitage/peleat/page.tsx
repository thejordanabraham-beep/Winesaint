import RegionLayout from '@/components/RegionLayout';

export default function PlatPage() {
  return (
    <RegionLayout
      title="Péléat"
      level="vineyard"
      parentRegion="france/rhone/hermitage"
      classification="climat"
      contentFile="peleat-guide.md"
    />
  );
}
