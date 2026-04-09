import RegionLayout from '@/components/RegionLayout';

export default function BadenPage() {
  return (
    <RegionLayout
      title="Baden"
      level="region"
      parentRegion="germany"
      contentFile="baden-guide.md"
    />
  );
}
