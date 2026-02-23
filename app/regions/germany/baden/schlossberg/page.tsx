import RegionLayout from '@/components/RegionLayout';

export default function SchlossbergPage() {
  return (
    <RegionLayout
      title="Schlossberg"
      level="vineyard"
      parentRegion="germany/baden"
      classification="grosses-gewachs"
      contentFile="schlossberg-guide.md"
    />
  );
}
