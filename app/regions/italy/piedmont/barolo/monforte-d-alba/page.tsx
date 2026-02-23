import RegionLayout from '@/components/RegionLayout';

const MONFORTE_D_ALBA_MGAS = [
  {
    "name": "Bricco Manescotto",
    "slug": "bricco-manescotto",
    "classification": "mga"
  },
  {
    "name": "Bricco Manzoni",
    "slug": "bricco-manzoni",
    "classification": "mga"
  },
  {
    "name": "Bricco San Biagio",
    "slug": "bricco-san-biagio",
    "classification": "mga"
  },
  {
    "name": "Bricco San Pietro",
    "slug": "bricco-san-pietro",
    "classification": "mga"
  },
  {
    "name": "Briccolina",
    "slug": "briccolina",
    "classification": "mga"
  },
  {
    "name": "Bussia",
    "slug": "bussia",
    "classification": "mga"
  },
  {
    "name": "Bussia Dardi Le Rose",
    "slug": "bussia-dardi-le-rose",
    "classification": "mga"
  },
  {
    "name": "Bussia Vigna Fantini",
    "slug": "bussia-vigna-fantini",
    "classification": "mga"
  },
  {
    "name": "Case Nere",
    "slug": "case-nere",
    "classification": "mga"
  },
  {
    "name": "Castelletto",
    "slug": "castelletto",
    "classification": "mga"
  },
  {
    "name": "Castelletto Persiera",
    "slug": "castelletto-persiera",
    "classification": "mga"
  },
  {
    "name": "Castelletto Vigna Pressenda",
    "slug": "castelletto-vigna-pressenda",
    "classification": "mga"
  },
  {
    "name": "Ginestra",
    "slug": "ginestra",
    "classification": "mga"
  },
  {
    "name": "Gramolere",
    "slug": "gramolere",
    "classification": "mga"
  },
  {
    "name": "Le Coste di Monforte",
    "slug": "le-coste-di-monforte",
    "classification": "mga"
  },
  {
    "name": "Monrobiolo di Bussia",
    "slug": "monrobiolo-di-bussia",
    "classification": "mga"
  },
  {
    "name": "Mosconi",
    "slug": "mosconi",
    "classification": "mga"
  },
  {
    "name": "Perno",
    "slug": "perno",
    "classification": "mga"
  },
  {
    "name": "Pressenda",
    "slug": "pressenda",
    "classification": "mga"
  },
  {
    "name": "Ravera di Monforte",
    "slug": "ravera-di-monforte",
    "classification": "mga"
  },
  {
    "name": "Rocche di Castelletto",
    "slug": "rocche-di-castelletto",
    "classification": "mga"
  },
  {
    "name": "San Giovanni",
    "slug": "san-giovanni",
    "classification": "mga"
  },
  {
    "name": "Vigna Sorì Ginestra",
    "slug": "vigna-sori-ginestra",
    "classification": "mga"
  }
] as const;

export default function MonfortedAlbaPage() {
  return (
    <RegionLayout
      title="Monforte d'Alba"
      level="village"
      parentRegion="italy/piedmont/barolo"
      sidebarLinks={MONFORTE_D_ALBA_MGAS}
      contentFile="monforte-d-alba-guide.md"
    />
  );
}
