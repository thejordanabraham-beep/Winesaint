import RegionLayout from '@/components/RegionLayout';

export default function RitterpfadPage() {
  return (
    <RegionLayout
      title="Ritterpfad"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="ritterpfad-guide.md"
    />
  );
}
