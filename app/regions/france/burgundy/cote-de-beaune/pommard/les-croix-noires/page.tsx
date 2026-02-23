import RegionLayout from '@/components/RegionLayout';

export default function LesCroixNoiresPage() {
  return (
    <RegionLayout
      title="Les Croix Noires"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pommard"
      classification="premier-cru"
      contentFile="les-croix-noires-guide.md"
    />
  );
}
