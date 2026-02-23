import RegionLayout from '@/components/RegionLayout';

const WACHAU_VINEYARDS = [
  {
    "name": "Achleiten",
    "slug": "achleiten",
    "classification": "rieda"
  },
  {
    "name": "Loibenberg",
    "slug": "loibenberg",
    "classification": "rieda"
  },
  {
    "name": "Kellerberg",
    "slug": "kellerberg",
    "classification": "rieda"
  },
  {
    "name": "Klaus",
    "slug": "klaus",
    "classification": "rieda"
  },
  {
    "name": "Singerriedel",
    "slug": "singerriedel",
    "classification": "rieda"
  },
  {
    "name": "Steinriegl",
    "slug": "steinriegl",
    "classification": "rieda"
  },
  {
    "name": "Schlossberg",
    "slug": "schlossberg",
    "classification": "rieda"
  },
  {
    "name": "Kollmitz",
    "slug": "kollmitz",
    "classification": "rieda"
  },
  {
    "name": "Pichlpoint",
    "slug": "pichlpoint",
    "classification": "rieda"
  },
  {
    "name": "Ritzling",
    "slug": "ritzling",
    "classification": "rieda"
  },
  {
    "name": "1000-Eimerberg",
    "slug": "1000-eimerberg",
    "classification": "rieda"
  },
  {
    "name": "Atzberg",
    "slug": "atzberg",
    "classification": "rieda"
  },
  {
    "name": "Hochrain",
    "slug": "hochrain",
    "classification": "rieda"
  },
  {
    "name": "Kollmütz",
    "slug": "kollmutz",
    "classification": "rieda"
  },
  {
    "name": "Harzenleiten",
    "slug": "harzenleiten",
    "classification": "rieda"
  },
  {
    "name": "Axpoint",
    "slug": "axpoint",
    "classification": "rieda"
  },
  {
    "name": "Bruck",
    "slug": "bruck",
    "classification": "rieda"
  },
  {
    "name": "Hinterhaus",
    "slug": "hinterhaus",
    "classification": "rieda"
  },
  {
    "name": "Höhereck",
    "slug": "hohereck",
    "classification": "rieda"
  },
  {
    "name": "Kirchweg",
    "slug": "kirchweg",
    "classification": "rieda"
  },
  {
    "name": "Liebenberg",
    "slug": "liebenberg",
    "classification": "rieda"
  },
  {
    "name": "Offenberg",
    "slug": "offenberg",
    "classification": "rieda"
  },
  {
    "name": "Point",
    "slug": "point",
    "classification": "rieda"
  },
  {
    "name": "Schön",
    "slug": "schon",
    "classification": "rieda"
  },
  {
    "name": "Steinterrassen",
    "slug": "steinterrassen",
    "classification": "rieda"
  },
  {
    "name": "Tausendeimerberg",
    "slug": "tausendeimerberg",
    "classification": "rieda"
  },
  {
    "name": "Terrassen",
    "slug": "terrassen",
    "classification": "rieda"
  },
  {
    "name": "Unterloiben",
    "slug": "unterloiben",
    "classification": "rieda"
  },
  {
    "name": "Vorderseiber",
    "slug": "vorderseiber",
    "classification": "rieda"
  },
  {
    "name": "Zwerithaler",
    "slug": "zwerithaler",
    "classification": "rieda"
  },
  {
    "name": "Axberg",
    "slug": "axberg",
    "classification": "rieda"
  },
  {
    "name": "Frauengarten",
    "slug": "frauengarten",
    "classification": "rieda"
  },
  {
    "name": "Hollerin",
    "slug": "hollerin",
    "classification": "rieda"
  },
  {
    "name": "Kirnberg",
    "slug": "kirnberg",
    "classification": "rieda"
  },
  {
    "name": "Kreuzberg",
    "slug": "kreuzberg",
    "classification": "rieda"
  },
  {
    "name": "Kulm",
    "slug": "kulm",
    "classification": "rieda"
  },
  {
    "name": "Mühlpoint",
    "slug": "muhlpoint",
    "classification": "rieda"
  },
  {
    "name": "Obere Steigen",
    "slug": "obere-steigen",
    "classification": "rieda"
  },
  {
    "name": "Pfaffenberg",
    "slug": "pfaffenberg",
    "classification": "rieda"
  },
  {
    "name": "Weitenberg",
    "slug": "weitenberg",
    "classification": "rieda"
  },
  {
    "name": "Burgberg",
    "slug": "burgberg",
    "classification": "rieda"
  },
  {
    "name": "Vorder-Atzberg",
    "slug": "vorder-atzberg",
    "classification": "rieda"
  },
  {
    "name": "Loibenschenke",
    "slug": "loibenschenke",
    "classification": "rieda"
  },
  {
    "name": "Kammstein",
    "slug": "kammstein",
    "classification": "rieda"
  },
  {
    "name": "Dürrenberg",
    "slug": "durrenberg",
    "classification": "rieda"
  },
  {
    "name": "Steinbachberg",
    "slug": "steinbachberg",
    "classification": "rieda"
  },
  {
    "name": "Spitzerberg",
    "slug": "spitzerberg",
    "classification": "rieda"
  },
  {
    "name": "Maurachberg",
    "slug": "maurachberg",
    "classification": "rieda"
  },
  {
    "name": "Eichengarten",
    "slug": "eichengarten",
    "classification": "rieda"
  },
  {
    "name": "Schmeidberg",
    "slug": "schmeidberg",
    "classification": "rieda"
  },
  {
    "name": "Rauhenberg",
    "slug": "rauhenberg",
    "classification": "rieda"
  }
] as const;

export default function WachauPage() {
  return (
    <RegionLayout
      title="Wachau"
      level="region"
      parentRegion="austria"
      sidebarLinks={WACHAU_VINEYARDS}
      contentFile="wachau-guide.md"
    />
  );
}
