import RegionLayout from '@/components/RegionLayout';

// Willamette Valley AVAs (nested sub-regions)
const WILLAMETTE_VALLEY_AVAS = [
  { name: 'Chehalem Mountains', slug: 'chehalem-mountains' },
  { name: 'Dundee Hills', slug: 'dundee-hills' },
  { name: 'Eola-Amity Hills', slug: 'eola-amity-hills' },
  { name: 'Laurelwood District', slug: 'laurelwood-district' },
  { name: 'Lower Long Tom', slug: 'lower-long-tom' },
  { name: 'McMinnville', slug: 'mcminnville' },
  { name: 'Mount Pisgah, Polk County', slug: 'mount-pisgah-polk-county' },
  { name: 'Ribbon Ridge', slug: 'ribbon-ridge' },
  { name: 'Tualatin Hills', slug: 'tualatin-hills' },
  { name: 'Van Duzer Corridor', slug: 'van-duzer-corridor' },
  { name: 'Yamhill-Carlton', slug: 'yamhill-carlton' },
];

export default function WillametteValleyPage() {
  return (
    <RegionLayout
      title="Willamette Valley"
      level="sub-region"
      parentRegion="united-states/oregon"
      sidebarLinks={WILLAMETTE_VALLEY_AVAS}
      contentFile="willamette-valley-guide.md"
    />
  );
}
