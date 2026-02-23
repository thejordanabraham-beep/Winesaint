import RegionLayout from '@/components/RegionLayout';

export default function SpitzenbergPage() {
  return (
    <RegionLayout
      title="Spitzenberg"
      level="vineyard"
      parentRegion="germany/wurttemberg"
      classification="grosses-gewachs"
      contentFile="spitzenberg-guide.md"
    />
  );
}
