import RegionLayout from '@/components/RegionLayout';

const LA_MORRA_MGAS = [
  {
    "name": "Annunziata",
    "slug": "annunziata",
    "classification": "mga"
  },
  {
    "name": "Arborina",
    "slug": "arborina",
    "classification": "mga"
  },
  {
    "name": "Bergera-Pezzole",
    "slug": "bergera-pezzole",
    "classification": "mga"
  },
  {
    "name": "Bettolotti",
    "slug": "bettolotti",
    "classification": "mga"
  },
  {
    "name": "Borzone",
    "slug": "borzone",
    "classification": "mga"
  },
  {
    "name": "Bricco Chiesa",
    "slug": "bricco-chiesa",
    "classification": "mga"
  },
  {
    "name": "Bricco Luciani",
    "slug": "bricco-luciani",
    "classification": "mga"
  },
  {
    "name": "Bricco Rocca",
    "slug": "bricco-rocca",
    "classification": "mga"
  },
  {
    "name": "Bricco Voghera",
    "slug": "bricco-voghera",
    "classification": "mga"
  },
  {
    "name": "Broglio",
    "slug": "broglio",
    "classification": "mga"
  },
  {
    "name": "Brunate",
    "slug": "brunate",
    "classification": "mga"
  },
  {
    "name": "Campasso",
    "slug": "campasso",
    "classification": "mga"
  },
  {
    "name": "Canova",
    "slug": "canova",
    "classification": "mga"
  },
  {
    "name": "Capalot",
    "slug": "capalot",
    "classification": "mga"
  },
  {
    "name": "Carpegna",
    "slug": "carpegna",
    "classification": "mga"
  },
  {
    "name": "Castagni",
    "slug": "castagni",
    "classification": "mga"
  },
  {
    "name": "Cerequio",
    "slug": "cerequio",
    "classification": "mga"
  },
  {
    "name": "Cerrati",
    "slug": "cerrati",
    "classification": "mga"
  },
  {
    "name": "Collaretto",
    "slug": "collaretto",
    "classification": "mga"
  },
  {
    "name": "Colombaro",
    "slug": "colombaro",
    "classification": "mga"
  },
  {
    "name": "Conca",
    "slug": "conca",
    "classification": "mga"
  },
  {
    "name": "Costabella",
    "slug": "costabella",
    "classification": "mga"
  },
  {
    "name": "Crosia",
    "slug": "crosia",
    "classification": "mga"
  },
  {
    "name": "Damiano",
    "slug": "damiano",
    "classification": "mga"
  },
  {
    "name": "Fossati",
    "slug": "fossati",
    "classification": "mga"
  },
  {
    "name": "Fossato",
    "slug": "fossato",
    "classification": "mga"
  },
  {
    "name": "Galina",
    "slug": "galina",
    "classification": "mga"
  },
  {
    "name": "Garretti",
    "slug": "garretti",
    "classification": "mga"
  },
  {
    "name": "Gattera",
    "slug": "gattera",
    "classification": "mga"
  },
  {
    "name": "Giachini",
    "slug": "giachini",
    "classification": "mga"
  },
  {
    "name": "La Corte",
    "slug": "la-corte",
    "classification": "mga"
  },
  {
    "name": "La Serra",
    "slug": "la-serra",
    "classification": "mga"
  },
  {
    "name": "Le Coste",
    "slug": "le-coste",
    "classification": "mga"
  },
  {
    "name": "Manocino",
    "slug": "manocino",
    "classification": "mga"
  },
  {
    "name": "Meriame",
    "slug": "meriame",
    "classification": "mga"
  },
  {
    "name": "Paiagallo",
    "slug": "paiagallo",
    "classification": "mga"
  },
  {
    "name": "Pernanno",
    "slug": "pernanno",
    "classification": "mga"
  },
  {
    "name": "Pisapola",
    "slug": "pisapola",
    "classification": "mga"
  },
  {
    "name": "Prabon",
    "slug": "prabon",
    "classification": "mga"
  },
  {
    "name": "Preda",
    "slug": "preda",
    "classification": "mga"
  },
  {
    "name": "Rivette",
    "slug": "rivette",
    "classification": "mga"
  },
  {
    "name": "Rocche dell'Annunziata",
    "slug": "rocche-dell-annunziata",
    "classification": "mga"
  },
  {
    "name": "Rocche dell'Olmo",
    "slug": "rocche-dell-olmo",
    "classification": "mga"
  },
  {
    "name": "Rocchettevino",
    "slug": "rocchettevino",
    "classification": "mga"
  },
  {
    "name": "Rodasca",
    "slug": "rodasca",
    "classification": "mga"
  },
  {
    "name": "Roere di Santa Maria",
    "slug": "roere-di-santa-maria",
    "classification": "mga"
  },
  {
    "name": "Roncaglie",
    "slug": "roncaglie",
    "classification": "mga"
  },
  {
    "name": "San Bernardo",
    "slug": "san-bernardo",
    "classification": "mga"
  },
  {
    "name": "San Giacomo",
    "slug": "san-giacomo",
    "classification": "mga"
  },
  {
    "name": "San Pietro",
    "slug": "san-pietro",
    "classification": "mga"
  },
  {
    "name": "San Rocco",
    "slug": "san-rocco",
    "classification": "mga"
  },
  {
    "name": "Sant'Anna",
    "slug": "sant-anna",
    "classification": "mga"
  },
  {
    "name": "Santa Maria",
    "slug": "santa-maria",
    "classification": "mga"
  },
  {
    "name": "Serra",
    "slug": "serra",
    "classification": "mga"
  },
  {
    "name": "Torriglione",
    "slug": "torriglione",
    "classification": "mga"
  },
  {
    "name": "Vignane",
    "slug": "vignane",
    "classification": "mga"
  },
  {
    "name": "Zonchetta",
    "slug": "zonchetta",
    "classification": "mga"
  }
] as const;

export default function LaMorraPage() {
  return (
    <RegionLayout
      title="La Morra"
      level="village"
      parentRegion="italy/piedmont/barolo"
      sidebarLinks={LA_MORRA_MGAS}
      contentFile="la-morra-guide.md"
    />
  );
}
