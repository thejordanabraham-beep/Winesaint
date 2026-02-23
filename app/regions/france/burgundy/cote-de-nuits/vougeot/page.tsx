import RegionLayout from '@/components/RegionLayout';

const VOUGEOT_VINEYARDS = [
  { name: 'Clos-de-la-Perriere', slug: 'clos-de-la-perriere', classification: 'premier-cru' as const },
  { name: 'Clos-de-Vougeot', slug: 'clos-de-vougeot', classification: 'premier-cru' as const },
  { name: 'la-Vigne-Blanche', slug: 'la-vigne-blanche', classification: 'premier-cru' as const },
  { name: 'les-Cras', slug: 'les-cras', classification: 'premier-cru' as const },
  { name: 'les-Cras-Vougeot', slug: 'les-cras-vougeot', classification: 'premier-cru' as const },
  { name: 'les-Petits-Vougeots', slug: 'les-petits-vougeots', classification: 'premier-cru' as const },] as const;

export default function VougeotPage() {
  return (
    <RegionLayout
      title="Vougeot"
      level="village"
      parentRegion="france/burgundy/cote-de-nuits"
      sidebarLinks={VOUGEOT_VINEYARDS}
      contentFile="vougeot-guide.md"
    />
  );
}
