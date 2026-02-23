import RegionLayout from '@/components/RegionLayout';

export default function CotesDuRoussillonPage() {
  return (
    <RegionLayout
      title="Côtes du Roussillon"
      level="sub-region"
      parentRegion="france/roussillon"
      contentFile="cotes-du-roussillon-guide.md"
    />
  );
}
