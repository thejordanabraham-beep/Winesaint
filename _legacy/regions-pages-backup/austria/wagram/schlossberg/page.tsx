import RegionLayout from '@/components/RegionLayout';

export default function SchlossbergPage() {
  return (
    <RegionLayout
      title="Schlossberg"
      level="vineyard"
      parentRegion="austria/wagram"
      contentFile="schlossberg-guide.md"
    />
  );
}
