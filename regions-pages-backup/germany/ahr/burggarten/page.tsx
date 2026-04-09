import RegionLayout from '@/components/RegionLayout';

export default function BurggartenPage() {
  return (
    <RegionLayout
      title="Burggarten"
      level="vineyard"
      parentRegion="germany/ahr"
      classification="grosses-gewachs"
      contentFile="burggarten-guide.md"
    />
  );
}
