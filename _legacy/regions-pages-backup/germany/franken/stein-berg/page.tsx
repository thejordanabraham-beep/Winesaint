import RegionLayout from '@/components/RegionLayout';

export default function SteinBergPage() {
  return (
    <RegionLayout
      title="Stein-Berg"
      level="vineyard"
      parentRegion="germany/franken"
      classification="grosses-gewachs"
      contentFile="stein-berg-guide.md"
    />
  );
}
