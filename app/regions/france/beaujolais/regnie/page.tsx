import RegionLayout from '@/components/RegionLayout';

export default async function RegniePage() {
  return (
    <RegionLayout
      title="Régnié"
      level="sub-region"
      parentRegion="france/beaujolais"
      contentFile="régnié-guide.md"
    />
  );
}
