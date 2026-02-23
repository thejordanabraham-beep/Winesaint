import RegionLayout from '@/components/RegionLayout';

export default function ColumbiaGorgePage() {
  return (
    <RegionLayout
      title="Columbia Gorge"
      level="sub-region"
      parentRegion="united-states/washington"
      contentFile="columbia-gorge-washington-guide.md"
    />
  );
}
