import RegionLayout from '@/components/RegionLayout';

const LOMBARDY_SUB_REGIONS = [
  { name: 'Franciacorta', slug: 'franciacorta' },
  { name: 'Valtellina', slug: 'valtellina' },
  { name: 'Oltrepò Pavese', slug: 'oltrepo-pavese' },
  { name: 'Lugana', slug: 'lugana' },
];

export default function LombardyPage() {
  return (
    <RegionLayout
      title="Lombardy"
      level="region"
      parentRegion="italy"
      sidebarLinks={LOMBARDY_SUB_REGIONS}
      contentFile="lombardy-guide.md"
    />
  );
}
