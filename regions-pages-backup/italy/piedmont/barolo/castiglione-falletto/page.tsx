import RegionLayout from '@/components/RegionLayout';

const CASTIGLIONE_FALLETTO_MGAS = [
  {
    "name": "Altenasso",
    "slug": "altenasso",
    "classification": "mga"
  },
  {
    "name": "Berri",
    "slug": "berri",
    "classification": "mga"
  },
  {
    "name": "Bricco Rocche",
    "slug": "bricco-rocche",
    "classification": "mga"
  },
  {
    "name": "Brunella",
    "slug": "brunella",
    "classification": "mga"
  },
  {
    "name": "Ciocchini",
    "slug": "ciocchini",
    "classification": "mga"
  },
  {
    "name": "Ciocchini-Loschetto",
    "slug": "ciocchini-loschetto",
    "classification": "mga"
  },
  {
    "name": "Codana",
    "slug": "codana",
    "classification": "mga"
  },
  {
    "name": "Fiasco",
    "slug": "fiasco",
    "classification": "mga"
  },
  {
    "name": "Gianetto",
    "slug": "gianetto",
    "classification": "mga"
  },
  {
    "name": "Mantoetto",
    "slug": "mantoetto",
    "classification": "mga"
  },
  {
    "name": "Mariondino",
    "slug": "mariondino",
    "classification": "mga"
  },
  {
    "name": "Monprivato",
    "slug": "monprivato",
    "classification": "mga"
  },
  {
    "name": "Parussi",
    "slug": "parussi",
    "classification": "mga"
  },
  {
    "name": "Pira",
    "slug": "pira",
    "classification": "mga"
  },
  {
    "name": "Pugnane",
    "slug": "pugnane",
    "classification": "mga"
  },
  {
    "name": "Rocche di Castiglione",
    "slug": "rocche-di-castiglione",
    "classification": "mga"
  },
  {
    "name": "Scarrone",
    "slug": "scarrone",
    "classification": "mga"
  },
  {
    "name": "Villero",
    "slug": "villero",
    "classification": "mga"
  }
] as const;

export default function CastiglioneFallettoPage() {
  return (
    <RegionLayout
      title="Castiglione Falletto"
      level="village"
      parentRegion="italy/piedmont/barolo"
      sidebarLinks={CASTIGLIONE_FALLETTO_MGAS}
      contentFile="castiglione-falletto-guide.md"
    />
  );
}
