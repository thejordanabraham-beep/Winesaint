import RegionLayout from '@/components/RegionLayout';

const GEVREYCHAMBERTIN_VINEYARDS = [
  { name: 'Chambertin', slug: 'chambertin', classification: 'grand-cru' as const },
  { name: 'Chapelle-Chambertin', slug: 'chapelle-chambertin', classification: 'grand-cru' as const },
  { name: 'Charmes-Chambertin', slug: 'charmes-chambertin', classification: 'grand-cru' as const },
  { name: 'Griotte-Chambertin', slug: 'griotte-chambertin', classification: 'grand-cru' as const },
  { name: 'Latricieres-Chambertin', slug: 'latricieres-chambertin', classification: 'grand-cru' as const },
  { name: 'Mazis-Chambertin', slug: 'mazis-chambertin', classification: 'grand-cru' as const },
  { name: 'Mazoyeres-Chambertin', slug: 'mazoyeres-chambertin', classification: 'grand-cru' as const },
  { name: 'Ruchottes-Chambertin', slug: 'ruchottes-chambertin', classification: 'grand-cru' as const },
  { name: 'Au-Closeau', slug: 'au-closeau', classification: 'premier-cru' as const },
  { name: 'Aux-Combottes', slug: 'aux-combottes', classification: 'premier-cru' as const },
  { name: 'Bel-Air', slug: 'bel-air', classification: 'premier-cru' as const },
  { name: 'Champonnet', slug: 'champonnet', classification: 'premier-cru' as const },
  { name: 'Cherbaudes', slug: 'cherbaudes', classification: 'premier-cru' as const },
  { name: 'Clos-des-Varoilles', slug: 'clos-des-varoilles', classification: 'premier-cru' as const },
  { name: 'Clos-du-Chapitre', slug: 'clos-du-chapitre', classification: 'premier-cru' as const },
  { name: 'Clos-Prieur', slug: 'clos-prieur', classification: 'premier-cru' as const },
  { name: 'Clos-Saint-Jacques', slug: 'clos-saint-jacques', classification: 'premier-cru' as const },
  { name: 'Combe-Au-Moine', slug: 'combe-au-moine', classification: 'premier-cru' as const },
  { name: 'Craipillot', slug: 'craipillot', classification: 'premier-cru' as const },
  { name: 'En-Ergot', slug: 'en-ergot', classification: 'premier-cru' as const },
  { name: 'Issarts', slug: 'issarts', classification: 'premier-cru' as const },
  { name: 'la-Bossiere', slug: 'la-bossiere', classification: 'premier-cru' as const },
  { name: 'la-Perriere', slug: 'la-perriere', classification: 'premier-cru' as const },
  { name: 'la-Romanee', slug: 'la-romanee', classification: 'premier-cru' as const },
  { name: 'Lavaut-Saint-Jacques', slug: 'lavaut-saint-jacques', classification: 'premier-cru' as const },
  { name: 'les-Cazetiers', slug: 'les-cazetiers', classification: 'premier-cru' as const },
  { name: 'les-Combottes', slug: 'les-combottes', classification: 'premier-cru' as const },
  { name: 'les-Corbeaux', slug: 'les-corbeaux', classification: 'premier-cru' as const },
  { name: 'les-Goulots', slug: 'les-goulots', classification: 'premier-cru' as const },
  { name: 'Petite-Chapelle', slug: 'petite-chapelle', classification: 'premier-cru' as const },
  { name: 'Petits-Cazetiers', slug: 'petits-cazetiers', classification: 'premier-cru' as const },
  { name: 'Chambertin-Clos-de-Beze', slug: 'chambertin-clos-de-beze', classification: 'grand-cru' as const },
  { name: 'Champeaux', slug: 'champeaux', classification: 'premier-cru' as const },
  { name: 'Estournelles-Saint-Jacques', slug: 'estournelles-saint-jacques', classification: 'premier-cru' as const },
  { name: 'Fonteny', slug: 'fonteny', classification: 'premier-cru' as const },  { name: 'Lavaux-Saint-Jacques', slug: 'lavaux-saint-jacques', classification: 'premier-cru' as const },
  { name: 'Poissenot', slug: 'poissenot', classification: 'premier-cru' as const },
] as const;

export default function GevreyChambertinPage() {
  return (
    <RegionLayout
      title="Gevrey-Chambertin"
      level="village"
      parentRegion="france/burgundy/cote-de-nuits"
      sidebarLinks={GEVREYCHAMBERTIN_VINEYARDS}
      contentFile="gevrey-chambertin-guide.md"
    />
  );
}
