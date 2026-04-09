import RegionLayout from '@/components/RegionLayout';

export default function KtzchenPage() {
  return (
    <RegionLayout
      title="Kätzchen"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="katzchen-guide.md"
    />
  );
}
