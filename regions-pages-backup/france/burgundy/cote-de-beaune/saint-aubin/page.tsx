import RegionLayout from '@/components/RegionLayout';

const SAINT_AUBIN_VINEYARDS = [
  {
    "name": "Bas de Vermarain à l'Est",
    "slug": "bas-de-vermarain-a-l-est",
    "classification": "premier-cru"
  },
  {
    "name": "Derrière Chez Edouard",
    "slug": "derriere-chez-edouard",
    "classification": "premier-cru"
  },
  {
    "name": "Derrière la Tour",
    "slug": "derriere-la-tour",
    "classification": "premier-cru"
  },
  {
    "name": "Echaille",
    "slug": "echaille",
    "classification": "premier-cru"
  },
  {
    "name": "En Créot",
    "slug": "en-creot",
    "classification": "premier-cru"
  },
  {
    "name": "En la Ranché",
    "slug": "en-la-ranche",
    "classification": "premier-cru"
  },
  {
    "name": "En Montceau",
    "slug": "en-montceau",
    "classification": "premier-cru"
  },
  {
    "name": "En Remilly",
    "slug": "en-remilly",
    "classification": "premier-cru"
  },
  {
    "name": "En Vollon à l'Est",
    "slug": "en-vollon-a-l-est",
    "classification": "premier-cru"
  },
  {
    "name": "Es Champs",
    "slug": "es-champs",
    "classification": "premier-cru"
  },
  {
    "name": "La Chatenière",
    "slug": "la-chateniere",
    "classification": "premier-cru"
  },
  {
    "name": "Le Bas de Gamay à l'Est",
    "slug": "le-bas-de-gamay-a-l-est",
    "classification": "premier-cru"
  },
  {
    "name": "Le Charmois",
    "slug": "le-charmois",
    "classification": "premier-cru"
  },
  {
    "name": "Le Puits",
    "slug": "le-puits",
    "classification": "premier-cru"
  },
  {
    "name": "Les Castets",
    "slug": "les-castets",
    "classification": "premier-cru"
  },
  {
    "name": "Les Champlots",
    "slug": "les-champlots",
    "classification": "premier-cru"
  },
  {
    "name": "Les Combes",
    "slug": "les-combes",
    "classification": "premier-cru"
  },
  {
    "name": "Les Combes au Sud",
    "slug": "les-combes-au-sud",
    "classification": "premier-cru"
  },
  {
    "name": "Les Cortons",
    "slug": "les-cortons",
    "classification": "premier-cru"
  },
  {
    "name": "Les Frionnes",
    "slug": "les-frionnes",
    "classification": "premier-cru"
  }
] as const;

export default function SaintAubinPage() {
  return (
    <RegionLayout
      title="Saint-Aubin"
      level="village"
      parentRegion="france/burgundy/cote-de-beaune"
      sidebarLinks={SAINT_AUBIN_VINEYARDS}
      contentFile="saint-aubin-guide.md"
    />
  );
}
