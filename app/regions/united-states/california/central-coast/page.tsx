import RegionLayout from '@/components/RegionLayout';

// Central Coast AVAs
const CENTRAL_COAST_AVAS = [
  { name: 'Arroyo Seco', slug: 'arroyo-seco' },
  { name: 'Carmel Valley', slug: 'carmel-valley' },
  { name: 'Chalone', slug: 'chalone' },
  { name: 'Cienega Valley', slug: 'cienega-valley' },
  { name: 'Lime Kiln Valley', slug: 'lime-kiln-valley' },
  { name: 'Mount Harlan', slug: 'mount-harlan' },
  { name: 'Paicines', slug: 'paicines' },
  { name: 'San Benito', slug: 'san-benito' },
  { name: 'San Ysidro District', slug: 'san-ysidro-district' },
  { name: 'Santa Cruz Mountains', slug: 'santa-cruz-mountains' },
  { name: 'Santa Lucia Highlands', slug: 'santa-lucia-highlands' },
];

export default function CentralCoastPage() {
  return (
    <RegionLayout
      title="Central Coast"
      level="sub-region"
      parentRegion="united-states/california"
      sidebarLinks={CENTRAL_COAST_AVAS}
      contentFile="central-coast-guide.md"
    />
  );
}
