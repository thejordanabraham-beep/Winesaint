import RegionLayout from '@/components/RegionLayout';

export default function SeligmacherPage() {
  return (
    <RegionLayout
      title="Seligmacher"
      level="vineyard"
      parentRegion="germany/rheingau"
      classification="grosses-gewachs"
      contentFile="seligmacher-guide.md"
    />
  );
}
