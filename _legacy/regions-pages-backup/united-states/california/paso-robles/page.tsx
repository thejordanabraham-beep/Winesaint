import RegionLayout from '@/components/RegionLayout';

// Paso Robles AVAs (11 sub-districts)
const PASO_ROBLES_AVAS = [
  { name: 'Adelaida District', slug: 'adelaida-district' },
  { name: 'Creston District', slug: 'creston-district' },
  { name: 'El Pomar District', slug: 'el-pomar-district' },
  { name: 'Estrella District', slug: 'estrella-district' },
  { name: 'Geneseo District', slug: 'geneseo-district' },
  { name: 'Highlands District', slug: 'highlands-district' },
  { name: 'Paso Robles Willow Creek District', slug: 'willow-creek-district' },
  { name: 'San Juan Creek', slug: 'san-juan-creek' },
  { name: 'San Miguel District', slug: 'san-miguel-district' },
  { name: 'Santa Margarita Ranch', slug: 'santa-margarita-ranch' },
  { name: 'Templeton Gap District', slug: 'templeton-gap-district' },
];

export default function PasoRoblesPage() {
  return (
    <RegionLayout
      title="Paso Robles"
      level="sub-region"
      parentRegion="united-states/california"
      sidebarLinks={PASO_ROBLES_AVAS}
      contentFile="paso-robles-guide.md"
    />
  );
}
