import RegionLayout from '@/components/RegionLayout';

const CHASSAGNE_MONTRACHET_VINEYARDS = [
  {
    "name": "Criots-Bâtard-Montrachet",
    "slug": "criots-batard-montrachet",
    "classification": "grand-cru"
  },
  {
    "name": "Abbaye de Morgeot",
    "slug": "abbaye-de-morgeot",
    "classification": "premier-cru"
  },
  {
    "name": "Blanchot Dessus",
    "slug": "blanchot-dessus",
    "classification": "premier-cru"
  },
  {
    "name": "Bois de Chassagne",
    "slug": "bois-de-chassagne",
    "classification": "premier-cru"
  },
  {
    "name": "Cailleret",
    "slug": "cailleret",
    "classification": "premier-cru"
  },
  {
    "name": "Champs Jendreau",
    "slug": "champs-jendreau",
    "classification": "premier-cru"
  },
  {
    "name": "Chassagne",
    "slug": "chassagne",
    "classification": "premier-cru"
  },
  {
    "name": "Clos de la Boudriotte",
    "slug": "clos-de-la-boudriotte",
    "classification": "premier-cru"
  },
  {
    "name": "Clos Saint-Jean",
    "slug": "clos-saint-jean",
    "classification": "premier-cru"
  },
  {
    "name": "Grande Montagne",
    "slug": "grande-montagne",
    "classification": "premier-cru"
  },
  {
    "name": "Grandes Ruchottes",
    "slug": "grandes-ruchottes",
    "classification": "premier-cru"
  },
  {
    "name": "La Boudriotte",
    "slug": "la-boudriotte",
    "classification": "premier-cru"
  },
  {
    "name": "La Chapelle",
    "slug": "la-chapelle",
    "classification": "premier-cru"
  },
  {
    "name": "La Grande Borne",
    "slug": "la-grande-borne",
    "classification": "premier-cru"
  },
  {
    "name": "La Maltroie",
    "slug": "la-maltroie",
    "classification": "premier-cru"
  },
  {
    "name": "La Romanée",
    "slug": "la-romanee",
    "classification": "premier-cru"
  },
  {
    "name": "Les Baudines",
    "slug": "les-baudines",
    "classification": "premier-cru"
  },
  {
    "name": "Les Caillerets",
    "slug": "les-caillerets",
    "classification": "premier-cru"
  },
  {
    "name": "Les Chaumées",
    "slug": "les-chaumees",
    "classification": "premier-cru"
  },
  {
    "name": "Les Chenevottes",
    "slug": "les-chenevottes",
    "classification": "premier-cru"
  },
  {
    "name": "Les Embrazées",
    "slug": "les-embrazees",
    "classification": "premier-cru"
  },
  {
    "name": "Les Macherelles",
    "slug": "les-macherelles",
    "classification": "premier-cru"
  },
  {
    "name": "Les Ruchottes",
    "slug": "les-ruchottes",
    "classification": "premier-cru"
  },
  {
    "name": "Les Ruchottes Chassagne",
    "slug": "les-ruchottes-chassagne",
    "classification": "village"
  },
  {
    "name": "Les Vergers",
    "slug": "les-vergers",
    "classification": "premier-cru"
  },
  {
    "name": "Morgeot",
    "slug": "morgeot",
    "classification": "premier-cru"
  }
] as const;

export default function ChassagneMontrachetPage() {
  return (
    <RegionLayout
      title="Chassagne-Montrachet"
      level="village"
      parentRegion="france/burgundy/cote-de-beaune"
      sidebarLinks={CHASSAGNE_MONTRACHET_VINEYARDS}
      contentFile="chassagne-montrachet-guide.md"
    />
  );
}
