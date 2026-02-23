import RegionLayout from '@/components/RegionLayout';

export default function GoldbergPage() {
  return (
    <RegionLayout
      title="Goldberg"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="goldberg-guide.md"
    />
  );
}
