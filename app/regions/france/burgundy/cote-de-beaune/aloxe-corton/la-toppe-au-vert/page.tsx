import RegionLayout from '@/components/RegionLayout';

export default function LaToppeauVertPage() {
  return (
    <RegionLayout
      title="La Toppe au Vert"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/aloxe-corton"
      classification="premier-cru"
      contentFile="la-toppe-au-vert-guide.md"
    />
  );
}
