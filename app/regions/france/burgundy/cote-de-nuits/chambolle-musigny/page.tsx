import RegionLayout from '@/components/RegionLayout';

const CHAMBOLLEMUSIGNY_VINEYARDS = [
  { name: 'Bonnes-Mares', slug: 'bonnes-mares', classification: 'grand-cru' as const },
  { name: 'Musigny', slug: 'musigny', classification: 'grand-cru' as const },
  { name: 'Aux-Beaux-Bruns', slug: 'aux-beaux-bruns', classification: 'premier-cru' as const },
  { name: 'Aux-Combottes', slug: 'aux-combottes', classification: 'premier-cru' as const },
  { name: 'Aux-Echanges', slug: 'aux-echanges', classification: 'premier-cru' as const },
  { name: 'Derriere-la-Grange', slug: 'derriere-la-grange', classification: 'premier-cru' as const },
  { name: 'la-Combe-D-Orveau', slug: 'la-combe-d-orveau', classification: 'premier-cru' as const },
  { name: 'la-Combe-Dorveau', slug: 'la-combe-dorveau', classification: 'premier-cru' as const },
  { name: 'les-Amoureuses', slug: 'les-amoureuses', classification: 'premier-cru' as const },
  { name: 'les-Baudes', slug: 'les-baudes', classification: 'premier-cru' as const },
  { name: 'les-Borniques', slug: 'les-borniques', classification: 'premier-cru' as const },
  { name: 'les-Carrieres', slug: 'les-carrieres', classification: 'premier-cru' as const },
  { name: 'les-Chabiots', slug: 'les-chabiots', classification: 'premier-cru' as const },
  { name: 'les-Charmes', slug: 'les-charmes', classification: 'premier-cru' as const },
  { name: 'les-Chatelots', slug: 'les-chatelots', classification: 'premier-cru' as const },
  { name: 'les-Combottes', slug: 'les-combottes', classification: 'premier-cru' as const },
  { name: 'les-Cras', slug: 'les-cras', classification: 'premier-cru' as const },
  { name: 'les-Feusselottes', slug: 'les-feusselottes', classification: 'premier-cru' as const },
  { name: 'les-Fuees', slug: 'les-fuees', classification: 'premier-cru' as const },
  { name: 'les-Grands-Murs', slug: 'les-grands-murs', classification: 'premier-cru' as const },
  { name: 'les-Groseilles', slug: 'les-groseilles', classification: 'premier-cru' as const },
  { name: 'les-Gruenchers', slug: 'les-gruenchers', classification: 'premier-cru' as const },
  { name: 'les-Hauts-Doix', slug: 'les-hauts-doix', classification: 'premier-cru' as const },
  { name: 'les-Lavrottes', slug: 'les-lavrottes', classification: 'premier-cru' as const },
  { name: 'les-Noirots', slug: 'les-noirots', classification: 'premier-cru' as const },
  { name: 'les-Plantes', slug: 'les-plantes', classification: 'premier-cru' as const },
  { name: 'les-Sentiers', slug: 'les-sentiers', classification: 'premier-cru' as const },
  { name: 'les-Veroilles', slug: 'les-veroilles', classification: 'premier-cru' as const },
] as const;

export default function ChambolleMusignyPage() {
  return (
    <RegionLayout
      title="Chambolle-Musigny"
      level="village"
      parentRegion="france/burgundy/cote-de-nuits"
      sidebarLinks={CHAMBOLLEMUSIGNY_VINEYARDS}
      contentFile="chambolle-musigny-guide.md"
    />
  );
}
