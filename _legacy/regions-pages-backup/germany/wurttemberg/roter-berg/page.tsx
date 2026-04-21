import RegionLayout from '@/components/RegionLayout';

export default function RoterBergPage() {
  return (
    <RegionLayout
      title="Roter Berg"
      level="vineyard"
      parentRegion="germany/wurttemberg"
      classification="grosses-gewachs"
      contentFile="roter-berg-guide.md"
    />
  );
}
