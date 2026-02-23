import RegionLayout from '@/components/RegionLayout';

export default function CoteauxDuLayonPage() {
  return (
    <RegionLayout
      title="Coteaux du Layon"
      level="village"
      parentRegion="france/loire-valley/anjou-saumur"
      contentFile="coteaux-du-layon-guide.md"
    />
  );
}
