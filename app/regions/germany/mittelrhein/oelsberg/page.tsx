import RegionLayout from '@/components/RegionLayout';

export default function OelsbergPage() {
  return (
    <RegionLayout
      title="Oelsberg"
      level="vineyard"
      parentRegion="germany/mittelrhein"
      classification="grosses-gewachs"
      contentFile="oelsberg-guide.md"
    />
  );
}
