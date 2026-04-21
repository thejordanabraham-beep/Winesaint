import RegionLayout from '@/components/RegionLayout';

export default function BergPage() {
  return (
    <RegionLayout
      title="Berg"
      level="vineyard"
      parentRegion="germany/wurttemberg"
      classification="grosses-gewachs"
      contentFile="berg-guide.md"
    />
  );
}
