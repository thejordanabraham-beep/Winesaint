import RegionLayout from '@/components/RegionLayout';

export default function BadstubePage() {
  return (
    <RegionLayout
      title="Badstube"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="badstube-guide.md"
    />
  );
}
