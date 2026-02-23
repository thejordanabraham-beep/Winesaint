import RegionLayout from '@/components/RegionLayout';

const COTE_DE_NUITS_VILLAGES = [
  { name: 'Gevrey-Chambertin', slug: 'gevrey-chambertin' },
  { name: 'Morey-Saint-Denis', slug: 'morey-saint-denis' },
  { name: 'Chambolle-Musigny', slug: 'chambolle-musigny' },
  { name: 'Vougeot', slug: 'vougeot' },
  { name: 'Vosne-Romanée', slug: 'vosne-romanee' },
];

export default function CoteDeNuitsPage() {
  return (
    <RegionLayout
      title="Côte de Nuits"
      level="sub-region"
      parentRegion="france/burgundy"
      sidebarLinks={COTE_DE_NUITS_VILLAGES}
      contentFile="cote-de-nuits-guide.md"
    />
  );
}
