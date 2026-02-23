import RegionLayout from '@/components/RegionLayout';

export default function FenchelbergPage() {
  return (
    <RegionLayout
      title="Fenchelberg"
      level="vineyard"
      parentRegion="germany/rheinhessen"
      classification="grosses-gewachs"
      contentFile="fenchelberg-guide.md"
    />
  );
}
