import RegionLayout from '@/components/RegionLayout';

const BARBARESCO_MGAS = [
  {
    "name": "Asili",
    "slug": "asili",
    "classification": "mga"
  },
  {
    "name": "Ausario",
    "slug": "ausario",
    "classification": "mga"
  },
  {
    "name": "Cà Grossa",
    "slug": "ca-grossa",
    "classification": "mga"
  },
  {
    "name": "Canova",
    "slug": "canova",
    "classification": "mga"
  },
  {
    "name": "Cars",
    "slug": "cars",
    "classification": "mga"
  },
  {
    "name": "Cavanna",
    "slug": "cavanna",
    "classification": "mga"
  },
  {
    "name": "Cole",
    "slug": "cole",
    "classification": "mga"
  },
  {
    "name": "Faset",
    "slug": "faset",
    "classification": "mga"
  },
  {
    "name": "Ferrere",
    "slug": "ferrere",
    "classification": "mga"
  },
  {
    "name": "Gaia-Principe",
    "slug": "gaia-principe",
    "classification": "mga"
  },
  {
    "name": "Garassino",
    "slug": "garassino",
    "classification": "mga"
  },
  {
    "name": "Giacone",
    "slug": "giacone",
    "classification": "mga"
  },
  {
    "name": "Giacosa",
    "slug": "giacosa",
    "classification": "mga"
  },
  {
    "name": "Marcorino",
    "slug": "marcorino",
    "classification": "mga"
  },
  {
    "name": "Martinenga",
    "slug": "martinenga",
    "classification": "mga"
  },
  {
    "name": "Montaribaldi",
    "slug": "montaribaldi",
    "classification": "mga"
  },
  {
    "name": "Montefico",
    "slug": "montefico",
    "classification": "mga"
  },
  {
    "name": "Montestefano",
    "slug": "montestefano",
    "classification": "mga"
  },
  {
    "name": "Muncagota",
    "slug": "muncagota",
    "classification": "mga"
  },
  {
    "name": "Ovello",
    "slug": "ovello",
    "classification": "mga"
  },
  {
    "name": "Pajè",
    "slug": "paje",
    "classification": "mga"
  },
  {
    "name": "Pora",
    "slug": "pora",
    "classification": "mga"
  },
  {
    "name": "Rabajà",
    "slug": "rabaja",
    "classification": "mga"
  },
  {
    "name": "Rabajà-bas",
    "slug": "rabaja-bas",
    "classification": "mga"
  },
  {
    "name": "Rio Sordo",
    "slug": "rio-sordo",
    "classification": "mga"
  },
  {
    "name": "Rivetti",
    "slug": "rivetti",
    "classification": "mga"
  },
  {
    "name": "Roccalini",
    "slug": "roccalini",
    "classification": "mga"
  },
  {
    "name": "Roncagliette",
    "slug": "roncagliette",
    "classification": "mga"
  },
  {
    "name": "Ronchi",
    "slug": "ronchi",
    "classification": "mga"
  },
  {
    "name": "San Cristoforo",
    "slug": "san-cristoforo",
    "classification": "mga"
  },
  {
    "name": "Secondine",
    "slug": "secondine",
    "classification": "mga"
  },
  {
    "name": "Serragrilli",
    "slug": "serragrilli",
    "classification": "mga"
  },
  {
    "name": "Tre Stelle",
    "slug": "tre-stelle",
    "classification": "mga"
  },
  {
    "name": "Trifolera",
    "slug": "trifolera",
    "classification": "mga"
  },
  {
    "name": "Valeirano",
    "slug": "valeirano",
    "classification": "mga"
  },
  {
    "name": "Vicenziana",
    "slug": "vicenziana",
    "classification": "mga"
  }
] as const;

export default function BarbarescoPage() {
  return (
    <RegionLayout
      title="Barbaresco"
      level="village"
      parentRegion="italy/piedmont/barbaresco"
      sidebarLinks={BARBARESCO_MGAS}
      contentFile="barbaresco-guide.md"
    />
  );
}
