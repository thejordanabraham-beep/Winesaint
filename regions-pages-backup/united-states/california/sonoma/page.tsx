import RegionLayout from '@/components/RegionLayout';

// Sonoma County AVAs
const SONOMA_AVAS = [
  { name: 'Alexander Valley', slug: 'alexander-valley' },
  { name: 'Bennett Valley', slug: 'bennett-valley' },
  { name: 'Chalk Hill', slug: 'chalk-hill' },
  { name: 'Dry Creek Valley', slug: 'dry-creek-valley' },
  { name: 'Fort Ross-Seaview', slug: 'fort-ross-seaview' },
  { name: 'Fountain Grove District', slug: 'fountain-grove-district' },
  { name: 'Green Valley', slug: 'green-valley' },
  { name: 'Knights Valley', slug: 'knights-valley' },
  { name: 'Los Carneros', slug: 'los-carneros' },
  { name: 'Moon Mountain District', slug: 'moon-mountain-district' },
  { name: 'Petaluma Gap', slug: 'petaluma-gap' },
  { name: 'Rockpile', slug: 'rockpile' },
  { name: 'Russian River Valley', slug: 'russian-river-valley' },
  { name: 'Sonoma Coast', slug: 'sonoma-coast' },
  { name: 'Sonoma Mountain', slug: 'sonoma-mountain' },
  { name: 'Sonoma Valley', slug: 'sonoma-valley' },
];

export default function SonomaPage() {
  return (
    <RegionLayout
      title="Sonoma"
      level="sub-region"
      parentRegion="united-states/california"
      sidebarLinks={SONOMA_AVAS}
      contentFile="sonoma-guide.md"
    />
  );
}
