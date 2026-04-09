import RegionLayout from '@/components/RegionLayout';

export default function TasmaniaPage() {
  return (
    <RegionLayout
      title="Tasmania"
      level="region"
      parentRegion="australia"
      contentFile="tasmania-guide.md"
    />
  );
}
