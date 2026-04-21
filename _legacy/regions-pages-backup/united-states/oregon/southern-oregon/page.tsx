import RegionLayout from '@/components/RegionLayout';

// Southern Oregon AVAs
const SOUTHERN_OREGON_AVAS = [
  { name: 'Applegate Valley', slug: 'applegate-valley' },
  { name: 'Red Hill Douglas County', slug: 'red-hill-douglas-county' },
  { name: 'Rogue Valley', slug: 'rogue-valley' },
  { name: 'Umpqua Valley', slug: 'umpqua-valley' },
];

export default function SouthernOregonPage() {
  return (
    <RegionLayout
      title="Southern Oregon"
      level="sub-region"
      parentRegion="united-states/oregon"
      sidebarLinks={SOUTHERN_OREGON_AVAS}
      contentFile="southern-oregon-guide.md"
    />
  );
}
