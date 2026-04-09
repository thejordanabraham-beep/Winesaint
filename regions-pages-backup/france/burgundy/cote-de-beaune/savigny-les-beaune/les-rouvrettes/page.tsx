import RegionLayout from '@/components/RegionLayout';

export default function LesRouvrettesPage() {
  return (
    <RegionLayout
      title="Les Rouvrettes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/savigny-les-beaune"
      classification="premier-cru"
      contentFile="les-rouvrettes-guide.md"
    />
  );
}
