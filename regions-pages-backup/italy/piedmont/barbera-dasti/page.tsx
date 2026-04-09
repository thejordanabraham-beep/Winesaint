import RegionLayout from '@/components/RegionLayout';

export default function BarberaAstiPage() {
  return (
    <RegionLayout
      title="Barbera d'Asti"
      level="sub-region"
      parentRegion="italy/piedmont"
      contentFile="barbera-dasti-guide.md"
    />
  );
}
