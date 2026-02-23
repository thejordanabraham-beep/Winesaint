import RegionLayout from '@/components/RegionLayout';

export default function ApothekePage() {
  return (
    <RegionLayout
      title="Apotheke"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="apotheke-guide.md"
    />
  );
}
