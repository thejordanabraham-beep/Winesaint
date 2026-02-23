import RegionLayout from '@/components/RegionLayout';

export default async function CotesDuRhoneVillagesPage() {
  return (
    <RegionLayout
      title="Côtes du Rhône Villages"
      level="sub-region"
      parentRegion="france/southern-rhone"
      contentFile="côtes-du-rhône-villages-guide.md"
    />
  );
}
