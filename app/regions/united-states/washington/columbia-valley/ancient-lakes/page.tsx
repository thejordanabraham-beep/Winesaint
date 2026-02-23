import RegionLayout from '@/components/RegionLayout';

export default function AncientLakesPage() {
  return (
    <RegionLayout
      title="Ancient Lakes"
      level="sub-region"
      parentRegion="united-states/washington/columbia-valley"
      contentFile="ancient-lakes-guide.md"
    />
  );
}
