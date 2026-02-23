import RegionLayout from '@/components/RegionLayout';

export default function MhlbergPage() {
  return (
    <RegionLayout
      title="Mühlberg"
      level="vineyard"
      parentRegion="germany/nahe"
      classification="grosses-gewachs"
      contentFile="muhlberg-guide.md"
    />
  );
}
