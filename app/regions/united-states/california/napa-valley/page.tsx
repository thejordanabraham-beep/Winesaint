import RegionLayout from '@/components/RegionLayout';

// Napa Valley AVAs (American Viticultural Areas)
const NAPA_VALLEY_AVAS = [
  { name: 'Atlas Peak', slug: 'atlas-peak' },
  { name: 'Calistoga', slug: 'calistoga' },
  { name: 'Chiles Valley', slug: 'chiles-valley' },
  { name: 'Coombsville', slug: 'coombsville' },
  { name: 'Diamond Mountain District', slug: 'diamond-mountain-district' },
  { name: 'Howell Mountain', slug: 'howell-mountain' },
  { name: 'Los Carneros', slug: 'los-carneros' },
  { name: 'Mount Veeder', slug: 'mount-veeder' },
  { name: 'Oak Knoll District', slug: 'oak-knoll-district' },
  { name: 'Oakville', slug: 'oakville' },
  { name: 'Rutherford', slug: 'rutherford' },
  { name: 'Spring Mountain District', slug: 'spring-mountain-district' },
  { name: 'St. Helena', slug: 'st-helena' },
  { name: 'Stags Leap District', slug: 'stags-leap-district' },
  { name: 'Yountville', slug: 'yountville' },
];

export default function NapaValleyPage() {
  return (
    <RegionLayout
      title="Napa Valley"
      level="sub-region"
      parentRegion="united-states/california"
      sidebarLinks={NAPA_VALLEY_AVAS}
      contentFile="napa-valley-guide.md"
    />
  );
}
