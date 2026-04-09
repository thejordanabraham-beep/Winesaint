import RegionLayout from '@/components/RegionLayout';

export default function JohannisbergPage() {
  return (
    <RegionLayout
      title="Johannisberg"
      level="vineyard"
      parentRegion="germany/nahe"
      classification="grosses-gewachs"
      contentFile="johannisberg-guide.md"
    />
  );
}
