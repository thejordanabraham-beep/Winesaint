import RegionLayout from '@/components/RegionLayout';

export default function HerzogenbergPage() {
  return (
    <RegionLayout
      title="Herzogenberg"
      level="vineyard"
      parentRegion="germany/wurttemberg"
      classification="grosses-gewachs"
      contentFile="herzogenberg-guide.md"
    />
  );
}
