import RegionLayout from '@/components/RegionLayout';

const MAIPOVALLEY_PRODUCERS = [
  { name: 'Concha y Toro Don Melchor', slug: 'concha-y-toro-don-melchor', classification: 'single-vineyard' as const },
  { name: 'Almaviva', slug: 'almaviva', classification: 'single-vineyard' as const },
  { name: 'Santa Rita Casa Real', slug: 'santa-rita-casa-real', classification: 'single-vineyard' as const },
];

export default function MaipoValleyPage() {
  return (
    <RegionLayout
      title="Maipo Valley"
      level="region"
      parentRegion="chile"
      sidebarLinks={MAIPOVALLEY_PRODUCERS}
      contentFile="maipo-valley-guide.md"
    />
  );
}
