import RegionLayout from '@/components/RegionLayout';

export default function BarberaAlbaPage() {
  return (
    <RegionLayout
      title="Barbera d'Alba"
      level="sub-region"
      parentRegion="italy/piedmont"
      contentFile="barbera-dalba-guide.md"
    />
  );
}
