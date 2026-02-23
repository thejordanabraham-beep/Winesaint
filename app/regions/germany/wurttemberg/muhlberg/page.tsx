import RegionLayout from '@/components/RegionLayout';

export default function MhlbergPage() {
  return (
    <RegionLayout
      title="Mühlberg"
      level="vineyard"
      parentRegion="germany/wurttemberg"
      classification="grosses-gewachs"
      contentFile="muhlberg-guide.md"
    />
  );
}
