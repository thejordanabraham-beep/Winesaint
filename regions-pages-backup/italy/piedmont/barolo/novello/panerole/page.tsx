import RegionLayout from '@/components/RegionLayout';

export default function PanerolePage() {
  return (
    <RegionLayout
      title="Panerole"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/novello"
      classification="mga"
      contentFile="panerole-guide.md"
    />
  );
}
