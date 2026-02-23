import RegionLayout from '@/components/RegionLayout';

export default async function ChateauneufDuPapePage() {
  return (
    <RegionLayout
      title="Châteauneuf-du-Pape"
      level="sub-region"
      parentRegion="france/southern-rhone"
      contentFile="châteauneuf-du-pape-guide.md"
    />
  );
}
