import RegionLayout from '@/components/RegionLayout';

// Mendocino County AVAs
const MENDOCINO_AVAS = [
  { name: 'Anderson Valley', slug: 'anderson-valley' },
  { name: 'Cole Ranch', slug: 'cole-ranch' },
  { name: 'Covelo', slug: 'covelo' },
  { name: 'Dos Rios', slug: 'dos-rios' },
  { name: 'Eagle Peak Mendocino County', slug: 'eagle-peak' },
  { name: 'McDowell Valley', slug: 'mcdowell-valley' },
  { name: 'Mendocino Ridge', slug: 'mendocino-ridge' },
  { name: 'Potter Valley', slug: 'potter-valley' },
  { name: 'Redwood Valley', slug: 'redwood-valley' },
  { name: 'Yorkville Highlands', slug: 'yorkville-highlands' },
];

export default function MendocinoPage() {
  return (
    <RegionLayout
      title="Mendocino"
      level="sub-region"
      parentRegion="united-states/california"
      sidebarLinks={MENDOCINO_AVAS}
      contentFile="mendocino-guide.md"
    />
  );
}
