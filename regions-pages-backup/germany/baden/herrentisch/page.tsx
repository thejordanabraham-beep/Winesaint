import RegionLayout from '@/components/RegionLayout';

export default function HerrentischPage() {
  return (
    <RegionLayout
      title="Herrentisch"
      level="vineyard"
      parentRegion="germany/baden"
      classification="grosses-gewachs"
      contentFile="herrentisch-guide.md"
    />
  );
}
