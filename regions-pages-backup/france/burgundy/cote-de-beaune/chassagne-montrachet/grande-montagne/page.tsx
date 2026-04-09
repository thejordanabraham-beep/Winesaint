import RegionLayout from '@/components/RegionLayout';

export default function GrandeMontagnePage() {
  return (
    <RegionLayout
      title="Grande Montagne"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="grande-montagne-guide.md"
    />
  );
}
