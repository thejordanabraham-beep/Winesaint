import RegionLayout from '@/components/RegionLayout';

// Walla Walla Valley sub-AVAs (Oregon portion)
const WALLA_WALLA_AVAS = [
  { name: 'The Rocks District of Milton-Freewater', slug: 'rocks-district-milton-freewater' },
];

export default function WallaWallaValleyPage() {
  return (
    <RegionLayout
      title="Walla Walla Valley"
      level="sub-region"
      parentRegion="united-states/oregon"
      sidebarLinks={WALLA_WALLA_AVAS}
      contentFile="walla-walla-valley-oregon-guide.md"
    />
  );
}
