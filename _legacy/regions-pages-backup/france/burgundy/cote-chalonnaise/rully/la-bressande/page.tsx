import RegionLayout from '@/components/RegionLayout';

export default function LaBressandePage() {
  return (
    <RegionLayout
      title="La Bressande"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/rully"
      classification="premier-cru"
      contentFile="la-bressande-guide.md"
    />
  );
}
