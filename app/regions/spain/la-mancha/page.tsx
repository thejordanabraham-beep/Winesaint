import RegionLayout from '@/components/RegionLayout';

export default function LaManchaPage() {
  return (
    <RegionLayout
      title="La Mancha"
      level="region"
      parentRegion="spain"
      contentFile="la-mancha-guide.md"
    />
  );
}
