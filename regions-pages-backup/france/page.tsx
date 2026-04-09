import RegionLayout from '@/components/RegionLayout';

const FRANCE_SUB_REGIONS = [
  { name: 'Champagne', slug: 'champagne' },
  { name: 'Alsace', slug: 'alsace' },
  { name: 'Burgundy', slug: 'burgundy' },
  { name: 'Beaujolais', slug: 'beaujolais' },
  { name: 'Rhône Valley', slug: 'rhone-valley' },
  { name: 'Loire Valley', slug: 'loire-valley' },
  { name: 'Provence', slug: 'provence' },
  { name: 'Languedoc', slug: 'languedoc' },
  { name: 'Roussillon', slug: 'roussillon' },
  { name: 'Bordeaux', slug: 'bordeaux' },
  { name: 'Jura', slug: 'jura' },
  { name: 'Savoie', slug: 'savoie' },
];

export default function FrancePage() {
  return (
    <RegionLayout
      title="France"
      level="country"
      sidebarLinks={FRANCE_SUB_REGIONS}
      contentFile="france-guide.md"
    />
  );
}
