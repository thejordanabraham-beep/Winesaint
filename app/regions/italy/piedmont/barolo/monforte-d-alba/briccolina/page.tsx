import RegionLayout from '@/components/RegionLayout';

export default function BriccolinaPage() {
  return (
    <RegionLayout
      title="Briccolina"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/monforte-d-alba"
      classification="mga"
      contentFile="briccolina-guide.md"
    />
  );
}
