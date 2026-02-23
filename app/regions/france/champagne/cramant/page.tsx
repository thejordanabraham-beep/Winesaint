import RegionLayout from '@/components/RegionLayout';

export default function CramantPage() {
  return (
    <RegionLayout
      title="Cramant"
      level="vineyard"
      parentRegion="france/champagne"
      classification="grand-cru"
      contentFile="cramant-guide.md"
    />
  );
}
