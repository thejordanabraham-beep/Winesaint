import RegionLayout from '@/components/RegionLayout';

export default function HilltopsPage() {
  return (
    <RegionLayout
      title="Hilltops"
      level="region"
      parentRegion="australia"
      contentFile="hilltops-guide.md"
    />
  );
}
