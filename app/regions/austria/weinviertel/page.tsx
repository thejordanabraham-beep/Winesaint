import RegionLayout from '@/components/RegionLayout';

export default function WeinviertelPage() {
  return (
    <RegionLayout
      title="Weinviertel"
      level="region"
      parentRegion="austria"
      contentFile="weinviertel-guide.md"
    />
  );
}
