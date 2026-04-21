import RegionLayout from '@/components/RegionLayout';

export default function EngelsteinPage() {
  return (
    <RegionLayout
      title="Engelstein"
      level="vineyard"
      parentRegion="germany/mittelrhein"
      classification="grosses-gewachs"
      contentFile="engelstein-guide.md"
    />
  );
}
