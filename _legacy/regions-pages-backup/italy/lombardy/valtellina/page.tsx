import RegionLayout from '@/components/RegionLayout';

const VALTELLINA_SUB_ZONES = [
  { name: 'Sassella', slug: 'sassella' },
  { name: 'Grumello', slug: 'grumello' },
  { name: 'Inferno', slug: 'inferno' },
  { name: 'Valgella', slug: 'valgella' },
];

export default function ValtellinaPage() {
  return (
    <RegionLayout
      title="Valtellina"
      level="sub-region"
      parentRegion="italy/lombardy"
      sidebarLinks={VALTELLINA_SUB_ZONES}
      contentFile="valtellina-guide.md"
    />
  );
}
