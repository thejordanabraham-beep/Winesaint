import RegionLayout from '@/components/RegionLayout';

// Santa Barbara County AVAs
const SANTA_BARBARA_AVAS = [
  { name: 'Ballard Canyon', slug: 'ballard-canyon' },
  { name: 'Happy Canyon of Santa Barbara', slug: 'happy-canyon' },
  { name: 'Los Olivos District', slug: 'los-olivos-district' },
  { name: 'Santa Maria Valley', slug: 'santa-maria-valley' },
  { name: 'Santa Rita Hills', slug: 'santa-rita-hills' },
  { name: 'Santa Ynez Valley', slug: 'santa-ynez-valley' },
];

export default function SantaBarbaraPage() {
  return (
    <RegionLayout
      title="Santa Barbara"
      level="sub-region"
      parentRegion="united-states/california"
      sidebarLinks={SANTA_BARBARA_AVAS}
      contentFile="santa-barbara-guide.md"
    />
  );
}
