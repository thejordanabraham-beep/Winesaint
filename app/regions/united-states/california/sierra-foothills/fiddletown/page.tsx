import RegionLayout from '@/components/RegionLayout';

export default function FiddletownPage() {
  return (
    <RegionLayout
      title="Fiddletown"
      level="village"
      parentRegion="united-states/california/sierra-foothills"
      contentFile="fiddletown-guide.md"
    />
  );
}
