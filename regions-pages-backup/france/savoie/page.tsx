import RegionLayout from '@/components/RegionLayout';

const SAVOIE_APPELLATIONS = [
  { name: 'Vin de Savoie', slug: 'vin-de-savoie' },
  { name: 'Bugey', slug: 'bugey' },
  { name: 'Crépy', slug: 'crepy' },
  { name: 'Seyssel', slug: 'seyssel' },
];

export default function SavoiePage() {
  return (
    <RegionLayout
      title="Savoie"
      level="region"
      parentRegion="france"
      sidebarLinks={SAVOIE_APPELLATIONS}
      contentFile="savoie-guide.md"
    />
  );
}
