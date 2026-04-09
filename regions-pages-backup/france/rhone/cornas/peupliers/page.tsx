import RegionLayout from '@/components/RegionLayout';

export default function PeupliersPage() {
  return (
    <RegionLayout
      title="Peupliers"
      level="vineyard"
      parentRegion="france/rhone/cornas"
      classification="climat"
      contentFile="peupliers-guide.md"
    />
  );
}
