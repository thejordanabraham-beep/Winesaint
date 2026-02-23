import RegionLayout from '@/components/RegionLayout';

export default function RogueValleyPage() {
  return (
    <RegionLayout
      title="Rogue Valley"
      level="sub-region"
      parentRegion="united-states/oregon/southern-oregon"
      contentFile="rogue-valley-guide.md"
    />
  );
}
