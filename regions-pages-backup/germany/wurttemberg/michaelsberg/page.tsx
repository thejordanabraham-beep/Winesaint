import RegionLayout from '@/components/RegionLayout';

export default function MichaelsbergPage() {
  return (
    <RegionLayout
      title="Michaelsberg"
      level="vineyard"
      parentRegion="germany/wurttemberg"
      classification="grosses-gewachs"
      contentFile="michaelsberg-guide.md"
    />
  );
}
