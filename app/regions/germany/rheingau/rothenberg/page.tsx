import RegionLayout from '@/components/RegionLayout';

export default function RothenbergPage() {
  return (
    <RegionLayout
      title="Rothenberg"
      level="vineyard"
      parentRegion="germany/rheingau"
      classification="grosses-gewachs"
      contentFile="rothenberg-guide.md"
    />
  );
}
