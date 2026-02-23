import RegionLayout from '@/components/RegionLayout';

export default function WrzgartenPage() {
  return (
    <RegionLayout
      title="Würzgarten"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="wurzgarten-guide.md"
    />
  );
}
