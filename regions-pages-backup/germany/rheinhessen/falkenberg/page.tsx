import RegionLayout from '@/components/RegionLayout';

export default function FalkenbergPage() {
  return (
    <RegionLayout
      title="Falkenberg"
      level="vineyard"
      parentRegion="germany/rheinhessen"
      classification="grosses-gewachs"
      contentFile="falkenberg-guide.md"
    />
  );
}
