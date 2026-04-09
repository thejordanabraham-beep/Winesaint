import RegionLayout from '@/components/RegionLayout';

export default function KirschgartenPage() {
  return (
    <RegionLayout
      title="Kirschgarten"
      level="vineyard"
      parentRegion="germany/pfalz"
      classification="grosses-gewachs"
      contentFile="kirschgarten-guide.md"
    />
  );
}
