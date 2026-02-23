import RegionLayout from '@/components/RegionLayout';

const COTE_CHALONNAISE_VILLAGES = [
  { name: 'Rully', slug: 'rully' },
  { name: 'Mercurey', slug: 'mercurey' },
  { name: 'Givry', slug: 'givry' },
  { name: 'Montagny', slug: 'montagny' },
];

export default function CoteChalonnaisePage() {
  return (
    <RegionLayout
      title="Côte Chalonnaise"
      level="sub-region"
      parentRegion="france/burgundy"
      sidebarLinks={COTE_CHALONNAISE_VILLAGES}
      contentFile="cote-chalonnaise-guide.md"
    />
  );
}
