import RegionLayout from '@/components/RegionLayout';

export default function MarienburgPage() {
  return (
    <RegionLayout
      title="Marienburg"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="marienburg-guide.md"
    />
  );
}
