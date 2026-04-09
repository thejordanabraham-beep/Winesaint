import RegionLayout from '@/components/RegionLayout';

export default function EnlaMontagnePage() {
  return (
    <RegionLayout
      title="En la Montagne"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/marsannay"
      classification="premier-cru"
      contentFile="en-la-montagne-guide.md"
    />
  );
}
