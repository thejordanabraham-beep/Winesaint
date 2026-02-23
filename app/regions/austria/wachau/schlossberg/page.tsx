import RegionLayout from '@/components/RegionLayout';

export default function SchlossbergPage() {
  return (
    <RegionLayout
      title="Schlossberg"
      level="vineyard"
      parentRegion="austria/wachau"
      contentFile="schlossberg-guide.md"
    />
  );
}
