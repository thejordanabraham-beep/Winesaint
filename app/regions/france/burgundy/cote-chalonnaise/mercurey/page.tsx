import RegionLayout from '@/components/RegionLayout';

const MERCUREY_VINEYARDS = [
  { name: 'Clos-Chateau-de-Montaigu', slug: 'clos-chateau-de-montaigu', classification: 'premier-cru' as const },
  { name: 'Clos-des-Barraults', slug: 'clos-des-barraults', classification: 'premier-cru' as const },
  { name: 'Clos-des-Grands-Voyens', slug: 'clos-des-grands-voyens', classification: 'premier-cru' as const },
  { name: 'Clos-des-Montaigus', slug: 'clos-des-montaigus', classification: 'premier-cru' as const },
  { name: 'Clos-des-Myglands', slug: 'clos-des-myglands', classification: 'premier-cru' as const },
  { name: 'Clos-Marcilly', slug: 'clos-marcilly', classification: 'premier-cru' as const },
  { name: 'Clos-Tonnerre', slug: 'clos-tonnerre', classification: 'premier-cru' as const },
  { name: 'Clos-Voyens', slug: 'clos-voyens', classification: 'premier-cru' as const },
  { name: 'Grand-Clos-Fortoul', slug: 'grand-clos-fortoul', classification: 'premier-cru' as const },
  { name: 'Grifferes', slug: 'grifferes', classification: 'premier-cru' as const },
  { name: 'la-Bondue', slug: 'la-bondue', classification: 'premier-cru' as const },
  { name: 'la-Cailloute', slug: 'la-cailloute', classification: 'premier-cru' as const },
  { name: 'la-Chassiere', slug: 'la-chassiere', classification: 'premier-cru' as const },
  { name: 'la-Levriere', slug: 'la-levriere', classification: 'premier-cru' as const },
  { name: 'la-Mission', slug: 'la-mission', classification: 'premier-cru' as const },
  { name: 'le-Clos-du-Roy', slug: 'le-clos-du-roy', classification: 'premier-cru' as const },
  { name: 'le-Clos-L-Eveque', slug: 'le-clos-l-eveque', classification: 'premier-cru' as const },
  { name: 'les-Byots', slug: 'les-byots', classification: 'premier-cru' as const },
  { name: 'les-Champs-Martin', slug: 'les-champs-martin', classification: 'premier-cru' as const },
  { name: 'les-Combins', slug: 'les-combins', classification: 'premier-cru' as const },
  { name: 'les-Crets', slug: 'les-crets', classification: 'premier-cru' as const },
  { name: 'les-Croichots', slug: 'les-croichots', classification: 'premier-cru' as const },
  { name: 'les-Fourneaux', slug: 'les-fourneaux', classification: 'premier-cru' as const },
  { name: 'les-Montaigus', slug: 'les-montaigus', classification: 'premier-cru' as const },
  { name: 'les-Naugues', slug: 'les-naugues', classification: 'premier-cru' as const },
  { name: 'les-Puillets', slug: 'les-puillets', classification: 'premier-cru' as const },
  { name: 'les-Ruelles', slug: 'les-ruelles', classification: 'premier-cru' as const },
  { name: 'les-Saumonts', slug: 'les-saumonts', classification: 'premier-cru' as const },
  { name: 'les-Vasees', slug: 'les-vasees', classification: 'premier-cru' as const },
  { name: 'les-Velley', slug: 'les-velley', classification: 'premier-cru' as const },
  { name: 'les-Vignes-de-Maillonges', slug: 'les-vignes-de-maillonges', classification: 'premier-cru' as const },
  { name: 'Sazenay', slug: 'sazenay', classification: 'premier-cru' as const },
] as const;

export default function MercureyPage() {
  return (
    <RegionLayout
      title="Mercurey"
      level="village"
      parentRegion="france/burgundy/cote-chalonnaise"
      sidebarLinks={MERCUREY_VINEYARDS}
      contentFile="mercurey-guide.md"
    />
  );
}
