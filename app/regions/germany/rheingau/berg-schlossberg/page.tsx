import RegionLayout from '@/components/RegionLayout';

export default function BergSchlossbergPage() {
  return (
    <RegionLayout
      title="Berg Schlossberg"
      level="vineyard"
      parentRegion="germany/rheingau"
      classification="grosses-gewachs"
      contentFile="berg-schlossberg-guide.md"
    />
  );
}
