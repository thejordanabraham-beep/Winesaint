import RegionLayout from '@/components/RegionLayout';

export default function ObererBergPage() {
  return (
    <RegionLayout
      title="Oberer Berg"
      level="vineyard"
      parentRegion="germany/wurttemberg"
      classification="grosses-gewachs"
      contentFile="oberer-berg-guide.md"
    />
  );
}
