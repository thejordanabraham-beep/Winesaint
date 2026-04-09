import RegionLayout from '@/components/RegionLayout';

export default function BergPage() {
  return (
    <RegionLayout
      title="Berg"
      level="vineyard"
      parentRegion="austria/wagram"
      contentFile="berg-guide.md"
    />
  );
}
