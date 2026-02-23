import RegionLayout from '@/components/RegionLayout';

export default function KieselbergPage() {
  return (
    <RegionLayout
      title="Kieselberg"
      level="vineyard"
      parentRegion="germany/pfalz"
      classification="grosses-gewachs"
      contentFile="kieselberg-guide.md"
    />
  );
}
