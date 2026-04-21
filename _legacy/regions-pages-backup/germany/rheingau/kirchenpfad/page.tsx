import RegionLayout from '@/components/RegionLayout';

export default function KirchenpfadPage() {
  return (
    <RegionLayout
      title="Kirchenpfad"
      level="vineyard"
      parentRegion="germany/rheingau"
      classification="grosses-gewachs"
      contentFile="kirchenpfad-guide.md"
    />
  );
}
