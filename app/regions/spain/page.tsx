import RegionLayout from '@/components/RegionLayout';

const SPAIN_SUB_REGIONS = [
  // Northern Spain
  { name: 'Rioja', slug: 'rioja' },
  { name: 'Navarra', slug: 'navarra' },
  { name: 'Txakoli', slug: 'txakoli' },
  // Castilla y León
  { name: 'Ribera del Duero', slug: 'ribera-del-duero' },
  { name: 'Toro', slug: 'toro' },
  { name: 'Rueda', slug: 'rueda' },
  { name: 'Bierzo', slug: 'bierzo' },
  { name: 'Cigales', slug: 'cigales' },
  // Galicia
  { name: 'Rías Baixas', slug: 'rias-baixas' },
  { name: 'Ribeiro', slug: 'ribeiro' },
  { name: 'Valdeorras', slug: 'valdeorras' },
  // Catalonia
  { name: 'Priorat', slug: 'priorat' },
  { name: 'Montsant', slug: 'montsant' },
  { name: 'Penedès', slug: 'penedes' },
  { name: 'Cava', slug: 'cava' },
  // Aragón
  { name: 'Somontano', slug: 'somontano' },
  { name: 'Calatayud', slug: 'calatayud' },
  // Central Spain
  { name: 'La Mancha', slug: 'la-mancha' },
  // Levante (Eastern Spain)
  { name: 'Jumilla', slug: 'jumilla' },
  { name: 'Yecla', slug: 'yecla' },
  { name: 'Alicante', slug: 'alicante' },
  { name: 'Valencia', slug: 'valencia' },
  // Andalusia
  { name: 'Jerez', slug: 'jerez' },
  { name: 'Montilla-Moriles', slug: 'montilla-moriles' },
  { name: 'Málaga', slug: 'malaga' },
];

export default function SpainPage() {
  return (
    <RegionLayout
      title="Spain"
      level="country"
      sidebarLinks={SPAIN_SUB_REGIONS}
      contentFile="spain-guide.md"
    />
  );
}
