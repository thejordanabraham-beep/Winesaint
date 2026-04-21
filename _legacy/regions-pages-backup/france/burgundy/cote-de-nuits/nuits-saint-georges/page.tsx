import RegionLayout from '@/components/RegionLayout';

const NUITS_SAINT_GEORGES_VINEYARDS = [
  {
    "name": "Aux Argillas",
    "slug": "aux-argillas",
    "classification": "premier-cru"
  },
  {
    "name": "Aux Boudots",
    "slug": "aux-boudots",
    "classification": "premier-cru"
  },
  {
    "name": "Aux Bousselots",
    "slug": "aux-bousselots",
    "classification": "premier-cru"
  },
  {
    "name": "Aux Chaignots",
    "slug": "aux-chaignots",
    "classification": "premier-cru"
  },
  {
    "name": "Aux Champs Perdrix",
    "slug": "aux-champs-perdrix",
    "classification": "premier-cru"
  },
  {
    "name": "Aux Cras",
    "slug": "aux-cras",
    "classification": "premier-cru"
  },
  {
    "name": "Aux Murgers",
    "slug": "aux-murgers",
    "classification": "premier-cru"
  },
  {
    "name": "Aux Perdrix",
    "slug": "aux-perdrix",
    "classification": "premier-cru"
  },
  {
    "name": "Aux Thorey",
    "slug": "aux-thorey",
    "classification": "premier-cru"
  },
  {
    "name": "Aux Vignerondes",
    "slug": "aux-vignerondes",
    "classification": "premier-cru"
  },
  {
    "name": "Chaines Carteaux",
    "slug": "chaines-carteaux",
    "classification": "premier-cru"
  },
  {
    "name": "Château Gris",
    "slug": "chateau-gris",
    "classification": "premier-cru"
  },
  {
    "name": "Clos Arlot",
    "slug": "clos-arlot",
    "classification": "premier-cru"
  },
  {
    "name": "Clos de la Maréchale",
    "slug": "clos-de-la-marechale",
    "classification": "premier-cru"
  },
  {
    "name": "Clos des Argillières",
    "slug": "clos-des-argillieres",
    "classification": "premier-cru"
  },
  {
    "name": "Clos des Corvées",
    "slug": "clos-des-corvees",
    "classification": "premier-cru"
  },
  {
    "name": "Clos des Corvées Pagets",
    "slug": "clos-des-corvees-pagets",
    "classification": "premier-cru"
  },
  {
    "name": "Clos des Forêts Saint-Georges",
    "slug": "clos-des-forets-saint-georges",
    "classification": "premier-cru"
  },
  {
    "name": "Clos des Grandes Vignes",
    "slug": "clos-des-grandes-vignes",
    "classification": "premier-cru"
  },
  {
    "name": "Clos des Porrets-Saint-Georges",
    "slug": "clos-des-porrets-saint-georges",
    "classification": "premier-cru"
  },
  {
    "name": "Clos Saint-Marc",
    "slug": "clos-saint-marc",
    "classification": "premier-cru"
  },
  {
    "name": "En la Perrière Noblot",
    "slug": "en-la-perriere-noblot",
    "classification": "premier-cru"
  },
  {
    "name": "La Richemone",
    "slug": "la-richemone",
    "classification": "premier-cru"
  },
  {
    "name": "Les Argillières",
    "slug": "les-argillieres",
    "classification": "premier-cru"
  },
  {
    "name": "Les Cailles",
    "slug": "les-cailles",
    "classification": "premier-cru"
  },
  {
    "name": "Les Chaboeufs",
    "slug": "les-chaboeufs",
    "classification": "premier-cru"
  },
  {
    "name": "Les Crots",
    "slug": "les-crots",
    "classification": "premier-cru"
  },
  {
    "name": "Les Damodes",
    "slug": "les-damodes",
    "classification": "premier-cru"
  },
  {
    "name": "Les Didiers",
    "slug": "les-didiers",
    "classification": "premier-cru"
  },
  {
    "name": "Les Hauts Pruliers",
    "slug": "les-hauts-pruliers",
    "classification": "premier-cru"
  },
  {
    "name": "Les Perrières",
    "slug": "les-perrieres",
    "classification": "premier-cru"
  },
  {
    "name": "Les Porrets-Saint-Georges",
    "slug": "les-porrets-saint-georges",
    "classification": "premier-cru"
  },
  {
    "name": "Les Poulettes",
    "slug": "les-poulettes",
    "classification": "premier-cru"
  },
  {
    "name": "Les Procès",
    "slug": "les-proces",
    "classification": "premier-cru"
  },
  {
    "name": "Les Pruliers",
    "slug": "les-pruliers",
    "classification": "premier-cru"
  },
  {
    "name": "Les Saints-Georges",
    "slug": "les-saints-georges",
    "classification": "premier-cru"
  },
  {
    "name": "Les Terres Blanches",
    "slug": "les-terres-blanches",
    "classification": "premier-cru"
  },
  {
    "name": "Les Vallerots",
    "slug": "les-vallerots",
    "classification": "premier-cru"
  },
  {
    "name": "Les Vaucrains",
    "slug": "les-vaucrains",
    "classification": "premier-cru"
  },
  {
    "name": "Roncière",
    "slug": "ronciere",
    "classification": "premier-cru"
  },
  {
    "name": "Rue de Chaux",
    "slug": "rue-de-chaux",
    "classification": "premier-cru"
  }
] as const;

export default function NuitsSaintGeorgesPage() {
  return (
    <RegionLayout
      title="Nuits-Saint-Georges"
      level="village"
      parentRegion="france/burgundy/cote-de-nuits"
      sidebarLinks={NUITS_SAINT_GEORGES_VINEYARDS}
      contentFile="nuits-saint-georges-guide.md"
    />
  );
}
