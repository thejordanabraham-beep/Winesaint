import RegionLayout from '@/components/RegionLayout';

export default function EmiliaRomagnaPage() {
  return (
    <RegionLayout
      title="Emilia-Romagna"
      level="region"
      parentRegion="italy"
      contentFile="emilia-romagna-guide.md"
    />
  );
}
