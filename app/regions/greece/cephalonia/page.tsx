import RegionLayout from '@/components/RegionLayout';

export default function CephaloniaPage() {
  return (
    <RegionLayout
      title="Cephalonia"
      level="region"
      parentRegion="greece"
      contentFile="cephalonia-guide.md"
    />
  );
}
