import RegionLayout from '@/components/RegionLayout';

export default function LesArgilliresPage() {
  return (
    <RegionLayout
      title="Les Argillières"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="les-argillieres-guide.md"
    />
  );
}
