import RegionLayout from '@/components/RegionLayout';

const COTE_DE_BEAUNE_VILLAGES = [
  { name: 'Ladoix', slug: 'ladoix' },
  { name: 'Aloxe-Corton', slug: 'aloxe-corton' },
  { name: 'Pernand-Vergelesses', slug: 'pernand-vergelesses' },
  { name: 'Savigny-lès-Beaune', slug: 'savigny-les-beaune' },
  { name: 'Beaune', slug: 'beaune' },
  { name: 'Pommard', slug: 'pommard' },
  { name: 'Volnay', slug: 'volnay' },
  { name: 'Monthélie', slug: 'monthelie' },
  { name: 'Auxey-Duresses', slug: 'auxey-duresses' },
  { name: 'Meursault', slug: 'meursault' },
  { name: 'Puligny-Montrachet', slug: 'puligny-montrachet' },
  { name: 'Chassagne-Montrachet', slug: 'chassagne-montrachet' },
  { name: 'Saint-Aubin', slug: 'saint-aubin' },
  { name: 'Santenay', slug: 'santenay' },
];

export default function CoteDeBeaunePage() {
  return (
    <RegionLayout
      title="Côte de Beaune"
      level="sub-region"
      parentRegion="france/burgundy"
      sidebarLinks={COTE_DE_BEAUNE_VILLAGES}
      contentFile="cote-de-beaune-guide.md"
    />
  );
}
