import RegionLayout from '@/components/RegionLayout';

export default function LosCarnerosPage() {
  return (
    <RegionLayout
      title="Los Carneros"
      level="village"
      parentRegion="united-states/california/sonoma"
      contentFile="los-carneros-guide.md"
    />
  );
}
