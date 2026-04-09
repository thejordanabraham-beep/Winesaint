import RegionLayout from '@/components/RegionLayout';

const MUSCADET_CRUS = [
  {
    "name": "Champtoceaux",
    "slug": "champtoceaux",
    "classification": "cru-communal"
  },
  {
    "name": "Château-Thébaud",
    "slug": "chateau-thebaud",
    "classification": "cru-communal"
  },
  {
    "name": "Clisson",
    "slug": "clisson",
    "classification": "cru-communal"
  },
  {
    "name": "Gorges",
    "slug": "gorges",
    "classification": "cru-communal"
  },
  {
    "name": "Goulaine",
    "slug": "goulaine",
    "classification": "cru-communal"
  },
  {
    "name": "La Haye-Fouassière",
    "slug": "la-haye-fouassiere",
    "classification": "cru-communal"
  },
  {
    "name": "Le Pallet",
    "slug": "le-pallet",
    "classification": "cru-communal"
  },
  {
    "name": "Monnières-Saint-Fiacre",
    "slug": "monnieres-saint-fiacre",
    "classification": "cru-communal"
  },
  {
    "name": "Mouzillon-Tillières",
    "slug": "mouzillon-tillieres",
    "classification": "cru-communal"
  },
  {
    "name": "Vallet",
    "slug": "vallet",
    "classification": "cru-communal"
  }
] as const;

export default function MuscadetPage() {
  return (
    <RegionLayout
      title="Muscadet"
      level="sub-region"
      parentRegion="france/loire"
      sidebarLinks={MUSCADET_CRUS}
      contentFile="muscadet-guide.md"
    />
  );
}
