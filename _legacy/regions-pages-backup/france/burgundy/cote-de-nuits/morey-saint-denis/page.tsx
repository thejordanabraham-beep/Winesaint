import RegionLayout from '@/components/RegionLayout';

const MOREYSAINTDENIS_VINEYARDS = [
  { name: 'Clos-de-la-Roche', slug: 'clos-de-la-roche', classification: 'grand-cru' as const },
  { name: 'Clos-de-Tart', slug: 'clos-de-tart', classification: 'grand-cru' as const },
  { name: 'Clos-des-Lambrays', slug: 'clos-des-lambrays', classification: 'grand-cru' as const },
  { name: 'Clos-Saint-Denis', slug: 'clos-saint-denis', classification: 'grand-cru' as const },
  { name: 'Aux-Charmes', slug: 'aux-charmes', classification: 'premier-cru' as const },
  { name: 'Aux-Cheseaux', slug: 'aux-cheseaux', classification: 'premier-cru' as const },
  { name: 'Clos-Baulet', slug: 'clos-baulet', classification: 'premier-cru' as const },
  { name: 'Clos-des-Ormes', slug: 'clos-des-ormes', classification: 'premier-cru' as const },
  { name: 'Clos-Sorbe', slug: 'clos-sorbe', classification: 'premier-cru' as const },
  { name: 'Cote-Rotie', slug: 'cote-rotie', classification: 'premier-cru' as const },
  { name: 'la-Bussiere', slug: 'la-bussiere', classification: 'premier-cru' as const },
  { name: 'le-Village', slug: 'le-village', classification: 'premier-cru' as const },
  { name: 'les-Blanchards', slug: 'les-blanchards', classification: 'premier-cru' as const },
  { name: 'les-Chaffots', slug: 'les-chaffots', classification: 'premier-cru' as const },
  { name: 'les-Charrieres', slug: 'les-charrieres', classification: 'premier-cru' as const },
  { name: 'les-Chenevery', slug: 'les-chenevery', classification: 'premier-cru' as const },
  { name: 'les-Faconnieres', slug: 'les-faconnieres', classification: 'premier-cru' as const },
  { name: 'les-Genavrieres', slug: 'les-genavrieres', classification: 'premier-cru' as const },
  { name: 'les-Gruenchers', slug: 'les-gruenchers', classification: 'premier-cru' as const },
  { name: 'les-Millandes', slug: 'les-millandes', classification: 'premier-cru' as const },
  { name: 'les-Monts-Luisants', slug: 'les-monts-luisants', classification: 'premier-cru' as const },
  { name: 'les-Ruchots', slug: 'les-ruchots', classification: 'premier-cru' as const },
  { name: 'les-Sorbes', slug: 'les-sorbes', classification: 'premier-cru' as const },
  { name: 'Monts-Luisants', slug: 'monts-luisants', classification: 'premier-cru' as const },] as const;

export default function MoreySaintDenisPage() {
  return (
    <RegionLayout
      title="Morey-Saint-Denis"
      level="village"
      parentRegion="france/burgundy/cote-de-nuits"
      sidebarLinks={MOREYSAINTDENIS_VINEYARDS}
      contentFile="morey-saint-denis-guide.md"
    />
  );
}
