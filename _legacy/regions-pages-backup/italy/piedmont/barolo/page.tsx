import RegionLayout from '@/components/RegionLayout';

const BAROLO_COMMUNES = [
  {
    "name": "Barolo",
    "slug": "barolo"
  },
  {
    "name": "Castiglione Falletto",
    "slug": "castiglione-falletto"
  },
  {
    "name": "Diano d'Alba",
    "slug": "diano-d-alba"
  },
  {
    "name": "Grinzane Cavour",
    "slug": "grinzane-cavour"
  },
  {
    "name": "La Morra",
    "slug": "la-morra"
  },
  {
    "name": "Monforte d'Alba",
    "slug": "monforte-d-alba"
  },
  {
    "name": "Novello",
    "slug": "novello"
  },
  {
    "name": "Roddi",
    "slug": "roddi"
  },
  {
    "name": "Serralunga d'Alba",
    "slug": "serralunga-d-alba"
  },
  {
    "name": "Verduno",
    "slug": "verduno"
  }
] as const;

export default function BaroloPage() {
  return (
    <RegionLayout
      title="Barolo"
      level="sub-region"
      parentRegion="italy/piedmont"
      sidebarLinks={BAROLO_COMMUNES}
      contentFile="barolo-guide.md"
    />
  );
}
