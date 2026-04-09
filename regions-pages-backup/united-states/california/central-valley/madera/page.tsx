import RegionLayout from '@/components/RegionLayout';

export default function MaderaPage() {
  return (
    <RegionLayout
      title="Madera"
      level="sub-region"
      parentRegion="united-states/california/central-valley"
      contentFile="madera-guide.md"
    />
  );
}
