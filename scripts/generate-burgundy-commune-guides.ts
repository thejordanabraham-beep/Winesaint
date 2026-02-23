import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface CommuneData {
  name: string;
  slug: string;
  subRegion: string;
  subRegionSlug: string;
  notableProducers: string[];
  grandCrus?: string[];
  topPremierCrus?: string[];
}

const COMMUNE_DATA: CommuneData[] = [
  // CÔTE DE NUITS (8 communes)
  {
    name: 'Gevrey-Chambertin',
    slug: 'gevrey-chambertin',
    subRegion: 'Côte de Nuits',
    subRegionSlug: 'cote-de-nuits',
    grandCrus: ['Chambertin', 'Chambertin-Clos de Bèze', 'Chapelle-Chambertin', 'Charmes-Chambertin', 'Griotte-Chambertin', 'Latricières-Chambertin', 'Mazis-Chambertin', 'Ruchottes-Chambertin', 'Mazoyères-Chambertin'],
    topPremierCrus: ['Clos Saint-Jacques', 'Les Cazetiers', 'Lavaux Saint-Jacques', 'Aux Combottes'],
    notableProducers: ['Armand Rousseau', 'Claude Dugat', 'Denis Mortet', 'Fourrier', 'Dugat-Py'],
  },
  {
    name: 'Morey-Saint-Denis',
    slug: 'morey-saint-denis',
    subRegion: 'Côte de Nuits',
    subRegionSlug: 'cote-de-nuits',
    grandCrus: ['Clos de Tart', 'Clos de la Roche', 'Clos Saint-Denis', 'Clos des Lambrays', 'Bonnes-Mares (part)'],
    topPremierCrus: ['Les Ruchots', 'Clos des Ormes', 'Les Millandes'],
    notableProducers: ['Domaine Dujac', 'Domaine Ponsot', 'Clos de Tart', 'Hubert Lignier'],
  },
  {
    name: 'Chambolle-Musigny',
    slug: 'chambolle-musigny',
    subRegion: 'Côte de Nuits',
    subRegionSlug: 'cote-de-nuits',
    grandCrus: ['Musigny', 'Bonnes-Mares (part)'],
    topPremierCrus: ['Les Amoureuses', 'Les Charmes', 'Les Fuées', 'Les Cras'],
    notableProducers: ['Georges Roumier', 'Jacques-Frédéric Mugnier', 'Comte Georges de Vogüé', 'Ghislaine Barthod'],
  },
  {
    name: 'Vougeot',
    slug: 'vougeot',
    subRegion: 'Côte de Nuits',
    subRegionSlug: 'cote-de-nuits',
    grandCrus: ['Clos de Vougeot'],
    topPremierCrus: ['Les Cras', 'Clos de la Perrière'],
    notableProducers: ['Domaine de la Vougeraie', 'Anne Gros', 'Méo-Camuzet'],
  },
  {
    name: 'Vosne-Romanée',
    slug: 'vosne-romanee',
    subRegion: 'Côte de Nuits',
    subRegionSlug: 'cote-de-nuits',
    grandCrus: ['Romanée-Conti', 'La Tâche', 'Richebourg', 'Romanée-Saint-Vivant', 'La Romanée', 'La Grande Rue', 'Échezeaux', 'Grands Échezeaux'],
    topPremierCrus: ['Cros Parantoux', 'Les Suchots', 'Aux Malconsorts', 'Les Beaux Monts'],
    notableProducers: ['Domaine de la Romanée-Conti', 'Domaine Leroy', 'Méo-Camuzet', 'Sylvain Cathiard', 'Emmanuel Rouget'],
  },
  {
    name: 'Nuits-Saint-Georges',
    slug: 'nuits-saint-georges',
    subRegion: 'Côte de Nuits',
    subRegionSlug: 'cote-de-nuits',
    topPremierCrus: ['Les Saint-Georges', 'Les Vaucrains', 'Les Cailles', 'Aux Boudots'],
    notableProducers: ['Henri Gouges', 'Robert Chevillon', 'Faiveley', 'Jean-Jacques Confuron'],
  },
  {
    name: 'Fixin',
    slug: 'fixin',
    subRegion: 'Côte de Nuits',
    subRegionSlug: 'cote-de-nuits',
    topPremierCrus: ['Clos de la Perrière', 'Clos du Chapitre', 'Les Arvelets'],
    notableProducers: ['Domaine Berthaut-Gerbet', 'Pierre Gelin', 'Domaine Joliet'],
  },
  {
    name: 'Marsannay',
    slug: 'marsannay',
    subRegion: 'Côte de Nuits',
    subRegionSlug: 'cote-de-nuits',
    notableProducers: ['Bruno Clair', 'Sylvain Pataille', 'Denis Mortet', 'Château de Marsannay'],
  },

  // CÔTE DE BEAUNE (14 communes)
  {
    name: 'Aloxe-Corton',
    slug: 'aloxe-corton',
    subRegion: 'Côte de Beaune',
    subRegionSlug: 'cote-de-beaune',
    grandCrus: ['Corton', 'Corton-Charlemagne'],
    topPremierCrus: ['Les Fournières', 'Les Chaillots', 'Les Valozières'],
    notableProducers: ['Domaine Follin-Arbelet', 'Domaine Tollot-Beaut', 'Domaine Senard'],
  },
  {
    name: 'Pernand-Vergelesses',
    slug: 'pernand-vergelesses',
    subRegion: 'Côte de Beaune',
    subRegionSlug: 'cote-de-beaune',
    topPremierCrus: ['Île des Vergelesses', 'Les Fichots', 'Sous Frétille'],
    notableProducers: ['Domaine Rapet', 'Domaine Rollin', 'Chandon de Briailles'],
  },
  {
    name: 'Ladoix',
    slug: 'ladoix',
    subRegion: 'Côte de Beaune',
    subRegionSlug: 'cote-de-beaune',
    topPremierCrus: ['La Corvée', 'Le Clou d\'Orge', 'Les Gréchons'],
    notableProducers: ['Domaine Edmond Cornu', 'Domaine Chevalier', 'Domaine Ravaut'],
  },
  {
    name: 'Savigny-lès-Beaune',
    slug: 'savigny-les-beaune',
    subRegion: 'Côte de Beaune',
    subRegionSlug: 'cote-de-beaune',
    topPremierCrus: ['Les Lavières', 'Aux Vergelesses', 'Les Marconnets', 'Aux Guettes'],
    notableProducers: ['Simon Bize', 'Chandon de Briailles', 'Domaine Pavelot'],
  },
  {
    name: 'Beaune',
    slug: 'beaune',
    subRegion: 'Côte de Beaune',
    subRegionSlug: 'cote-de-beaune',
    topPremierCrus: ['Les Grèves', 'Clos des Mouches', 'Les Bressandes', 'Les Teurons', 'Vignes Franches'],
    notableProducers: ['Joseph Drouhin', 'Bouchard Père & Fils', 'Louis Jadot', 'Albert Morot'],
  },
  {
    name: 'Pommard',
    slug: 'pommard',
    subRegion: 'Côte de Beaune',
    subRegionSlug: 'cote-de-beaune',
    topPremierCrus: ['Les Rugiens', 'Les Épenots', 'Les Pézerolles', 'Clos des Épeneaux'],
    notableProducers: ['Comte Armand', 'Domaine de Courcel', 'Domaine de Montille'],
  },
  {
    name: 'Volnay',
    slug: 'volnay',
    subRegion: 'Côte de Beaune',
    subRegionSlug: 'cote-de-beaune',
    topPremierCrus: ['Caillerets', 'Champans', 'Santenots', 'Taillepieds', 'Clos des Chênes'],
    notableProducers: ['Marquis d\'Angerville', 'Domaine de Montille', 'Michel Lafarge'],
  },
  {
    name: 'Monthélie',
    slug: 'monthelie',
    subRegion: 'Côte de Beaune',
    subRegionSlug: 'cote-de-beaune',
    topPremierCrus: ['Sur la Velle', 'Les Duresses', 'Les Champs Fulliot'],
    notableProducers: ['Domaine de Suremain', 'Comtes Lafon', 'Paul Garaudet'],
  },
  {
    name: 'Auxey-Duresses',
    slug: 'auxey-duresses',
    subRegion: 'Côte de Beaune',
    subRegionSlug: 'cote-de-beaune',
    topPremierCrus: ['Les Duresses', 'Clos du Val', 'Les Écusseaux'],
    notableProducers: ['Domaine Lafouge', 'Domaine d\'Auvenay', 'Domaine Prunier'],
  },
  {
    name: 'Meursault',
    slug: 'meursault',
    subRegion: 'Côte de Beaune',
    subRegionSlug: 'cote-de-beaune',
    topPremierCrus: ['Perrières', 'Genevrières', 'Charmes', 'Goutte d\'Or', 'Blagny'],
    notableProducers: ['Comtes Lafon', 'Coche-Dury', 'Pierre-Yves Colin-Morey', 'Roulot'],
  },
  {
    name: 'Puligny-Montrachet',
    slug: 'puligny-montrachet',
    subRegion: 'Côte de Beaune',
    subRegionSlug: 'cote-de-beaune',
    grandCrus: ['Montrachet (part)', 'Bâtard-Montrachet (part)', 'Chevalier-Montrachet', 'Bienvenues-Bâtard-Montrachet'],
    topPremierCrus: ['Les Pucelles', 'Les Folatières', 'Le Cailleret', 'Les Combettes'],
    notableProducers: ['Domaine Leflaive', 'Etienne Sauzet', 'Paul Pernot', 'Carillon'],
  },
  {
    name: 'Chassagne-Montrachet',
    slug: 'chassagne-montrachet',
    subRegion: 'Côte de Beaune',
    subRegionSlug: 'cote-de-beaune',
    grandCrus: ['Montrachet (part)', 'Bâtard-Montrachet (part)', 'Criots-Bâtard-Montrachet'],
    topPremierCrus: ['Les Ruchottes', 'La Maltroie', 'Morgeot', 'Les Caillerets', 'En Remilly'],
    notableProducers: ['Domaine Ramonet', 'Blain-Gagnard', 'Fontaine-Gagnard', 'Marc Colin'],
  },
  {
    name: 'Saint-Aubin',
    slug: 'saint-aubin',
    subRegion: 'Côte de Beaune',
    subRegionSlug: 'cote-de-beaune',
    topPremierCrus: ['Les Murgers des Dents de Chien', 'En Remilly', 'Les Frionnes', 'Sur Gamay'],
    notableProducers: ['Hubert Lamy', 'Marc Colin', 'Pierre-Yves Colin-Morey', 'Henri Prudhon'],
  },
  {
    name: 'Santenay',
    slug: 'santenay',
    subRegion: 'Côte de Beaune',
    subRegionSlug: 'cote-de-beaune',
    topPremierCrus: ['Clos de Tavannes', 'La Comme', 'Beauregard', 'Le Passe Temps'],
    notableProducers: ['Vincent Girardin', 'Jean-Marc Vincent', 'Roger Belland'],
  },

  // CÔTE CHALONNAISE (4 communes)
  {
    name: 'Rully',
    slug: 'rully',
    subRegion: 'Côte Chalonnaise',
    subRegionSlug: 'cote-chalonnaise',
    topPremierCrus: ['Grésigny', 'Les Cloux', 'Margotés', 'Rabourcé'],
    notableProducers: ['Domaine Dureuil-Janthial', 'Vincent Dureuil-Janthial', 'Domaine Belleville'],
  },
  {
    name: 'Mercurey',
    slug: 'mercurey',
    subRegion: 'Côte Chalonnaise',
    subRegionSlug: 'cote-chalonnaise',
    topPremierCrus: ['Les Velley', 'Clos des Barraults', 'Les Naugues', 'Clos du Roy'],
    notableProducers: ['Domaine Faiveley', 'Château de Chamirey', 'François Raquillet'],
  },
  {
    name: 'Givry',
    slug: 'givry',
    subRegion: 'Côte Chalonnaise',
    subRegionSlug: 'cote-chalonnaise',
    topPremierCrus: ['Clos Saint-Pierre', 'Clos Salomon', 'Clos Jus', 'La Grande Berge'],
    notableProducers: ['Domaine Joblot', 'François Lumpp', 'Domaine Sarrazin'],
  },
  {
    name: 'Montagny',
    slug: 'montagny',
    subRegion: 'Côte Chalonnaise',
    subRegionSlug: 'cote-chalonnaise',
    topPremierCrus: ['Les Coères', 'Les Bonneveaux', 'Les Burnins'],
    notableProducers: ['Domaine Stéphane Aladame', 'Cave de Buxy', 'Olivier Merlin'],
  },
];

