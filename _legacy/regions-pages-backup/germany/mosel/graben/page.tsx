import RegionLayout from '@/components/RegionLayout';

export default function GrabenPage() {
  return (
    <RegionLayout
      title="Graben"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="graben-guide.md"
    />
  );
}
