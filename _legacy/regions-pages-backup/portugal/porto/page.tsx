import RegionLayout from '@/components/RegionLayout';

export default function PortoPage() {
  return (
    <RegionLayout
      title="Porto"
      level="region"
      parentRegion="portugal"
      contentFile="porto-guide.md"
    />
  );
}
