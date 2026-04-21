import RegionLayout from '@/components/RegionLayout';

export default async function CoteDeBrouillyPage() {
  return (
    <RegionLayout
      title="Côte de Brouilly"
      level="sub-region"
      parentRegion="france/beaujolais"
      contentFile="côte-de-brouilly-guide.md"
    />
  );
}
