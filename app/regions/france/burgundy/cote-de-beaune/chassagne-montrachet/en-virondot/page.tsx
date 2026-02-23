import RegionLayout from '@/components/RegionLayout';

export default function EnVirondotPage() {
  return (
    <RegionLayout
      title="En Virondot"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="en-virondot-vineyard-guide.md"
    />
  );
}
