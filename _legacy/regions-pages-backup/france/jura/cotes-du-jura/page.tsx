import RegionLayout from '@/components/RegionLayout';

export default function CotesDuJuraPage() {
  return (
    <RegionLayout
      title="Côtes du Jura"
      level="sub-region"
      parentRegion="france/jura"
      contentFile="cotes-du-jura-guide.md"
    />
  );
}
