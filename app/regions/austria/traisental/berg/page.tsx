import RegionLayout from '@/components/RegionLayout';

export default function BergPage() {
  return (
    <RegionLayout
      title="Berg"
      level="vineyard"
      parentRegion="austria/traisental"
      contentFile="berg-guide.md"
    />
  );
}
