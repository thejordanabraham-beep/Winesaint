import RegionLayout from '@/components/RegionLayout';

// Columbia Valley nested AVAs
const COLUMBIA_VALLEY_AVAS = [
  { name: 'Ancient Lakes', slug: 'ancient-lakes' },
  { name: 'Candy Mountain', slug: 'candy-mountain' },
  { name: 'Goose Gap', slug: 'goose-gap' },
  { name: 'Horse Heaven Hills', slug: 'horse-heaven-hills' },
  { name: 'Lake Chelan', slug: 'lake-chelan' },
  { name: 'Lewis-Clark Valley', slug: 'lewis-clark-valley' },
  { name: 'Naches Heights', slug: 'naches-heights' },
  { name: 'Rattlesnake Hills', slug: 'rattlesnake-hills' },
  { name: 'Red Mountain', slug: 'red-mountain' },
  { name: 'Royal Slope', slug: 'royal-slope' },
  { name: 'Snipes Mountain', slug: 'snipes-mountain' },
  { name: 'The Burn of Columbia Valley', slug: 'burn-of-columbia-valley' },
  { name: 'Wahluke Slope', slug: 'wahluke-slope' },
  { name: 'Walla Walla Valley', slug: 'walla-walla-valley' },
  { name: 'White Bluffs', slug: 'white-bluffs' },
  { name: 'Yakima Valley', slug: 'yakima-valley' },
];

export default function ColumbiaValleyPage() {
  return (
    <RegionLayout
      title="Columbia Valley"
      level="sub-region"
      parentRegion="united-states/washington"
      sidebarLinks={COLUMBIA_VALLEY_AVAS}
      contentFile="columbia-valley-washington-guide.md"
    />
  );
}
