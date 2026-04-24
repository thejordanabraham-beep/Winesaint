/**
 * Fix Template Regions with Real Content
 *
 * This script updates 23 regions that have generic/template content
 * with researched, accurate wine guide content.
 *
 * Usage:
 *   npx tsx scripts/fix-template-regions.ts
 *   npx tsx scripts/fix-template-regions.ts --dry-run
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import pg from 'pg'

const { Client } = pg

interface RegionUpdate {
  slug: string
  description: string
}

// Research-based content for each region
const regionUpdates: RegionUpdate[] = [
  // 1. Austria - Kremstal - Oberfeld
  {
    slug: 'austria/kremstal/oberfeld',
    description: `# Oberfeld

Oberfeld is one of the most distinguished vineyard sites in the Kremstal wine region of Lower Austria, located near the magnificent Baroque Benedictine abbey Stift Gottweig. Along with Gottschelle, it is considered one of the finest terroirs in the southern Kremstal, where the wines display remarkable mineral complexity and aging potential.

## Geography and Terroir

The Oberfeld vineyard lies in the shadow of Stift Gottweig monastery, positioned on slopes that benefit from the unique microclimate created by the abbey's elevated position. The surrounding wine villages of Furth, Palt, and the smaller hamlets of Paudorf, Steinaweg, Meidling, Eggendorf, Hobenbach, Krustetten, Oberfucha, and Tiefenfucha all contribute parcels to the broader Kremstal appellation.

The Kremstal benefits from a continental climate moderated by both warm Pannonian air from the east and cool Alpine air from the Waldviertel to the north. This creates significant diurnal temperature variation, allowing for longer hang times and slower sugar accumulation while preserving aromatic intensity and acidity.

## Soil Composition

The soils of Oberfeld are predominantly composed of loess over primary rock, creating a complex tapestry of mineral-rich terroir. The loess deposits provide excellent water retention while the underlying primary rock contributes to the pronounced minerality that characterizes wines from this site. This combination of fertile loess and mineral-rich bedrock imbues the vines with exceptional depth and complexity.

## Wine Character

Wines from Oberfeld, primarily Gruner Veltliner and Riesling, display classic Kremstal characteristics of white pepper spice, stone fruit, and pronounced mineral notes. The site produces wines with excellent structure, refreshing acidity, and notable aging potential. The best examples from Oberfeld can develop beautifully for 10-15 years, gaining complexity and depth while maintaining their vibrant freshness.

## Notable Producers

**Weingut Malat** - Located in the small wine village of Palt/Furth near Oberfeld, Malat is a top Kremstal producer known for its exceptional Gruner Veltliner, Riesling, Zweigelt, and Pinot Noir wines, as well as popular sparkling wines counted among Austria's best.

**Weingut Geyerhof** - Situated in the village of Oberfucha/Furth, Geyerhof was among the first estates in Austria to convert to organic farming in the late 1980s, and continues to produce terroir-driven wines that express the unique character of this area.

**Weingut Stadt Krems** - One of Austria's oldest wineries, producing exceptional site-specific wines from across the Kremstal region.

**Weingut Nigl** - Renowned for high-quality Riesling and terroir-driven wines that showcase the mineral complexity of Kremstal's best sites.`
  },

  // 2. Austria - Thermenregion - Roter Berg
  {
    slug: 'austria/thermenregion/roter-berg',
    description: `# Roter Berg

Roter Berg, meaning "Red Mountain," is a vineyard site in the Thermenregion of Lower Austria, named for its distinctive iron-rich red soils. The Thermenregion, located just south of Vienna, is one of Austria's warmest wine-growing regions and is renowned for its indigenous grape varieties Zierfandler and Rotgipfler.

## Geography and Terroir

Roter Berg is situated within the Thermenregion, which was formed in 1985 by merging the formerly independent wine-growing regions of Gumpoldskirchen and Bad Voslau. The region takes its name from the sulphurous hot springs at Baden, which have been famous since Roman times. The vines here benefit from the Pannonian climate with hot summers, dry autumns, and approximately 1,800 hours of sunshine per year.

The vineyard's position in the foothills offers excellent drainage and sun exposure, critical factors for ripening the region's distinctive grape varieties.

## Soil Composition

The name "Roter Berg" refers to the vineyard's iron-rich soils that give the slopes their reddish coloration. The predominant soils are loamy, composed of fine-grained sedimentary deposits with a high proportion of coarse particles from cemented or loose gravel and sands. These contain significant lime content and substantial remnants of shells, snails, and other marine life from the ancient Pannonian Sea. Debris deposits at the bottom of the hillsides facilitate drainage and help warm the vineyards during the growing season.

## Wine Character

The Thermenregion's signature style is a blend of Zierfandler and Rotgipfler, two indigenous varieties not found in quantity anywhere else in Austria. Wines from Roter Berg display rich, full-bodied characteristics with notes of white flowers, exotic fruits, and a distinctive mineral backbone derived from the iron-rich soils. The warm climate produces wines with generous ripeness while the cooling evening breezes help maintain balancing acidity.

In the southern parts of the Thermenregion, red wine predominates with Sankt Laurent and Pinot Noir as the leading varieties, producing wines of elegance and structure.

## Notable Producers

**Weingut Stadlmann** - A benchmark producer for Zierfandler and Rotgipfler, crafting wines that beautifully express the Thermenregion's unique terroir.

**Weingut Johanneshof Reinisch** - Known for exceptional Pinot Noir and traditional Thermenregion white varieties.

**Stiftsweingut Heiligenkreuz - Freigut Thallern** - Austria's oldest vineyard, founded in 1141 by the Cistercians of Heiligenkreuz Abbey, continues to produce distinctive wines from this historic region.`
  },

  // 3. Austria - Wachau - 1000-Eimerberg
  {
    slug: 'austria/wachau/1000-eimerberg',
    description: `# 1000-Eimerberg

The Ried 1000-Eimerberg is a legendary single vineyard in the Wachau region of Austria, renowned for producing Rieslings of striking intensity and finesse. The name references the ancient measure "Eimer" (bucket), suggesting the site's historic productivity and significance. Located in Spitz an der Donau, this small, prestigious vineyard produces some of the Wachau's most distinguished wines.

## Geography and Terroir

The 1000-Eimerberg vineyard is situated within the UNESCO World Heritage Wachau Valley, a dramatic narrow gorge carved by the Danube River between Melk and Krems. The vineyard faces due south at approximately 150 meters above sea level, benefiting from optimal sun exposure throughout the growing season.

The site covers approximately 5 hectares, making it one of the smaller classified vineyards in the Wachau. Its position along the river creates a natural mirror effect, with sunlight reflecting off the Danube to provide additional warmth and light to the vines during the crucial ripening period.

## Soil Composition

The stony, deep slate soil of 1000-Eimerberg is interspersed with quartz, providing excellent drainage while retaining heat during the day and releasing it slowly through cool nights. The high proportion of fine earth combined with the extensive forest above the rocky outcrop ensures an excellent water supply even during dry periods. In challenging years, the deep roots can draw from water and mineral reserves stored in the deeper soil layers.

The blue-grey Devonian slate is characteristic of the Wachau's finest sites, contributing the distinctive flinty, mineral character that defines the region's best Rieslings.

## Wine Character

Wines from Ried 1000-Eimerberg are known for their aromatic intensity and mineral depth. The terroir produces very aromatic Rieslings with full body and ripe flavors, often showing notes of fresh yellow peach, honey blossom, and delicate candied mandarin zest. The palate displays juicy elegance, white stone fruit, fine acidity, and mineral length.

The pronounced character of Domherr wines can be easily distinguished from neighboring vineyards. These are wines that often need time in bottle to fully reveal their potential, with the best examples aging gracefully for 15-20 years or more.

The vineyard produces wines in the traditional Wachau classification styles: Smaragd (the highest ripeness category), Federspiel (medium body), and Steinfeder (lightest style).

## Notable Producers

**Weingut FJ Gritsch** - The Gritsch family produces exceptional Rieslings from this site in both Federspiel and Smaragd styles. Their 2023 Riesling Wachau DAC Ried 1000-Eimerberg received 94-96 Falstaff points.

**Weingut Hofstatter (Wolfgang)** - Crafts highly regarded Smaragd-level Rieslings from parcels in this prestigious Ried.

**Weingut Christoph Donabaum** - Known for precise, terroir-driven Rieslings that showcase the vineyard's distinctive mineral character.

**Weingut Strawanzer Donabaum** - Another family branch producing acclaimed wines from this site.

**Weingut Lagler** - Produces a Selection-level wine from 1000-Eimerberg, representing the finest expression of the terroir.`
  },

  // 4. Austria - Wien - Seidenhaus
  {
    slug: 'austria/wien/seidenhaus',
    description: `# Seidenhaus

Ried Seidenhaus is one of Vienna's most illustrious vineyard sites, located in the wine-growing areas that make Vienna unique as the only major world capital with significant viticulture within its city limits. Along with prestigious neighbors like Ried Pfeffer and Ried Bellevue, Seidenhaus has long been recognized among the finest terroirs in the city.

## Geography and Terroir

Vienna's vineyards occupy approximately 600 hectares in a semicircle from south to north along the foothills of the Vienna Woods (Wienerwald). The Seidenhaus vineyard benefits from this unique position where the Alps meet the Pannonian Plain, creating a microclimate perfectly suited to viticulture.

The site is part of the larger wine-growing areas that include Grinzing, the Nussberg, and the Bisamberg, where roughly 80 percent of plantings are white varieties, primarily Gruner Veltliner, Weissburgunder, and Chardonnay. The unique microclimate, with Pannonian influence and proximity to the Danube, provides ideal conditions for producing fine, fruity, mineral-driven wines.

## Soil Composition

The soils of Seidenhaus reflect Vienna's diverse geological heritage, with a mix of limestone, loess, and clay deposits that have accumulated over millions of years. These mixed soils provide excellent drainage while retaining sufficient moisture to sustain the vines through warm summers. The mineral content of the bedrock contributes to the distinctive chalky, flinty notes found in wines from this site.

## Wine Character

Wines from Seidenhaus embody the quintessential Viennese style: elegant, fresh, and eminently drinkable. The site is particularly suited to the Wiener Gemischter Satz, the traditional field blend that has become Vienna's signature wine style and was granted DAC (Districtus Austriae Controllatus) status in 2013.

The unique terroir produces wines with bright acidity, stone fruit characteristics, and a subtle herbal complexity that reflects the alpine influence on the microclimate. Single-variety wines from Seidenhaus, particularly Gruner Veltliner and Weissburgunder, display remarkable purity and mineral tension.

## Notable Producers

**Weingut Wien Cobenzl** - One of Vienna's most important wine estates, owned by the City of Vienna for over 110 years. The estate farms approximately 60 hectares across Grinzing, the Nussberg, and Bisamberg, and achieved organic certification in December 2023. Cobenzl produces outstanding examples from Seidenhaus and neighboring top sites.

**Weingut Wieninger** - A pioneering estate that has elevated Vienna's wine reputation internationally, known for site-specific wines that express the distinctive character of Vienna's best vineyards.

**Weingut Mayer am Pfarrplatz** - Historic producer with holdings in Vienna's finest sites, crafting both traditional Gemischter Satz and modern single-variety wines.

**Weingut Fuhrgassl-Huber** - Family estate producing classic Viennese wines with a focus on terroir expression and sustainable viticulture.`
  },

  // 5. France - Burgundy - Cote Chalonnaise - Montagny - Cruzille
  {
    slug: 'france/burgundy/cote-chalonnaise/montagny/cruzille',
    description: `# Cruzille

Cruzille is a lieu-dit within the Montagny appellation in the southern Cote Chalonnaise of Burgundy. While Montagny is renowned for its Premier Cru white wines made exclusively from Chardonnay, Cruzille represents one of the village-level parcels that contribute to the appellation's reputation for accessible, high-quality white Burgundy.

## Geography and Terroir

Cruzille is situated within the commune boundaries that form the Montagny appellation, which includes Montagny-les-Buxy, Jully-les-Buxy, Buxy, and Saint-Vallerin. The Cote Chalonnaise extends south from the celebrated Cote d'Or, offering similar geological conditions at more approachable prices.

The vineyards of Montagny occupy slopes at elevations ranging from approximately 260 to 390 meters (850-1,280 feet), with varying aspects that create diverse microclimates throughout the appellation. Cruzille benefits from the continental climate of Burgundy, moderated by the influence of the Saone Valley to the east.

## Soil Composition

The soils of Cruzille share the limestone and marl foundation common to the Montagny appellation. The hillside vineyards rest on well-drained limestone bedrock with varying amounts of clay in the topsoil, which influences the weight and texture of the resulting wines. Higher slopes with thinner soils and greater limestone content produce wines with more pronounced minerality, while parcels with more clay yield richer, rounder expressions.

The geological base dates to the Jurassic period, similar to the formations found in the more famous appellations to the north. This shared heritage explains the family resemblance between Montagny wines and their Cote de Beaune cousins.

## Wine Character

Chardonnay from Cruzille displays the classic Montagny profile: fresh, fruity, and mineral-driven with notable finesse. The wines typically show aromas of white flowers, citrus, and green apple, with a underlying chalky minerality that develops with age. The palate is medium-bodied with crisp acidity and a clean, refreshing finish.

Montagny wines from sites like Cruzille are known for their excellent value, offering Burgundian character and quality at accessible prices. While best enjoyed within 3-5 years of release, well-made examples can develop additional complexity with moderate cellaring.

## Notable Producers

**Cave des Vignerons de Buxy** - The cooperative cellar produces reliable, well-made Montagny from across the appellation, including fruit from Cruzille.

**Domaine Aladame** - Quality-focused estate producing terroir-expressive Montagny wines.

**Chateau de la Saule** - Historic property crafting traditional Cote Chalonnaise whites with a focus on purity and freshness.`
  },

  // 6. France - Burgundy - Cote Chalonnaise - Montagny - Les Coeres
  {
    slug: 'france/burgundy/cote-chalonnaise/montagny/les-coeres',
    description: `# Les Coeres

Les Coeres is the largest and most renowned Premier Cru vineyard in the Montagny appellation, spanning an impressive 34 hectares across three different communes. Its distinctive Y-shaped configuration and unique position at the junction of Montagny-les-Buxy, Jully-les-Buxy, and Saint-Vallerin make it one of the most significant sites in the southern Cote Chalonnaise.

## Geography and Terroir

Les Coeres occupies a remarkable position where the borders of three communes meet near the center of the vineyard, with an "arm" of vines extending into each. This unusual configuration means the vineyard encompasses a diversity of exposures and microclimates within a single climat.

The vines are planted both on a plateau and on hillsides facing southeast and north, creating variation in sun exposure and drainage across the site. This diversity contributes to the complexity found in wines from Les Coeres, as different parcels ripen at slightly different rates and express distinct characteristics.

## Soil Composition

The soils of Les Coeres are dominated by limestone-centric compositions with significant deposits of ancient seashells embedded in the matrix. At the top of the cru, the soils are particularly mineral-rich with more pronounced limestone content, while lower portions include more clay, producing wines of greater richness and body.

The geological foundation dates to the Jurassic period, with the characteristic marly limestone that defines the best terroirs of Burgundy. The presence of marine fossils throughout the soil profile speaks to the region's ancient seabed origins.

## Wine Character

As Montagny's largest and best-known Premier Cru, Les Coeres produces Chardonnay of notable finesse and body not found elsewhere in the Cote Chalonnaise. The wines typically require extended aging to express their full potential, with total maturation periods averaging 15 months before release.

Wines from Les Coeres display classic white Burgundy characteristics: citrus, white flower, and stone fruit aromatics layered over a pronounced mineral backbone. The palate shows excellent structure and length, with balancing acidity that supports graceful aging over 5-10 years.

## Notable Producers

**Maison de Montille** - The renowned Burgundy house vinifies fruit from 25-year-old vines at the top of the hill, where the soils are most mineral-rich. The vines are managed organically, producing wines of clarity and precision.

**Domaine Feuillat-Juillot** - This family estate owns 4 hectares of 60-year-old vines within Les Coeres, lying at 300 meters elevation. Their old-vine cuvee is a benchmark for the appellation.

**Cave des Vignerons de Buxy** - The cooperative cellar is renowned as the ambassador of Cote Chalonnaise wines, producing consistently reliable Premier Cru Montagny from Les Coeres.

**Chateau de la Saule** - Produces Premier Cru Les Coeres with a focus on traditional winemaking and terroir expression.`
  },

  // 7. France - Burgundy - Cote de Beaune - Puligny-Montrachet - Clavoillon
  {
    slug: 'france/burgundy/cote-de-beaune/puligny-montrachet/clavoillon',
    description: `# Clavoillon

Clavoillon (historically also written as Clavaillon) is one of Puligny-Montrachet's most distinctive Premier Cru vineyards, notable both for its exceptional terroir and its unusual ownership structure. Domaine Leflaive controls over 85% of this 5.6-hectare climat, making their expression of Clavoillon essentially definitive of the site's character.

## Geography and Terroir

Clavoillon occupies a privileged position in the center of the Puligny-Montrachet appellation, lying just over 500 meters above the village on the lower slope of the Cote d'Or escarpment. The climat is in excellent company: Les Pucelles lies along the slope to the south, separating Clavoillon from the legendary Batard-Montrachet Grand Cru, while the large Les Folatieres Premier Cru rises on the hillside above.

The vineyard's position at the base of the slope distinguishes its terroir from the steeper Premier Cru sites higher up. This lower elevation contributes to deeper soils and a slightly different expression of Puligny character.

## Soil Composition

Clavoillon's soils, while still based on chalky limestone, are deeper and contain higher levels of clay than the thin, stony vineyards higher on the slope, similar in composition to nearby Les Referts. This elevated clay content produces wines that are slightly sturdier and broader than those from lighter-soiled vineyards.

However, the clay's limestone content remains significant, contributing the minerality that often manifests as a chalky, flinty character in finished wines. The soil is stony with excellent drainage despite the clay component, and the vineyard was replanted with Chardonnay in the early 20th century after phylloxera devastated the original Pinot Noir plantings.

## Wine Character

Clavoillon produces wines of substantial structure, displaying a lively, chalky texture with pronounced minerality. The typical profile includes citrus, white flowers, and honey aromas, evolving to reveal ripe fruit, mineral, and oak-derived flavors with age.

The wines possess excellent aging potential, developing additional complexity over 8-15 years in bottle. The fuller body derived from the clay-rich soils distinguishes Clavoillon from the more ethereal, tense styles of higher-slope Puligny Premiers Crus.

## Notable Producers

**Domaine Leflaive** - The dominant owner of Clavoillon, controlling approximately 4 hectares 79 ares (11.84 acres) of this Premier Cru. Under the leadership of Brice de la Morandiere, Domaine Leflaive stands as one of the most influential estates in Puligny-Montrachet. The domain was a pioneer in biodynamic viticulture, beginning experiments in 1990 and converting all vineyards by 1997.

The Leflaive Clavoillon vineyard is planted with vines from multiple decades: 1959, 1960, 1962, 1972, 1973, 1981, 1983, and 1988. This range of vine ages contributes complexity to the final blend.

Only one other family vinifies Premier Cru Clavoillon alongside Leflaive, making this one of the most monopolistic Premier Crus in Burgundy without being officially designated as a monopole.

## Classification

Clavoillon's Premier Cru status places it among the finest vineyards of Puligny-Montrachet, a commune celebrated for producing some of the world's greatest white wines. While not at Grand Cru level, Clavoillon's quality and Leflaive's meticulous stewardship have earned it an exalted reputation among Premier Crus.`
  },

  // 8. France - Burgundy - Cote de Beaune - Saint-Aubin - Derriere Chez Edouard
  {
    slug: 'france/burgundy/cote-de-beaune/saint-aubin/derriere-chez-edouard',
    description: `# Derriere Chez Edouard

Derriere Chez Edouard ("Behind Edouard's Place") is a Premier Cru climat in the Saint-Aubin appellation of Burgundy, lying on a southeast-facing slope immediately northwest of the village buildings. This vineyard has gained particular renown through the exceptional work of Domaine Hubert Lamy, whose experimental high-density plantings here have produced some of contemporary Burgundy's most fascinating wines.

## Geography and Terroir

The vineyard lies in the group of Premier Crus to the southwest of the hamlet of Gamay, oriented toward Saint-Aubin parish itself. The southeast-facing exposure provides excellent morning and midday sun, while the village position offers some protection from harsh afternoon heat. The adjacent Le Puits Premier Cru borders to the north.

Saint-Aubin occupies a privileged position between Chassagne-Montrachet and Puligny-Montrachet, and in places touches on the Grand Cru vineyards themselves. This proximity to Burgundy's most celebrated white wine terroirs hints at the quality potential of sites like Derriere Chez Edouard.

## Soil Composition

The soils of Saint-Aubin are generally deep, creating conditions for vigorous vine growth. The predominant composition includes limestone bedrock with varying proportions of clay and marl in the topsoil. This depth of soil contributes to Saint-Aubin's reputation for producing robust yet refined wines that bridge the gap between power and elegance.

## Wine Character

Derriere Chez Edouard produces both Chardonnay and Pinot Noir, with Domaine Hubert Lamy making acclaimed examples of each variety. The Pinot Noir from old vines (50-60 years old) produces smaller berries, concentrating flavors and adding complexity to the wines.

The white wines display classic Saint-Aubin character: fresh citrus and white fruit notes with underlying minerality, while the reds show the robust, structured style typical of the appellation, with fine tannins and good aging potential.

## Notable Producers

**Domaine Hubert Lamy** - The Lamy family has worked in Saint-Aubin since approximately 1640, making them among the oldest established vignerons in the commune. Hubert Lamy created the estate in 1973 with eight hectares, expanding significantly in the 1990s before his son Olivier joined in 1995.

Today the Domaine farms 18.5 hectares: 80% Chardonnay and 20% Pinot Noir, spread across Saint-Aubin, Puligny-Montrachet, Chassagne-Montrachet, and Santenay.

Olivier Lamy's revolutionary high-density planting experiments within Derriere Chez Edouard (at 28,000-30,000 vines per hectare in 0.10-hectare plots) represent the pinnacle of his work ethic and have proven incredibly successful. The "Haute Densite" bottlings from these parcels are considered among contemporary Burgundy's most exciting wines.

**Domaine Gilles Bouton** - Also produces wines from this climat, contributing to its reputation.

**Janots-Bos** - Another quality producer with holdings in the vineyard.`
  },

  // 9. France - Burgundy - Cote de Beaune - Saint-Aubin - En Creot
  {
    slug: 'france/burgundy/cote-de-beaune/saint-aubin/en-creot',
    description: `# En Creot

En Creot is a Premier Cru climat of the Saint-Aubin appellation, positioned at the northeastern end of the cluster of Premier Crus on the slopes of La Rochepot. The vineyard produces both Chardonnay and Pinot Noir wines that exemplify Saint-Aubin's capacity for creating wines of concentration and finesse.

## Geography and Terroir

En Creot (also written as Les Creot) occupies a south-facing slope that benefits from excellent sun exposure and the cool Burgundian nights essential for maintaining acidity during the growing season. The vineyard lies within the broader Saint-Aubin appellation, which covers the villages of Saint-Aubin and Gamay and includes 30 Premier Cru vineyards.

Saint-Aubin's location between Chassagne and Puligny, touching on Grand Cru vineyards in places, speaks to the quality potential of its best sites. En Creot's southern exposition and elevation make it among the more favored parcels within the appellation.

## Soil Composition

The soils of En Creot are composed of loose, chalk-rich sands mixed with pebbles and fractured limestone. This composition naturally limits vine vigor and yields, promoting concentration and a pronounced mineral character in the resulting wines.

The chalky limestone foundation provides excellent drainage while the sand and pebble content reflects and retains heat, helping to ensure optimal ripeness even in challenging vintages. These soil conditions are particularly well-suited to Chardonnay, which thrives in limestone-rich environments.

## Wine Character

En Creot produces Chardonnay of notable concentration and finesse, combining the richness that comes from limited yields with the freshness preserved by its elevated position and chalky soils. The wines typically display ripe yellow fruit notes, touches of mango, peach, and lime, along with the clear mineral signature that distinguishes this vineyard.

The Pinot Noir from En Creot benefits from the deep soils found in most parts of Saint-Aubin, producing robust yet refined reds with good structure and aging potential.

## Notable Producers

**Domaine Janots-Bos** - A quality producer crafting terroir-expressive wines from En Creot and other Saint-Aubin sites.

**Domaine Lamy-Pillot** - Produces well-regarded Premier Cru En Creot that showcases the vineyard's potential.

**Domaine Gilles Bouton** - Family estate with holdings in En Creot, producing classic Cote de Beaune style whites.

**Domaine Moingeon Andre et Fils** - Another respected producer working with this Premier Cru climat.`
  },

  // 10. France - Burgundy - Cote de Nuits - Fixin - Les Hervelets
  {
    slug: 'france/burgundy/cote-de-nuits/fixin/les-hervelets',
    description: `# Les Hervelets

Les Hervelets is a Premier Cru vineyard at the very northern end of the Cote de Nuits, within the small commune of Fixin. The vineyard produces structured, age-worthy Pinot Noir that bridges the gap between the more rustic character traditionally associated with Fixin and the finesse found in Gevrey-Chambertin to the south.

## Geography and Terroir

Les Hervelets occupies a position at the northwestern edge of Fixin village, situated on a gentle slope below trees on the Cote d'Or escarpment. The angle of this slope is less pronounced than some of Fixin's other Premier Cru climats, notably Le Clos du Chapitre, resulting in slightly less direct exposure to sunlight during the growing season.

The vineyard is separated from its similar-sounding neighbor, Les Arvelets, by an ancient dry stone wall. Interestingly, wines from Les Arvelets may also take the Les Hervelets vineyard name, but not vice versa, which partly explains why Les Hervelets wines are easier to find despite the plots being similar in size. Les Hervelets is one of only two Premier Crus in Fixin that are not monopoles, the other being Les Arvelets.

## Soil Composition

The soils of Les Hervelets are composed of Kimmeridgian clay over limestone bedrock - the same geological formation that underlies the great vineyards of Chablis. This distinctive soil type provides excellent drainage while retaining sufficient moisture to sustain the vines through dry periods.

The well-drained limestone and marl slopes contribute to wines of notable structure, aromatic lift, and aging potential. The clay content adds body and richness, while the limestone provides the mineral backbone characteristic of fine Burgundy.

## Wine Character

Wines from Fixin are typified by their robust, tannic, and sometimes "sauvage" character, reflecting the appellation's position at the northern reaches of the Cote de Nuits where conditions are slightly cooler and later-ripening. However, Les Hervelets often shows more nuance and finesse than typical Fixin wines, making it particularly prized among the commune's Premier Crus.

The wines display dark fruit, earthy undertones, and firm tannins in youth, requiring patience to show their best. Well-made examples can age for 10-15 years or more, developing complexity while retaining the structural integrity that defines the site.

## Notable Producers

**Domaine Bart** - A respected family estate based in Marsannay and Fixin, known for producing classical, terroir-focused Cote de Nuits wines. Their Les Hervelets bottling is consistently well-regarded.

**Domaine Pierre Gelin** - Historic Fixin producer with significant holdings in the commune's Premier Crus, crafting structured, age-worthy wines.

**Domaine Pierre Naigeon** - Produces elegant, refined expressions of Les Hervelets that emphasize the site's potential for finesse.

**Maison Jaffelin** - Negociant house offering reliable Premier Cru Fixin from Les Hervelets.`
  },

  // 11. France - Burgundy - Cote de Nuits - Marsannay - Les Favieres
  {
    slug: 'france/burgundy/cote-de-nuits/marsannay/les-favieres',
    description: `# Les Favieres

Les Favieres is a distinguished climat within the Marsannay appellation, the northernmost village AOC of the Cote de Nuits. Often called the "gateway to the Cote de Nuits," Marsannay is unique as the only appellation village of Burgundy to produce classified wines of all three colors: red, white, and rose.

## Geography and Terroir

Les Favieres benefits from an east to south-east exposure, positioned mid-slope where it receives optimal sunlight while avoiding the frost risks of lower-lying terrain. The vineyard's aspect and elevation contribute to its reputation for producing wines of notable finesse and elegance.

The commune of Marsannay lies at the transition point between the Cote de Nuits and the outskirts of Dijon, where the famous limestone escarpment begins its southward march toward Gevrey-Chambertin and beyond. This position gives Marsannay wines characteristics that echo their more celebrated neighbors while maintaining their own distinct identity.

## Soil Composition

The terroir of Les Favieres consists of Entroques limestone and Ostrea acuminata marl mixed with gravel cones. This complex soil composition, situated mid-slope, provides excellent drainage while delivering the mineral nutrients essential for producing wine of character and depth.

The limestone-rich soils of the Cote de Nuits result from the geological consequences of the Alpine uplift and the collapse of the Saone plain. The vines are planted on limestone slopes where soils composed of calcareous scree, limestone, and red silt create a large diversity of terroirs that contribute to the distinctive typicity of Cote de Nuits wines.

## Wine Character

Wines from Les Favieres display intense aromas of red and black fruits, undergrowth, wood, and spices. The palate is powerful yet elegant, rich in fruit with firm tannins and a long finish. The terroir is well marked by its finesse and distinctive grain, producing wines that repay cellaring.

Marsannay achieved its own AOC only in 1987, relatively late for Burgundy. Pioneering producers have since demonstrated that sites like Les Favieres deserve recognition among the Cote de Nuits' finest terroirs.

## Notable Producers

**Chateau de Marsannay** - One of the appellation's benchmark producers, farming 0.7 hectares in Les Favieres. Their expression of this climat showcases its potential for structured, aromatic Pinot Noir.

**Domaine Charles Audoin** - Largely responsible for putting Marsannay on the map, Audoin has shown that this appellation, initially considered a less-favorable terroir, is worthy of serious attention. Their Les Favieres is a consistent highlight.

**Domaine Olivier Guyot** - Operating 15 hectares since 1990, with vines averaging 45 years old extending from Marsannay-La-Cote to Vougeot. The Guyot family is one of the oldest in Marsannay, and their Les Favieres expresses this deep understanding of the terroir.

**Domaine Bruno Clair** - Highly regarded producer crafting elegant, age-worthy Marsannay from multiple climats.`
  },

  // 12 & 13. France - Champagne - Coulommes-la-Montagne (both paths)
  {
    slug: 'france/champagne/coulommes-la-montagne',
    description: `# Coulommes-la-Montagne

Coulommes-la-Montagne is a Premier Cru village in the Petite Montagne de Reims, one of Champagne's most distinctive terroirs known for exceptional Pinot Meunier. With 77.1 hectares of vineyards, this small commune was elevated to Premier Cru status in the late 1990s, recognizing the quality of its unique site.

## Geography and Terroir

Situated in the Montagne & Val de Reims: Vesle et Ardre area, Coulommes-la-Montagne occupies a position in the northern reaches of the Champagne appellation. The village lies on the Petite Montagne de Reims, a sub-region celebrated for its Pinot Meunier production. This northerly position means a cold, rainy climate where frost can threaten crops, yet these challenging conditions produce grapes of remarkable character.

The commune borders Vrigny, another Premier Cru village, and together they form an important nucleus of quality-focused viticulture in this part of Champagne.

## Soil Composition

The vineyard soils show typical Champagne characteristics with significant variation across sites. Les Vignes Dieu, in the northern part of the commune, features sandy soils with limestone on the surface. Les Paradis, a southeast-facing site in the northwestern portion near the Vrigny border, offers different expressions. These varied soil types contribute to the complexity possible in wines from this village.

## Wine Character

The plantings in Coulommes-la-Montagne reflect the Petite Montagne's specialty: 65% Pinot Meunier, 21% Chardonnay, 13% Pinot Noir, and 1% other varieties. This Meunier-dominant profile produces Champagnes with distinctive fruitiness, approachability, and aromatic charm, while the Chardonnay and Pinot Noir components add structure and complexity.

The village's Premier Cru status (upgraded from 89% to 90% on the now-retired echelle des crus) reflects the quality potential that dedicated growers extract from these challenging conditions.

## Notable Producers

**Champagne Ponson (Pascal Ponson)** - The family estate is nestled in Coulommes-la-Montagne, now run by Camille and Maxime Ponson with Geraldine Ponson. The vines are carefully cultivated using sustainable methods. Ponson's vineyards are scattered across seven Premier Cru communes, including their home village.

**Jean Servagnat** - Set in the Premier Cru area of Coulommes-la-Montagne, this family house has been established for generations, aiming to reveal the distinctive features of their terroir.

**Champagne Beyssac-Belleaucourt** - Rooted in the Montagne de Reims terroir since the 1800s, with plots classified as Premier Cru that produce wines full of freshness and finesse.

**Roger Coulon** - A high-quality producer and member of the exclusive small grower group Trait-d'union. Led by Eric Coulon, they farm 10 hectares organically (since 2019) across Vrigny, Coulommes-la-Montagne, and other Premier Cru villages.

**Lelarge-Pugeot** - Farming 8.7 hectares across Vrigny, Coulommes-la-Montagne, and Gueux, with organic conversion initiated in 2010.

**Cooperative Vinicole Coulommes Vrigny** - Founded in 1960 with about 100 members and 125 hectares, this unusual cooperative has no employees and no brand of its own.`
  },

  {
    slug: 'france/champagne/montagne-de-reims/coulommes-la-montagne',
    description: `# Coulommes-la-Montagne

Coulommes-la-Montagne is a Premier Cru village in the Petite Montagne de Reims, one of Champagne's most distinctive terroirs known for exceptional Pinot Meunier. With 77.1 hectares of vineyards, this small commune was elevated to Premier Cru status in the late 1990s, recognizing the quality of its unique site.

## Geography and Terroir

Situated in the Montagne & Val de Reims: Vesle et Ardre area, Coulommes-la-Montagne occupies a position in the northern reaches of the Champagne appellation. The village lies on the Petite Montagne de Reims, a sub-region celebrated for its Pinot Meunier production. This northerly position means a cold, rainy climate where frost can threaten crops, yet these challenging conditions produce grapes of remarkable character.

The commune borders Vrigny, another Premier Cru village, and together they form an important nucleus of quality-focused viticulture in this part of Champagne.

## Soil Composition

The vineyard soils show typical Champagne characteristics with significant variation across sites. Les Vignes Dieu, in the northern part of the commune, features sandy soils with limestone on the surface. Les Paradis, a southeast-facing site in the northwestern portion near the Vrigny border, offers different expressions. These varied soil types contribute to the complexity possible in wines from this village.

## Wine Character

The plantings in Coulommes-la-Montagne reflect the Petite Montagne's specialty: 65% Pinot Meunier, 21% Chardonnay, 13% Pinot Noir, and 1% other varieties. This Meunier-dominant profile produces Champagnes with distinctive fruitiness, approachability, and aromatic charm, while the Chardonnay and Pinot Noir components add structure and complexity.

The village's Premier Cru status (upgraded from 89% to 90% on the now-retired echelle des crus) reflects the quality potential that dedicated growers extract from these challenging conditions.

## Notable Producers

**Champagne Ponson (Pascal Ponson)** - The family estate is nestled in Coulommes-la-Montagne, now run by Camille and Maxime Ponson with Geraldine Ponson. The vines are carefully cultivated using sustainable methods. Ponson's vineyards are scattered across seven Premier Cru communes, including their home village.

**Jean Servagnat** - Set in the Premier Cru area of Coulommes-la-Montagne, this family house has been established for generations, aiming to reveal the distinctive features of their terroir.

**Champagne Beyssac-Belleaucourt** - Rooted in the Montagne de Reims terroir since the 1800s, with plots classified as Premier Cru that produce wines full of freshness and finesse.

**Roger Coulon** - A high-quality producer and member of the exclusive small grower group Trait-d'union. Led by Eric Coulon, they farm 10 hectares organically (since 2019) across Vrigny, Coulommes-la-Montagne, and other Premier Cru villages.

**Lelarge-Pugeot** - Farming 8.7 hectares across Vrigny, Coulommes-la-Montagne, and Gueux, with organic conversion initiated in 2010.

**Cooperative Vinicole Coulommes Vrigny** - Founded in 1960 with about 100 members and 125 hectares, this unusual cooperative has no employees and no brand of its own.`
  },

  // 14. France - Roussillon - Collioure
  {
    slug: 'france/roussillon/collioure',
    description: `# Collioure

Collioure is a prestigious Appellation d'Origine Controlee (AOC) for dry wines in the Roussillon region of France, encompassing the scenic Mediterranean coastal communes of Collioure, Port-Vendres, Banyuls, and Cerbere near the Spanish border. The appellation shares its boundaries with the famous Banyuls AOC for fortified wines, and both are renowned for their dramatic terraced vineyards cascading down schist-covered hillsides to the sea.

## Geography and Terroir

The Collioure vineyards occupy one of France's most dramatic viticultural landscapes: steep, terraced slopes rising to 450 meters above the Mediterranean Sea. The terrain is extraordinarily difficult to work, with mechanization nearly impossible on many parcels, requiring meticulous hand labor reminiscent of the great terraced vineyards of the Mosel or Douro.

The constantly buffeting winds from the Mediterranean combine with steep slopes and very poor soils to make grape production challenging, yet these same conditions concentrate flavors and produce wines of exceptional character. The region receives abundant sunshine while sea breezes moderate temperatures during the growing season.

## Soil Composition

The defining feature of Collioure's terroir is its schist soils. Near the sea and rivers, alluvial soils predominate, but the finest vineyards occupy the higher slopes where gravel, limestone, and especially schist create wines of intensity and depth. The schist's excellent drainage forces vine roots deep into the rock, accessing minerals and water reserves that sustain the plants through dry Mediterranean summers.

The poor fertility of these soils naturally limits yields, often among the lowest in France, concentrating flavors in the grapes. Vines are trained as bush vines (gobelet), which combined with their age contributes to the remarkable concentration found in Collioure wines.

## Wine Character

Collioure produces powerful dry red, rose, and white wines from France's most southerly vineyards. Reds account for approximately 55% of production, with rose at 30% and whites the remainder.

Red Collioure is made from Grenache Noir, Mourvedre, Syrah, Carignan, and Cinsaut, displaying intensely ripe fruit aromas and elements of spice. The whites, from Grenache Blanc and Grenache Gris, are among France's richest: full-bodied and deeply perfumed.

## Notable Producers

**Domaine du Mas Blanc** - One of the classiest producers in both Collioure and Banyuls, with three Collioure cuvees that rival their Banyuls wines in complexity.

**Clos de Paulilles** - With origins dating to the 1800s, purchased in 2012 by Domaine de Cazes, France's largest biodynamic certified winery. Known for steady, reliable quality.

**Coume del Mas** - Their "Quadratur" cuvee is one of the most exciting in Collioure, showing fantastic complexity and up to 10 years' aging potential.

**Domaine la Tour Vielle** - Their Collioure offerings often exceed their Banyuls examples in acclaim.

**Domaine Madeloc (Pierre Gaillard)** - The estate was rebuilt in 2002 by renowned Rhone winemaker Pierre Gaillard, combining Banyuls tradition with Northern Rhone techniques.

**Domaine de la Casa Blanca** - Created in 1870 in Banyuls-sur-Mer, one of the oldest domaines in the AOC, with 8 hectares of vines aged 70 to 100 years.`
  },

  // 15. France - Southern Rhone - Beaumes-de-Venise
  {
    slug: 'france/southern-rhone/beaumes-de-venise',
    description: `# Beaumes-de-Venise

Beaumes-de-Venise is a Cotes du Rhone Cru appellation in the southern Rhone Valley, situated in the foothills of the dramatic Dentelles de Montmirail limestone peaks. The village is famous for two distinct wine types: the celebrated Muscat de Beaumes-de-Venise Vin Doux Naturel and powerful red wines granted Cru status in 2005.

## Geography and Terroir

Located 26 kilometers from Avignon in the Vaucluse department of Provence, Beaumes-de-Venise occupies a privileged position where the jagged limestone peaks of the Dentelles de Montmirail (meaning "lace of Montmirail") provide both protection from the Mistral wind and a natural heat reflector. The warmth of the sun radiates down from these massive vertical limestone slabs over the vines below.

The name "de Venise" derives not from Italy but from "Comtat Venaissin" (Comtat Avignonnais), which was once part of the Papal States. Greek mariners who founded Marseille in 600 BC are believed to have developed Beaumes-de-Venise as a spa resort and introduced the star white grape Muscat Blanc a Petits Grains.

## Soil Composition

Beaumes-de-Venise's terroir comprises three major soil types, each producing distinct wine expressions:

**Terres du Trias (Triassic Soil)** - The most remarkable formation, these ancient soils from the earliest Mesozoic era were brought to the surface as the Dentelles emerged, creating a compressed formation unique to the Rhone Valley known as the Suzette Diapir. These soils give rich, supple wines with excellent aging potential.

**Terres Blanches (Cretaceous White Soil)** - Found around La Roque-Alric, composed of calcareous clay and marl. The parent rock is greyish with red iron touches. Vines here produce fine, fruity, and aromatic wines.

**Terres Grises (Jurassic Grey Soil)** - Located north of Lafare against the Dentelles' southeastern slopes, composed of Oxfordian black marl (silt, clay, and sand). The east to southeast exposure produces wines of powerful style.

## Wine Character

The red wines, made from Grenache Noir (minimum 50%), Syrah (25%), Mourvedre, and other permitted varieties, display complex aromatic palettes of ripe red and black fruits (cherry, blackberry, blackcurrant) complemented by spicy notes and garrigue accents. The palate shows structure and roundness with fine yet present tannins, balanced between power and freshness with persistent finish and good aging potential.

The famous Muscat de Beaumes-de-Venise VDN is made exclusively from Muscat Blanc a Petits Grains, producing intensely aromatic, lusciously sweet wines.

## Notable Producers

Over 100 producers including fifteen domaines and a cooperative winery maintain the appellation's standards.

**Domaine de Durban** - Jacques Leydier bought the property in the 1960s; today Henri and Philippe Leydier produce some of the Southern Rhone's most memorable wines.

**Domaine des Bernardins** - Respected producer of both VDN Muscat and red Beaumes-de-Venise.

**Rhonea** - This cooperative of artisan winegrowers has produced exceptional terroir wines since 1956.

**Domaine de la Cheneraie** - Featuring south-facing vineyards at the highest location above the village (around 1,200 feet), producing highly expressive and mineral wines.`
  },

  // 16. Germany - Mosel - Mittelmosel - Piesporter Domherr
  {
    slug: 'germany/mosel/mittelmosel/piesporter-domherr',
    description: `# Piesporter Domherr

Piesporter Domherr is a legendary vineyard enclave within the famous Piesporter Goldtropfchen, representing the ancient and original core of this celebrated site. At only 4-5 hectares, it is one of the smallest single vineyards in the entire Mosel, yet produces some of the region's most distinctive and age-worthy Rieslings.

## Geography and Terroir

The Domherr lies in the heart of the Piesporter Goldtropfchen, facing due south at approximately 150 meters above sea level. This privileged position directly along the Mosel River creates a natural mirror effect, with sunlight reflecting off the water to provide optimum conditions for grape ripening throughout the growing season.

The vineyard orientation of south to south-southeast maximizes sun exposure during the crucial ripening period. This is the core of the old Goldtropfchen, before modern boundary expansions altered the historic limits of this famous site.

Piesport itself is one of the oldest wine villages on the Moselle, with viticulture dating to Roman times. A wine press excavated in 1985 in the middle of the Piesporter Goldtropfchen - the largest north of the Alps - testifies to nearly two millennia of winemaking history.

## Soil Composition

The stony, deep slate soil of Piesporter Domherr is interspersed with quartz, providing excellent drainage while retaining and radiating heat. The high proportion of fine earth combined with the extensive forest above the rocky outcrop ensures excellent water supply even in dry years.

The blue-grey Devonian slate, soft, light, and stony, is particularly adept at absorbing the sunshine reflected by the Mosel River onto the steep south-facing slopes. In challenging vintages, vine roots can draw from water and mineral reserves stored deep in the rock layers.

## Wine Character

Due to their pronounced character, wines from Domherr can easily be distinguished from those of the broader Goldtropfchen. Domherr produces very aromatic Rieslings with full body and ripe flavors, though the wines often need time in bottle to fully reveal their potential.

The mineral-driven character reflects the unique terroir of Piesport's steep vineyards. The combination of optimal sun exposure, heat-retaining slate, and temperature-moderating river influence creates Rieslings of remarkable intensity, precision, and longevity. The finest examples can age gracefully for decades.

## Notable Producers

**Weingut Weller-Lehnert** - Produces a Grosses Gewachs (Grand Cru level) Riesling from Piesporter Domherr, recognized as one of the site's finest expressions.

**Weingut Reinhold Haart** - Among the Mosel's most celebrated estates, with exceptional holdings in Piesport's top sites.

**Weingut Julian Haart** - Crafting precise, terroir-focused Rieslings that showcase the distinctive character of Piesport.

**Weingut St. Urbans-Hof** - Quality producer with access to fruit from this prestigious enclave.`
  },

  // 17. Germany - Wurttemberg - Roter Berg
  {
    slug: 'germany/wurttemberg/roter-berg',
    description: `# Roter Berg

Roter Berg ("Red Mountain") is a single vineyard (Einzellage) in the municipality of Schozach within the Wurttemberger Unterland, Germany's most important sub-region for red wine production. The name references the iron-rich red soils that characterize this distinctive site.

## Geography and Terroir

Roter Berg lies within the Wurttemberg wine region, which covers 11,461 hectares in the state of Baden-Wurttemberg, stretching between Lake Constance and the Tauber valley below Rothenburg. The Wurttemberger Unterland area, where Roter Berg is located, is by far the largest and most important sub-region, divided into nine collective vineyard sites.

The vineyards of this area are mainly located in the middle and lower Neckar valley, fragmented into many small areas east of the Neckar along the Bottwar, Murr, and Schozach tributaries. The Schozach valley, where Roter Berg sits, benefits from protection provided by surrounding hills while receiving ample sunshine during the growing season.

## Soil Composition

The name "Roter Berg" directly references the vineyard's distinctive iron-rich red soils. Wurttemberg's diverse geology includes several distinctive soil types: Muschelkalk (shell limestone) from ancient sea beds, Bunter Mergel (colored marls) in various hues, and Schilfsandstein (reed sandstone) from the Keuper formation.

The red-colored soils of Roter Berg are particularly well-suited to the production of robust red wines, providing excellent drainage while retaining sufficient warmth to ripen the region's favored varieties.

## Wine Character

Wurttemberg is unusual among German wine regions for its focus on red wine production - a majority of plantings are dedicated to red varieties. The most popular grape is Trollinger, accounting for over 20% of vineyard surface, though this traditional variety is increasingly joined by more internationally recognized grapes.

Grand Cru-level sites like Roter Berg are often planted with Spatburgunder (Pinot Noir) and Lemberger (Blaufranksich), producing wines of exceptional concentration and finesse. The warm Wurttemberg climate, moderated by the Swabian Alps to the south, allows red grapes to achieve full physiological ripeness while retaining refreshing acidity.

## Regional Context

Much of Wurttemberg is nestled in the foothills of the Swabian Alb, a highland region that rose from the Jurassic Sea millions of years ago. This unique geological history has created the diverse soil types that give Wurttemberg wines their distinctive regional character.

The Wurttemberg wine region comprises six areas with 17 large vineyards and 207 single vineyards, each differing significantly in landscape, soils, and climatic influences. This diversity leads to a wide variety of wine styles within the overall regional character.`
  },

  // 18. Italy - Piedmont - Barbaresco - Barbaresco - Cavanna
  {
    slug: 'italy/piedmont/barbaresco/barbaresco/cavanna',
    description: `# Cavanna

Cavanna is a Menzione Geografica Aggiuntiva (MGA) vineyard within the village of Barbaresco itself, tucked just below the historic castle that gives the commune its name. As one of the subzones closest to the village center, Cavanna occupies a privileged natural amphitheatre with sweeping views across the Tanaro River valley to the Roero beyond.

## Geography and Terroir

Cavanna forms a natural amphitheatre immediately below Barbaresco's medieval tower, ending at the sheer cliffs along the Tanaro River. The vineyard's position at this dramatic dropoff creates a unique microclimate, as air currents from the river contribute to temperature moderation and disease prevention.

The exposure ranges from west to southwest, providing afternoon and evening sun that helps grapes achieve optimal ripeness while avoiding the intense morning heat that can stress vines during summer. This orientation is particularly favorable for Nebbiolo, which requires a long growing season to fully develop its complex aromatic compounds.

## Soil Composition

The soils of Cavanna are composed of laminated Sant'Agata Fossili marls mixed with silt, typical of the Barbaresco zone. The white soils contain significant limestone content with layers of clay, providing both excellent drainage and sufficient water retention during dry periods.

This combination of sand and clay produces the red-cherry fruit character and fine tannin structure that make Cavanna wines particularly approachable and popular, while still maintaining the structure necessary for meaningful aging.

## Wine Character

Nebbiolo from Cavanna displays the classic Barbaresco profile with particular emphasis on red fruit characteristics. The natural amphitheatre's terroir produces wines with fine tannins and accessible charm, yet with sufficient structure to develop beautifully over 10-15 years of cellaring.

The site performs comparably to many of Barbaresco's most prolific crus, though it remains less well-known than neighbors like Asili or Rabaja. This relative obscurity offers value-conscious collectors access to high-quality vineyard-designated Barbaresco.

## Notable Producers

**Luigi Giordano** - The dominant force in Cavanna, owning the heart of the vineyard and producing the only commercially available single-vineyard Cavanna bottling. The winery was established by Giovanni Giordano in the 1930s, with son Luigi making the bold decision to vinify his own fruit and bottling the first wine under his own label in 1958.

The Cavanna vineyard holds particular significance for the Giordanos, as it was the first to be vinified as a single vineyard by Luigi in 1971. The current release showcases 65-year-old vines in an elegant, hands-off winemaking style.

**Other Producers** - Prominent neighbors inside the cru include Angelo Gaja, Moccagatta, and De Forville, though none currently bottle a single-vineyard Cavanna designation, making Luigi Giordano's bottling truly unique.`
  },

  // 19. Italy - Piedmont - Barbaresco - Barbaresco - Faset
  {
    slug: 'italy/piedmont/barbaresco/barbaresco/faset',
    description: `# Faset

Faset is a Menzione Geografica Aggiuntiva (MGA) within the commune of Barbaresco, known for producing wines of surprising complexity and finesse. While not among the most famous crus of the appellation, Faset has earned respect among critics and collectors for consistently delivering Barbaresco of notable character and aging potential.

## Geography and Terroir

Faset occupies slopes within the commune of Barbaresco, one of the four townships (along with Neive, Treiso, and San Rocco Seno d'Elvio) permitted to produce wines under the Barbaresco DOCG. The "Bricco" or crest of the vineyard represents the most coveted parcels, with only the owner of these hilltop vines permitted to use the "Bricco" or "Bric" designations on their labels.

The unique qualities of wines from Faset stem from its specific soil composition, terrain orientation, and exposure to prevailing winds - the same factors that differentiate all of Barbaresco's micro-terroirs.

## Soil Composition

The soils of the Barbaresco zone are composed primarily of calcareous marl dating from the Tortonian epoch. Beginning in the late 19th century, there have been attempts to classify the area's vineyards into Burgundian-style crus based on which areas produced the finest wines. Luigi Veronelli created one such influential list in the 1960s.

Faset's marls contribute to wines that display both power and elegance, with sufficient structure for extended aging while maintaining the aromatic lift characteristic of quality Barbaresco.

## Wine Character

Wines from Faset typically display bright red fruit aromatics, developing more complex notes of underbrush and tea with age. On the palate, herbal qualities mingle with dark and red fruit flavors, creating wines of sneaky complexity that often outperform expectations.

The site produces Barbaresco that beautifully showcases the natural patchwork of micro-terroirs that define this appellation. Well-made examples reward patience, developing additional nuance over 10-15 years in bottle.

## Notable Producers

**La Spinona (Berutti)** - The estate's best Barbaresco cru comes from the Faset vineyard area, where Berutti owns the prized "Bricco" or crest of the vineyard. La Spinona uses only organic farming practices and was one of the first Piedmont estates to obtain organic certification in the 1980s.

The estate is famous for producing their own natural fertilizer and maintaining traditional viticultural practices. The Spinona is a special breed of Piedmontese hunting dog that the Beruttis raise - a particular dog named Baica earned her place of honor on the label for saving the family's only son from drowning.

**Piercarlo Culasso** - Produces a Barbaresco Faset "Duesoli" bottling that has earned critical praise for its complexity and expression of terroir.`
  },

  // 20. Italy - Piedmont - Barbaresco - Treiso - Vallegrande
  {
    slug: 'italy/piedmont/barbaresco/treiso/vallegrande',
    description: `# Vallegrande

Vallegrande is a medium-sized cru (MGA) within the commune of Treiso, the highest-elevation area of the Barbaresco DOCG. The vineyard produces austere, deep, and complex Barbarescos with a distinctive tannic texture, representing an authentic expression of Treiso's elevated terroir.

## Geography and Terroir

Vallegrande runs from the bottom of the hill at approximately 270 meters (900 feet) above sea level up to nearly 400 meters (1,300 feet) at the crown, making it one of the higher-altitude sites within Barbaresco. This elevation range creates varying conditions across the vineyard, with cooler temperatures and later harvests at higher elevations.

Treiso represents the highest portion of the Barbaresco zone, where altitude provides natural temperature moderation during hot vintages while demanding careful site selection to ensure full ripeness in cooler years. The vineyard faces predominantly west, receiving afternoon and evening sun that extends the ripening period.

## Soil Composition

The soils of Vallegrande are predominantly white with a high percentage of sand, imparting freshness, minerality, and a distinct savoriness typical of this MGA. The bluish clayey-limestone marl provides structure and water retention, essential for sustaining vines through the warmest months.

This soil composition, typical of the finer Treiso sites, produces wines with characteristic nervous acidity and mineral tension that distinguish them from the richer, rounder expressions of lower-altitude Barbaresco communes.

## Wine Character

Vallegrande gives life to austere, deep Barbarescos with complex tannic textures that demand patience. The aromatic profile points to the earthy aspect of Nebbiolo: citric thyme, Mediterranean scrub, tobacco leaves, and blood orange characterize wines from this site.

A nervy quality to the acidity is often found in wines from Treiso terroirs, and Vallegrande exemplifies this trait. These are wines built for long cellaring, often requiring 10-15 years to fully express their potential while aging gracefully for several decades in optimal conditions.

## Notable Producers

**Ca' del Baio** - Vallegrande represents the estate's home vineyard, the Barbaresco first vinified as a single plot by grandfather Ernesto in 1965. Today, sisters Paola, Valentina, and Federica lead this winemaking project. The estate farms 3 hectares of west-facing vines on marl and limestone soils at 300-400 meters elevation.

The 2018 vintage marked the first release of their Barbaresco Vallegrande Riserva Viti Vecchie, made from the oldest vines in the vineyard.

**Fratelli Grasso** - The Grasso brothers have been making wine since before founding Azienda Agricola in 1970, farming the same land for 50 years. Their flagship Vallegrande receives a minimum of 30 months (up to 48 months) of aging in large old barrels, producing wines of structure and complexity.

**Other Producers** - Several other quality-focused estates work with fruit from Vallegrande, contributing to the cru's growing reputation among Barbaresco connoisseurs.`
  },

  // 21. Italy - Piedmont - Barolo - Monforte d'Alba - Mosconi
  {
    slug: 'italy/piedmont/barolo/monforte-d-alba/mosconi',
    description: `# Mosconi

Mosconi is one of the most respected Menzione Geografica Aggiuntiva (MGA) vineyards in Monforte d'Alba, a commune at the southeastern reaches of the Barolo zone known for producing powerful, long-aging wines. The vineyard's growing reputation among collectors reflects the exceptional quality of Nebbiolo from this site.

## Geography and Terroir

Mosconi sits in the southern part of the Barolo zone, just east of the town of Monforte d'Alba, within a cluster of prestigious sites that includes Ginestra, Coste di Monforte, and Ravera di Monforte. The vineyard soil is rich in minerals and tufo (volcanic tite) with excellent southwestern exposition, providing optimal sun exposure for ripening Nebbiolo to full maturity.

Monforte d'Alba is home to only 11 MGAs despite hosting 53 wineries, reflecting the concentration of vineyard ownership and the commune's reputation for powerful, age-worthy Barolo. The MGA system, implemented throughout Barolo in 2010, was applied less rigorously in Monforte than elsewhere, meaning site designations here carry particular significance.

## Soil Composition

Much of Monforte's soil composition resembles that of neighboring Serralunga, with predominantly Serravallian (formerly called Helvetian) soils that characterize the eastern portion of the Barolo zone. These older soils force vine roots deeper, extracting more minerals and producing wines with more robust tannins than those from the younger Tortonian soils of western communes like La Morra.

The tufo content in Mosconi contributes additional mineral complexity and structure to the wines, while the excellent drainage typical of hillside sites ensures concentrated fruit character.

## Wine Character

Barolo from Mosconi is typically fragrant and minerally with firm structure built for aging. The wines display the power and structure characteristic of Monforte while maintaining aromatic complexity and elegance. Well-made examples require 10-15 years to approach maturity and can age gracefully for 25-30 years or more.

The site has been growing in reputation as more producers recognize its potential for outstanding single-vineyard Barolo.

## Notable Producers

**E. Pira & Figli (Chiara Boschis)** - One of Barolo's most acclaimed small producers, with vines in Mosconi among their holdings. Chiara Boschis crafts elegant, terroir-focused wines.

**Parusso** - The brother and sister team of Tiziana and Marco Parusso cultivate 28 hectares across several prized Monforte sites including Mosconi, Le Coste-Mosconi, Bussia, and Mariondino. Their vineyards sit at 300-400 meters elevation on predominantly calcareous clay soils.

**Elio Grasso** - Among Monforte's most respected producers, farming exceptional sites including Mosconi.

**Rocca Giovanni** - The estate lists Mosconi among their main vineyard assets alongside Pianromualdo, Sant'Anna, and Ravera di Monforte.

**Piero Benevelli** - Produces Barolo from Mosconi and other prestigious Monforte sites.

**Poderi Aldo Conterno** - Legendary estate with holdings in the commune's finest vineyards.`
  },

  // 22. Italy - Piedmont - Barolo - Novello - Sottocastello di Novello
  {
    slug: 'italy/piedmont/barolo/novello/sottocastello-di-novello',
    description: `# Sottocastello di Novello

Sottocastello di Novello ("Below the Castle of Novello") is a prestigious MGA (Menzione Geografica Aggiuntiva) in the commune of Novello, at the far southwestern corner of the Barolo zone. This highly prized site beneath the village castle produces powerful, austere Barolo capable of remarkable longevity.

## Geography and Terroir

The vineyard lies on the "sotto castello" (below the castle) position facing south to south-southwest at an average altitude of 400 meters above sea level. This elevated position in Novello, combined with the commune's proximity to the Cottian Alps to the south, creates one of the coolest climates of any Barolo commune.

While the wines of Novello were historically among the most unrelenting and tannic, climate change has brought greater ripeness and elegance to modern vintages. The combination of high altitude, cooling Alpine winds, and excellent south-facing exposure now produces Barolo that balances power with refinement.

## Soil Composition

The fairly deep limestone soil has medium consistency with good drainage. The vineyard is divided between marly soils in the main portion and higher tufa and limestone content in the southernmost section, which is less fertile and produces more concentrated wines.

Vines are planted at a density of 4,500 per hectare and trained on vertical trellises using Guyot pruning. This moderate density allows adequate spacing for the vigorous growth typical of deeper soils while maintaining the vine stress necessary for quality wine production.

## Wine Character

Sottocastello di Novello produces powerful, austere Barolo that needs lengthy aging to release its full potential. The wines reward patience with a rich, varied bouquet combining ethereal overtones with fresher, fruitier notes.

The cooler climate of Novello preserves aromatic intensity and acidity while the excellent south-facing exposition ensures full phenolic ripeness. These characteristics create wines of notable balance between power and freshness, capable of aging gracefully for decades.

## Notable Producers

**Le Ginestre** - Although based in Grinzane Cavour, Le Ginestre's Barolo vineyard in Sottocastello di Novello at 400 meters elevation on deep limestone soils produces one of their finest wines. Initial plantings occurred in 1999 and 2002.

**Ca' Viola** - Beppe Caviola's prestigious estate purchased an excellent parcel in Sottocastello di Novello, with results that continue to improve. Their Barolo Sottocastello di Novello '15 earned acclaim for its harmony and pure expression of Nebbiolo.

**Piazzo** - The estate reserves its oldest Nebbiolo vines here for their Barolo DOCG Riserva "Sottocastello di Novello," selected for the vineyard's capacity to produce powerful, austere wines requiring lengthy aging.

**Mauro Marengo** - Quality-focused producer crafting terroir-expressive wines from this site.

**Le Strette** - Another respected Novello producer with holdings in this prestigious MGA.

**Elvio Cogno** - Among Novello's most acclaimed estates, producing wines of finesse and structure.`
  },

  // 23. Italy - Piedmont - Barolo - Verduno - Ascheri
  {
    slug: 'italy/piedmont/barolo/verduno/ascheri',
    description: `# Ascheri

The Ascheri vineyard lies in the commune of La Morra within the Barolo DOCG, representing one of the historic sites farmed by the Ascheri family, whose winemaking heritage dates to the 19th century. While the family also maintains significant holdings in Verduno, Serralunga d'Alba, and other communes, this eponymous vineyard remains central to their identity and production.

## Geography and Terroir

The Ascheri estate's history began in the 19th century in the La Morra area, where a plot of land named Ascheri still exists today as the site of their first vineyard plantings. The western Barolo communes, including La Morra and nearby Verduno, are primarily composed of younger Tortonian soils, which produce wines of elegance and aromatic complexity compared to the more powerful expressions from eastern communes.

In 1880, the family moved their winery to Bra, northwest of the Barolo zone, strategically positioned for access to Turin and its important wine market. From this base, they expanded with acquisitions in Serralunga d'Alba, Verduno, and Bra.

## Soil Composition

The Tortonian soils of La Morra and the western Barolo zone are younger than the Serravallian formations found in eastern communes like Serralunga. These soils produce wines emphasizing elegance, perfume, and approachability rather than the robust tannins and power characteristic of older soil types.

The specific composition varies across the Ascheri family's holdings, allowing them to create blended wines that capture multiple expressions of Barolo terroir, or single-vineyard bottlings that showcase individual site character.

## Wine Character

The Ascheri Barolo tradition emphasizes blending across their three village holdings: 50% from Serralunga d'Alba (providing power), 40% from La Morra (contributing elegance), and 10% from Verduno (adding aromatic complexity). This approach creates a balanced, complete expression of Barolo's diverse terroirs.

Since 1999, the estate has also released single-vineyard Barolos from their best sites: Pisapola (Verduno), Sorano (Serralunga d'Alba), Coste e Bricco (Serralunga d'Alba), and from 2010, the Ascheri vineyard itself in La Morra.

## Notable Producers

**Ascheri (Cantine Ascheri Giacomo)** - The family estate is now run by Cristina Ascheri with her son Matteo (who took over from his father Giacomo in 1988), alongside longtime enologist Giuliano Bedino (since 1996) and Matteo's son Giuseppe. Notably, Matteo Ascheri currently serves as Presidente of the Consorzio of Barbaresco & Barolo growers.

The estate farms 16 hectares of Nebbiolo da Barolo vineyards across La Morra, Verduno, and Serralunga d'Alba. Between La Morra and Verduno, the vineyards of Rivalta at 350 meters elevation grow Nebbiolo, Barbera, Dolcetto, and the rare Pelaverga.

Single-vineyard Barolos are only made in exceptional years - most recently in 2010, 2013, 2015, 2016, and forecast for 2019. The cru wines take the first selection from their respective vineyards, while the annata takes Nebbiolo from younger vines.`
  }
]

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')

  console.log('='.repeat(60))
  console.log('Fix Template Regions with Real Content')
  console.log('='.repeat(60))
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`)
  console.log(`Regions to update: ${regionUpdates.length}`)
  console.log()

  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  console.log('Connected to database')
  console.log()

  try {
    let successCount = 0
    let notFoundCount = 0
    let errorCount = 0

    for (const update of regionUpdates) {
      console.log(`Processing: ${update.slug}`)

      if (dryRun) {
        console.log(`  [DRY RUN] Would update with ${update.description.length} characters`)
        successCount++
        continue
      }

      try {
        // Try full_slug first
        let result = await client.query(
          `UPDATE regions SET description = $1, updated_at = NOW() WHERE full_slug = $2 RETURNING id, name`,
          [update.description, update.slug]
        )

        if (result.rowCount === 0) {
          // Try slug without the leading path
          const shortSlug = update.slug.split('/').pop()
          result = await client.query(
            `UPDATE regions SET description = $1, updated_at = NOW() WHERE slug = $2 RETURNING id, name`,
            [update.description, shortSlug]
          )
        }

        if (result.rowCount === 0) {
          // Try finding by name
          const name = update.slug.split('/').pop()?.replace(/-/g, ' ')
          result = await client.query(
            `UPDATE regions SET description = $1, updated_at = NOW() WHERE LOWER(name) = LOWER($2) RETURNING id, name`,
            [update.description, name]
          )
        }

        if (result.rowCount && result.rowCount > 0) {
          console.log(`  ✓ Updated: ${result.rows[0].name} (ID: ${result.rows[0].id})`)
          successCount++
        } else {
          console.log(`  ? Region not found: ${update.slug}`)
          notFoundCount++
        }
      } catch (error: any) {
        console.log(`  ✗ Error: ${error.message}`)
        errorCount++
      }
    }

    console.log()
    console.log('='.repeat(60))
    console.log('Summary')
    console.log('='.repeat(60))
    console.log(`Success: ${successCount}`)
    console.log(`Not found: ${notFoundCount}`)
    console.log(`Errors: ${errorCount}`)

  } finally {
    await client.end()
    console.log('\nDatabase connection closed')
  }
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
