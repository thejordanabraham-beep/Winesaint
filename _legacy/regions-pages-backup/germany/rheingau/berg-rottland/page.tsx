import RegionLayout from '@/components/RegionLayout';

export default function BergRottlandPage() {
  return (
    <RegionLayout
      title="Berg Rottland"
      level="vineyard"
      parentRegion="germany/rheingau"
      classification="grosses-gewachs"
      contentFile="berg-rottland-guide.md"
    />
  );
}
