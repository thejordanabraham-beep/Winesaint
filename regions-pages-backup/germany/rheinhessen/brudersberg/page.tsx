import RegionLayout from '@/components/RegionLayout';

export default function BrudersbergPage() {
  return (
    <RegionLayout
      title="Brudersberg"
      level="vineyard"
      parentRegion="germany/rheinhessen"
      classification="grosses-gewachs"
      contentFile="brudersberg-guide.md"
    />
  );
}
