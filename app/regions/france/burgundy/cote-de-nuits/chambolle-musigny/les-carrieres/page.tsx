import RegionLayout from '@/components/RegionLayout';

export default function LesCarriresPage() {
  return (
    <RegionLayout
      title="Les Carrières"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/chambolle-musigny"
      classification="premier-cru"
      contentFile="les-carrieres-guide.md"
    />
  );
}
