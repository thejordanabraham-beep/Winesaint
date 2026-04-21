import RegionLayout from '@/components/RegionLayout';

export default function SiegelsbergPage() {
  return (
    <RegionLayout
      title="Siegelsberg"
      level="vineyard"
      parentRegion="germany/rheingau"
      classification="grosses-gewachs"
      contentFile="siegelsberg-guide.md"
    />
  );
}