function generateCommunePrompt(commune: CommuneData): string {
  const hasGrandCrus = commune.grandCrus && commune.grandCrus.length > 0;

  return `Generate an exceptionally comprehensive guide for ${commune.name}, one of the legendary wine villages in the ${commune.subRegion} of Burgundy, France.

Burgundy is the world's most complex and information-rich wine region. This guide should be 3,500-5,000 words and provide deep, authoritative coverage.

CRITICAL INSTRUCTIONS:
- This is a REAL, OFFICIAL wine appellation recognized by INAO (Institut National de l'Origine et de la Qualité)
- Use extended thinking: DISABLED (be direct and factual, no hedging)
- Be assertive and definitive in your statements about this appellation
- Provide specific, detailed information as this is an educational wine guide

STRUCTURE (include all sections):

1. **Overview & Location**
   - Precise location within ${commune.subRegion}
   - Geographic context relative to other ${commune.subRegion} villages
   - Total vineyard area (hectares)
   - Climate and exposition

2. **Historical Background**
   - Monastic origins and historical development
   - Evolution of the appellation
   - Reputation through the centuries

3. **Terroir & Geology**
   - Detailed soil composition (limestone, clay, marl proportions)
   - Geological formation and age
   - Slope angles and aspects
   - Elevation ranges
   - Microclimate characteristics

4. **Vineyard Classification System**
   ${hasGrandCrus ? `- Grand Cru vineyards: ${commune.grandCrus!.join(', ')}` : '- No Grand Cru vineyards (but important Premier Crus)'}
   ${commune.topPremierCrus ? `- Top Premier Cru vineyards: ${commune.topPremierCrus.join(', ')}` : ''}
   - Village-level wines
   - How this commune's classification compares to neighbors

5. **Wine Styles & Characteristics**
   - Typical flavor profiles (red and/or white)
   - Structure and body
   - Tannin profile (for reds)
   - Aromatic signatures
   - How ${commune.name} wines differ from neighboring villages in ${commune.subRegion}

6. **Comparison to Neighboring Villages**
   - Critical analysis: How ${commune.name}'s wines differ from adjacent communes
   - Stylistic distinctions within ${commune.subRegion}
   - What makes ${commune.name} unique

7. **Notable Vineyards**
   ${hasGrandCrus ? `- Detailed discussion of Grand Cru vineyards` : ''}
   - Analysis of top Premier Cru sites
   - Their specific terroirs and characteristics

8. **Leading Producers**
   - Major domaines: ${commune.notableProducers.join(', ')}
   - Their styles and reputations
   - Historic vs. modern producers

9. **Aging Potential & Evolution**
   - How wines evolve over time
   - Optimal drinking windows
   - Vintage variation
   - Quality levels and longevity

10. **Market Position**
   - Pricing relative to other ${commune.subRegion} appellations
   - Collectibility and investment potential
   - Availability

DO NOT INCLUDE:
- Food pairing recommendations
- Visiting/tourism information
- Serving temperature recommendations
- Wine tasting notes from specific vintages

TARGET AUDIENCE: Serious wine collectors, sommeliers, and students preparing for advanced wine certifications (WSET Diploma, Master Sommelier, Master of Wine).

Write in an authoritative, educational tone. Be comprehensive and detailed.`;
}

