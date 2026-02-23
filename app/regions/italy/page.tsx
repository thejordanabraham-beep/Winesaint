import RegionLayout from '@/components/RegionLayout';

const ITALY_SUB_REGIONS = [
  // Northern Italy
  { name: 'Piedmont', slug: 'piedmont' },
  { name: 'Lombardy', slug: 'lombardy' },
  { name: 'Valle d\'Aosta', slug: 'valle-d-aosta' },
  { name: 'Liguria', slug: 'liguria' },
  { name: 'Trentino-Alto Adige', slug: 'trentino-alto-adige' },
  { name: 'Friuli-Venezia Giulia', slug: 'friuli-venezia-giulia' },
  { name: 'Veneto', slug: 'veneto' },
  { name: 'Emilia-Romagna', slug: 'emilia-romagna' },
  // Central Italy
  { name: 'Tuscany', slug: 'tuscany' },
  { name: 'Umbria', slug: 'umbria' },
  { name: 'Marche', slug: 'marche' },
  { name: 'Lazio', slug: 'lazio' },
  { name: 'Abruzzo', slug: 'abruzzo' },
  // Southern Italy
  { name: 'Molise', slug: 'molise' },
  { name: 'Campania', slug: 'campania' },
  { name: 'Basilicata', slug: 'basilicata' },
  { name: 'Puglia', slug: 'puglia' },
  { name: 'Calabria', slug: 'calabria' },
  // Islands
  { name: 'Sicily', slug: 'sicily' },
  { name: 'Sardinia', slug: 'sardinia' },
];

export default function ItalyPage() {
  return (
    <RegionLayout
      title="Italy"
      level="country"
      sidebarLinks={ITALY_SUB_REGIONS}
      contentFile="italy-guide.md"
    />
  );
}
