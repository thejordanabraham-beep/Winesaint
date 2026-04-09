import RegionLayout from '@/components/RegionLayout';

const TREISO_MGAS = [
  {
    "name": "Balluri",
    "slug": "balluri",
    "classification": "mga"
  },
  {
    "name": "Bernardot",
    "slug": "bernardot",
    "classification": "mga"
  },
  {
    "name": "Bricco di Treiso",
    "slug": "bricco-di-treiso",
    "classification": "mga"
  },
  {
    "name": "Casot",
    "slug": "casot",
    "classification": "mga"
  },
  {
    "name": "Castellizzano",
    "slug": "castellizzano",
    "classification": "mga"
  },
  {
    "name": "Marcarini",
    "slug": "marcarini",
    "classification": "mga"
  },
  {
    "name": "Meruzzano",
    "slug": "meruzzano",
    "classification": "mga"
  },
  {
    "name": "Nervo",
    "slug": "nervo",
    "classification": "mga"
  },
  {
    "name": "Pajorè",
    "slug": "pajore",
    "classification": "mga"
  },
  {
    "name": "Rizzi",
    "slug": "rizzi",
    "classification": "mga"
  },
  {
    "name": "Rombone",
    "slug": "rombone",
    "classification": "mga"
  },
  {
    "name": "Roncaglie",
    "slug": "roncaglie",
    "classification": "mga"
  },
  {
    "name": "Serracapelli",
    "slug": "serracapelli",
    "classification": "mga"
  },
  {
    "name": "Vallegrande",
    "slug": "vallegrande",
    "classification": "mga"
  }
] as const;

export default function TreisoPage() {
  return (
    <RegionLayout
      title="Treiso"
      level="village"
      parentRegion="italy/piedmont/barbaresco"
      sidebarLinks={TREISO_MGAS}
      contentFile="treiso-guide.md"
    />
  );
}
