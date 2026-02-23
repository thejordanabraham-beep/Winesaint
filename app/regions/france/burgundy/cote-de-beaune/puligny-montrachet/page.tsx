import RegionLayout from '@/components/RegionLayout';

const PULIGNY_MONTRACHET_VINEYARDS = [
  {
    "name": "Bâtard-Montrachet",
    "slug": "batard-montrachet",
    "classification": "grand-cru"
  },
  {
    "name": "Bienvenues-Bâtard-Montrachet",
    "slug": "bienvenues-batard-montrachet",
    "classification": "grand-cru"
  },
  {
    "name": "Chevalier-Montrachet",
    "slug": "chevalier-montrachet",
    "classification": "grand-cru"
  },
  {
    "name": "Montrachet",
    "slug": "montrachet",
    "classification": "grand-cru"
  },
  {
    "name": "Au Chaniot",
    "slug": "au-chaniot",
    "classification": "premier-cru"
  },
  {
    "name": "Champ Canet",
    "slug": "champ-canet",
    "classification": "premier-cru"
  },
  {
    "name": "Champ Gain",
    "slug": "champ-gain",
    "classification": "premier-cru"
  },
  {
    "name": "Clavoillon",
    "slug": "clavoillon",
    "classification": "premier-cru"
  },
  {
    "name": "Clos de la Garenne",
    "slug": "clos-de-la-garenne",
    "classification": "premier-cru"
  },
  {
    "name": "Clos de la Mouchère",
    "slug": "clos-de-la-mouchere",
    "classification": "premier-cru"
  },
  {
    "name": "Clos des Meix",
    "slug": "clos-des-meix",
    "classification": "premier-cru"
  },
  {
    "name": "Hameau de Blagny",
    "slug": "hameau-de-blagny",
    "classification": "premier-cru"
  },
  {
    "name": "La Garenne",
    "slug": "la-garenne",
    "classification": "premier-cru"
  },
  {
    "name": "La Truffière",
    "slug": "la-truffiere",
    "classification": "premier-cru"
  },
  {
    "name": "Le Cailleret",
    "slug": "le-cailleret",
    "classification": "premier-cru"
  },
  {
    "name": "Les Chalumeaux",
    "slug": "les-chalumeaux",
    "classification": "premier-cru"
  },
  {
    "name": "Les Combettes",
    "slug": "les-combettes",
    "classification": "premier-cru"
  },
  {
    "name": "Les Demoiselles",
    "slug": "les-demoiselles",
    "classification": "premier-cru"
  },
  {
    "name": "Les Folatières",
    "slug": "les-folatieres",
    "classification": "premier-cru"
  },
  {
    "name": "Les Perrières",
    "slug": "les-perrieres",
    "classification": "premier-cru"
  },
  {
    "name": "Les Pucelles",
    "slug": "les-pucelles",
    "classification": "premier-cru"
  },
  {
    "name": "Les Referts",
    "slug": "les-referts",
    "classification": "premier-cru"
  },
  {
    "name": "Peux Bois",
    "slug": "peux-bois",
    "classification": "premier-cru"
  },
  {
    "name": "Sous le Puits",
    "slug": "sous-le-puits",
    "classification": "premier-cru"
  }
] as const;

export default function PulignyMontrachetPage() {
  return (
    <RegionLayout
      title="Puligny-Montrachet"
      level="village"
      parentRegion="france/burgundy/cote-de-beaune"
      sidebarLinks={PULIGNY_MONTRACHET_VINEYARDS}
      contentFile="puligny-montrachet-guide.md"
    />
  );
}
