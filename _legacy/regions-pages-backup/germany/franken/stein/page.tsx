import RegionLayout from '@/components/RegionLayout';

export default function SteinPage() {
  return (
    <RegionLayout
      title="Stein"
      level="vineyard"
      parentRegion="germany/franken"
      classification="grosses-gewachs"
      contentFile="stein-guide.md"
    />
  );
}
