import RegionLayout from '@/components/RegionLayout';

export default async function CoteRotiePage() {
  return (
    <RegionLayout
      title="Côte-Rôtie"
      level="sub-region"
      parentRegion="france/northern-rhone"
      contentFile="côte-rôtie-guide.md"
    />
  );
}
