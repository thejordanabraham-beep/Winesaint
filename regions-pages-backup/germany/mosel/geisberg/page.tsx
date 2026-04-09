import RegionLayout from '@/components/RegionLayout';

export default function GeisbergPage() {
  return (
    <RegionLayout
      title="Geisberg"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="geisberg-guide.md"
    />
  );
}
