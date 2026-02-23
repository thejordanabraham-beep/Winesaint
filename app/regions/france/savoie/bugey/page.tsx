import RegionLayout from '@/components/RegionLayout';

export default function BugeyPage() {
  return (
    <RegionLayout
      title="Bugey"
      level="sub-region"
      parentRegion="france/savoie"
      contentFile="bugey-guide.md"
    />
  );
}
