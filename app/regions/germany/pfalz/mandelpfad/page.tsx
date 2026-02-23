import RegionLayout from '@/components/RegionLayout';

export default function MandelpfadPage() {
  return (
    <RegionLayout
      title="Mandelpfad"
      level="vineyard"
      parentRegion="germany/pfalz"
      classification="grosses-gewachs"
      contentFile="mandelpfad-guide.md"
    />
  );
}
