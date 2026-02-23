import RegionLayout from '@/components/RegionLayout';

export default function PlantiresPage() {
  return (
    <RegionLayout
      title="Plantières"
      level="vineyard"
      parentRegion="france/rhone/hermitage"
      classification="climat"
      contentFile="plantieres-guide.md"
    />
  );
}
