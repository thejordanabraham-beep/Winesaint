import RegionLayout from '@/components/RegionLayout';

export default function EnlOrmePage() {
  return (
    <RegionLayout
      title="En l'Orme"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="en-l-orme-guide.md"
    />
  );
}
