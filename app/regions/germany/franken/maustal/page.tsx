import RegionLayout from '@/components/RegionLayout';

export default function MaustalPage() {
  return (
    <RegionLayout
      title="Maustal"
      level="vineyard"
      parentRegion="germany/franken"
      classification="grosses-gewachs"
      contentFile="maustal-guide.md"
    />
  );
}
