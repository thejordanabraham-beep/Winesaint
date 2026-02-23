import RegionLayout from '@/components/RegionLayout';

export default function BergRoseneckPage() {
  return (
    <RegionLayout
      title="Berg Roseneck"
      level="vineyard"
      parentRegion="germany/rheingau"
      classification="grosses-gewachs"
      contentFile="berg-roseneck-guide.md"
    />
  );
}
