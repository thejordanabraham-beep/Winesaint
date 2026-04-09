import RegionLayout from '@/components/RegionLayout';

export default function PaterbergPage() {
  return (
    <RegionLayout
      title="Paterberg"
      level="vineyard"
      parentRegion="germany/rheinhessen"
      classification="grosses-gewachs"
      contentFile="paterberg-guide.md"
    />
  );
}
