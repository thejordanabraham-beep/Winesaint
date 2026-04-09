import RegionLayout from '@/components/RegionLayout';

export default function PiantPage() {
  return (
    <RegionLayout
      title="Piantà"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/serralunga-d-alba"
      classification="mga"
      contentFile="pianta-guide.md"
    />
  );
}
