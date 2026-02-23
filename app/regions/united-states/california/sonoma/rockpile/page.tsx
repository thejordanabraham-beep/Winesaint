import RegionLayout from '@/components/RegionLayout';

export default function RockpilePage() {
  return (
    <RegionLayout
      title="Rockpile"
      level="village"
      parentRegion="united-states/california/sonoma"
      contentFile="rockpile-guide.md"
    />
  );
}
