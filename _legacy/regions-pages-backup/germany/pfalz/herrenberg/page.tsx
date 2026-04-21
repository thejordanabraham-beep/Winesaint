import RegionLayout from '@/components/RegionLayout';

export default function HerrenbergPage() {
  return (
    <RegionLayout
      title="Herrenberg"
      level="vineyard"
      parentRegion="germany/pfalz"
      classification="grosses-gewachs"
      contentFile="herrenberg-guide.md"
    />
  );
}
