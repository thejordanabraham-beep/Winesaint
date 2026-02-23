import RegionLayout from '@/components/RegionLayout';

export default function SteingrubenbergPage() {
  return (
    <RegionLayout
      title="Steingrubenberg"
      level="vineyard"
      parentRegion="germany/baden"
      classification="grosses-gewachs"
      contentFile="steingrubenberg-guide.md"
    />
  );
}
