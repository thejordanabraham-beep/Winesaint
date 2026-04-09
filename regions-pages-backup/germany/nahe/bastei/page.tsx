import RegionLayout from '@/components/RegionLayout';

export default function BasteiPage() {
  return (
    <RegionLayout
      title="Bastei"
      level="vineyard"
      parentRegion="germany/nahe"
      classification="grosses-gewachs"
      contentFile="bastei-guide.md"
    />
  );
}
