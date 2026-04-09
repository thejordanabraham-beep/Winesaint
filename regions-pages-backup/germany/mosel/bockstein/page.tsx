import RegionLayout from '@/components/RegionLayout';

export default function BocksteinPage() {
  return (
    <RegionLayout
      title="Bockstein"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="bockstein-guide.md"
    />
  );
}
