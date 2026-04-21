import RegionLayout from '@/components/RegionLayout';

export default function LaVigneBlanchePage() {
  return (
    <RegionLayout
      title="La Vigne Blanche"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/vougeot"
      classification="premier-cru"
      contentFile="la-vigne-blanche-guide.md"
    />
  );
}
