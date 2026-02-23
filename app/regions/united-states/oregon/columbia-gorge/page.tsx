import RegionLayout from '@/components/RegionLayout';

export default function ColumbiaGorgePage() {
  return (
    <RegionLayout
      title="Columbia Gorge"
      level="sub-region"
      parentRegion="united-states/oregon"
      contentFile="columbia-gorge-guide.md"
    />
  );
}
