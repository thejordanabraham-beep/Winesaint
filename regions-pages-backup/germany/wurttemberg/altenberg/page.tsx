import RegionLayout from '@/components/RegionLayout';

export default function AltenbergPage() {
  return (
    <RegionLayout
      title="Altenberg"
      level="vineyard"
      parentRegion="germany/wurttemberg"
      classification="grosses-gewachs"
      contentFile="altenberg-guide.md"
    />
  );
}
