import RegionLayout from '@/components/RegionLayout';

const CONDRIEU_PRODUCERS = [
  { name: 'Domaine Georges Vernay', slug: 'domaine-georges-vernay', classification: 'single-vineyard' as const },
  { name: 'Domaine Yves Cuilleron', slug: 'domaine-yves-cuilleron', classification: 'single-vineyard' as const },
];

export default function CondrieuPage() {
  return (
    <RegionLayout
      title="Condrieu"
      level="sub-region"
      parentRegion="france/rhone-valley"
      sidebarLinks={CONDRIEU_PRODUCERS}
      contentFile="condrieu-guide.md"
    />
  );
}
