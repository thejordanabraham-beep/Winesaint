import RegionLayout from '@/components/RegionLayout';

export default function BelissandPage() {
  return (
    <RegionLayout
      title="Belissand"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="belissand-guide.md"
    />
  );
}
