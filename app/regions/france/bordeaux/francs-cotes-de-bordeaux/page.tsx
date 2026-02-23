import RegionLayout from '@/components/RegionLayout';

export default function FrancsCotesDeBordeauxPage() {
  return (
    <RegionLayout
      title="Francs Côtes de Bordeaux"
      level="sub-region"
      parentRegion="france/bordeaux"
      contentFile="francs-cotes-de-bordeaux-guide.md"
    />
  );
}
