import RegionLayout from '@/components/RegionLayout';

export default function LaMissionPage() {
  return (
    <RegionLayout
      title="La Mission"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/mercurey"
      classification="premier-cru"
      contentFile="la-mission-guide.md"
    />
  );
}
