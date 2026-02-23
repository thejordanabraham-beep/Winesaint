import RegionLayout from '@/components/RegionLayout';

export default function AltenbergPage() {
  return (
    <RegionLayout
      title="Altenberg"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="altenberg-guide.md"
    />
  );
}
