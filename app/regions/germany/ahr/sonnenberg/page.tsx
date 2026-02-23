import RegionLayout from '@/components/RegionLayout';

export default function SonnenbergPage() {
  return (
    <RegionLayout
      title="Sonnenberg"
      level="vineyard"
      parentRegion="germany/ahr"
      classification="grosses-gewachs"
      contentFile="sonnenberg-guide.md"
    />
  );
}
