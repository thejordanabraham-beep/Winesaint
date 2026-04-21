import RegionLayout from '@/components/RegionLayout';

export default function LesPetitesLoliresPage() {
  return (
    <RegionLayout
      title="Les Petites Lolières"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/aloxe-corton"
      classification="premier-cru"
      contentFile="les-petites-lolieres-guide.md"
    />
  );
}
