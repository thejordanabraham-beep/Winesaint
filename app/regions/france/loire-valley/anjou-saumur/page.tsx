import RegionLayout from '@/components/RegionLayout';

// Anjou-Saumur appellations - consolidated structure
const ANJOU_SAUMUR_APPELLATIONS = [
  { name: 'Savennières', slug: 'savennieres' },
  { name: 'Quarts de Chaume', slug: 'quarts-de-chaume' },
  { name: 'Bonnezeaux', slug: 'bonnezeaux' },
  { name: 'Coteaux du Layon', slug: 'coteaux-du-layon' },
  { name: 'Anjou', slug: 'anjou' },
  { name: 'Saumur', slug: 'saumur' },
  { name: 'Saumur-Champigny', slug: 'saumur-champigny' },
];

export default function AnjouSaumurPage() {
  return (
    <RegionLayout
      title="Anjou-Saumur"
      level="sub-region"
      parentRegion="france/loire-valley"
      sidebarLinks={ANJOU_SAUMUR_APPELLATIONS}
      contentFile="anjou-saumur-guide.md"
    />
  );
}
