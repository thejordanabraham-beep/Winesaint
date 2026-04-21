import RegionLayout from '@/components/RegionLayout';

export default function SurlesGrvesPage() {
  return (
    <RegionLayout
      title="Sur les Grèves"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="sur-les-greves-guide.md"
    />
  );
}
