import RegionLayout from '@/components/RegionLayout';

export default function LesFourniresPage() {
  return (
    <RegionLayout
      title="Les Fournières"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/aloxe-corton"
      classification="premier-cru"
      contentFile="les-fournieres-guide.md"
    />
  );
}
