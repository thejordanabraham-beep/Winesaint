import RegionLayout from '@/components/RegionLayout';

const BEAUNE_VINEYARDS = [
  { name: 'A-L-Ecu', slug: 'a-l-ecu', classification: 'premier-cru' as const },
  { name: 'Aux-Coucherias', slug: 'aux-coucherias', classification: 'premier-cru' as const },
  { name: 'Aux-Cras', slug: 'aux-cras', classification: 'premier-cru' as const },
  { name: 'Belissand', slug: 'belissand', classification: 'premier-cru' as const },
  { name: 'Blanches-Fleurs', slug: 'blanches-fleurs', classification: 'premier-cru' as const },
  { name: 'Champs-Pimont', slug: 'champs-pimont', classification: 'premier-cru' as const },
  { name: 'Clos-de-L-Ecu', slug: 'clos-de-l-ecu', classification: 'premier-cru' as const },
  { name: 'Clos-de-la-Feguine', slug: 'clos-de-la-feguine', classification: 'premier-cru' as const },
  { name: 'Clos-de-la-Mousse', slug: 'clos-de-la-mousse', classification: 'premier-cru' as const },
  { name: 'Clos-des-Avaux', slug: 'clos-des-avaux', classification: 'premier-cru' as const },
  { name: 'Clos-des-Mouches', slug: 'clos-des-mouches', classification: 'premier-cru' as const },
  { name: 'Clos-des-Ursules', slug: 'clos-des-ursules', classification: 'premier-cru' as const },
  { name: 'Clos-du-Roi', slug: 'clos-du-roi', classification: 'premier-cru' as const },
  { name: 'Clos-Saint-Landry', slug: 'clos-saint-landry', classification: 'premier-cru' as const },
  { name: 'En-Genet', slug: 'en-genet', classification: 'premier-cru' as const },
  { name: 'En-L-Orme', slug: 'en-l-orme', classification: 'premier-cru' as const },
  { name: 'la-Mignotte', slug: 'la-mignotte', classification: 'premier-cru' as const },
  { name: 'le-Bas-des-Teurons', slug: 'le-bas-des-teurons', classification: 'premier-cru' as const },
  { name: 'le-Clos-des-Mouches', slug: 'le-clos-des-mouches', classification: 'premier-cru' as const },
  { name: 'les-Aigrots', slug: 'les-aigrots', classification: 'premier-cru' as const },
  { name: 'les-Avaux', slug: 'les-avaux', classification: 'premier-cru' as const },
  { name: 'les-Boucherottes', slug: 'les-boucherottes', classification: 'premier-cru' as const },
  { name: 'les-Bressandes', slug: 'les-bressandes', classification: 'premier-cru' as const },
  { name: 'les-Cent-Vignes', slug: 'les-cent-vignes', classification: 'premier-cru' as const },
  { name: 'les-Cents-Vignes', slug: 'les-cents-vignes', classification: 'premier-cru' as const },
  { name: 'les-Chouacheux', slug: 'les-chouacheux', classification: 'premier-cru' as const },
  { name: 'les-Epenotes', slug: 'les-epenotes', classification: 'premier-cru' as const },
  { name: 'les-Feves', slug: 'les-feves', classification: 'premier-cru' as const },
  { name: 'les-Greves', slug: 'les-greves', classification: 'premier-cru' as const },
  { name: 'les-Marconnets', slug: 'les-marconnets', classification: 'premier-cru' as const },
  { name: 'les-Montrevenots', slug: 'les-montrevenots', classification: 'premier-cru' as const },
  { name: 'les-Perrieres', slug: 'les-perrieres', classification: 'premier-cru' as const },
  { name: 'les-Reverses', slug: 'les-reverses', classification: 'premier-cru' as const },
  { name: 'les-Sceaux', slug: 'les-sceaux', classification: 'premier-cru' as const },
  { name: 'les-Seurey', slug: 'les-seurey', classification: 'premier-cru' as const },
  { name: 'les-Sizies', slug: 'les-sizies', classification: 'premier-cru' as const },
  { name: 'les-Teurons', slug: 'les-teurons', classification: 'premier-cru' as const },
  { name: 'les-Toussaints', slug: 'les-toussaints', classification: 'premier-cru' as const },
  { name: 'les-Tuvilains', slug: 'les-tuvilains', classification: 'premier-cru' as const },
  { name: 'les-Vignes-Franches', slug: 'les-vignes-franches', classification: 'premier-cru' as const },
  { name: 'Montee-Rouge', slug: 'montee-rouge', classification: 'premier-cru' as const },
  { name: 'Pertuisots', slug: 'pertuisots', classification: 'premier-cru' as const },
  { name: 'Sur-les-Greves', slug: 'sur-les-greves', classification: 'premier-cru' as const },
  { name: 'Sur-les-Greves-Clos-Sainte-Anne', slug: 'sur-les-greves-clos-sainte-anne', classification: 'premier-cru' as const },
] as const;

export default function BeaunePage() {
  return (
    <RegionLayout
      title="Beaune"
      level="village"
      parentRegion="france/burgundy/cote-de-beaune"
      sidebarLinks={BEAUNE_VINEYARDS}
      contentFile="beaune-guide.md"
    />
  );
}
