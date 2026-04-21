import RegionLayout from '@/components/RegionLayout';

export default function LesGalaffresPage() {
  return (
    <RegionLayout
      title="Les Galaffres"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="les-galaffres-guide.md"
    />
  );
}