async function generateCommuneGuide(commune: CommuneData, index: number, total: number): Promise<void> {
  const guidesDir = '/Users/jordanabraham/wine-reviews/guides';
  const guidePath = path.join(guidesDir, `${commune.slug}-guide.md`);

  // Skip if already exists
  if (fs.existsSync(guidePath)) {
    console.log(`\n⏭️  [${index}/${total}] ${commune.name}: Guide already exists`);
    return;
  }

  console.log(`\n📝 [${index}/${total}] Generating guide for ${commune.name}...`);

  const prompt = generateCommunePrompt(commune);

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      temperature: 1,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const guideContent = message.content[0].type === 'text' ? message.content[0].text : '';

    // Save to file
    fs.writeFileSync(guidePath, guideContent, 'utf-8');

    console.log(`   ✅ Generated ${commune.name} guide (${guideContent.length} characters)`);
    console.log(`   💰 Estimated cost: $${((message.usage.input_tokens * 3 / 1000000) + (message.usage.output_tokens * 15 / 1000000)).toFixed(3)}`);

    // Rate limiting delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.error(`   ❌ Error generating ${commune.name}:`, error);
    throw error;
  }
}

async function generateAllCommuneGuides() {
  console.log('🍷 BURGUNDY COMMUNE GUIDE GENERATION');
  console.log('Generating comprehensive guides for all 26 communes\n');
  console.log('═'.repeat(80));

  const startTime = Date.now();
  let totalCost = 0;

  for (let i = 0; i < COMMUNE_DATA.length; i++) {
    const commune = COMMUNE_DATA[i];
    await generateCommuneGuide(commune, i + 1, COMMUNE_DATA.length);
  }

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

  console.log('\n\n' + '═'.repeat(80));
  console.log(`✨ COMMUNE GUIDE GENERATION COMPLETE!`);
  console.log(`   Time: ${duration} minutes`);
  console.log(`   Guides: ${COMMUNE_DATA.length} communes`);
  console.log('\n🎯 NEXT STEP: Generate vineyard guides (~624 vineyards)');
}

generateAllCommuneGuides().catch(console.error);
