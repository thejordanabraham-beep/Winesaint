import RegionLayout from '@/components/RegionLayout';

export default function RaviolePage() {
  return (
    <RegionLayout
      title="Raviole"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/novello"
      classification="mga"
      contentFile="raviole-guide.md"
    />
  );
}
