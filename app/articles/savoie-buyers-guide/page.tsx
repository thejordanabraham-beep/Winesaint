import Link from 'next/link';

export default function SavoieBuyersGuideArticle() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b-3 border-[#1C1C1C] bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#722F37]">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <Link href="/articles" className="text-gray-500 hover:text-[#722F37]">
              Articles
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#1C1C1C]">Savoie Buyer's Guide</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <div className="bg-gradient-to-br from-[#2a9d8f] to-[#6d597a] py-16 border-b-3 border-[#1C1C1C]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <span className="inline-block px-3 py-1 bg-[#f4d35e] text-[#1C1C1C] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Buying Guide
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl italic text-white leading-tight mb-6">
            A Wine Buyer's Guide to Savoie: France's Alpine Secret
          </h1>
          <div className="flex items-center gap-4 text-sm text-white/80">
            <span>By Wine Saint Editorial</span>
            <span>•</span>
            <span>January 27, 2026</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl leading-relaxed text-gray-700 mb-8">
            Savoie is France's wine world kept secret—a region where ancient glaciers carved out perfect vineyard sites, where grapes you've never heard of produce wines you'll never forget, and where 2,050 hectares of vines punch far above their weight class.
          </p>

          <p className="text-xl leading-relaxed text-gray-700 mb-12">
            This is not your Instagram-ready wine region. There are no rolling hills of manicured vines, no 18th-century châteaux with English-speaking tour guides. This is alpine viticulture at its most unforgiving: steep limestone slopes, glacial moraines, elevation changes that make Burgundy look flat. The vines grow where nothing else will, clinging to the bones of the Alps.
          </p>

          <div className="bg-[#2a9d8f]/20 border-l-4 border-[#2a9d8f] p-6 my-8">
            <p className="font-semibold text-[#1C1C1C] mb-2">
              Jancis Robinson's Assessment
            </p>
            <p className="text-gray-700 mb-0">
              Jancis Robinson has called Savoie "the next Jura." That's both accurate and misleading. Accurate because Savoie shares Jura's obsession with rare indigenous grapes and hands-off winemaking. Misleading because Savoie's wines are fundamentally different: crisper, more mineral, laser-focused rather than oxidative or funky.
            </p>
          </div>

          <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-12 mb-6">
            The Region: Location, Climate, and Why It Matters
          </h2>

          <p>
            Savoie sits in eastern France, pressed against the Swiss and Italian borders in the Auvergne-Rhône-Alpes region. The vineyards are scattered across four departments—Savoie (80%), Haute-Savoie (8%), Isère (8%), and Ain (4%)—in roughly 20 fragmented pockets separated by mountains, lakes, and towns.
          </p>

          <p>
            This is France's only truly alpine wine region. Elevations range from 200 to 500+ meters. The vines are surrounded by Lake Geneva (Lac Léman), Lake Bourget, Lake Annecy, and the Rhône River. Mont Blanc looms to the east.
          </p>

          <p className="font-semibold text-[#1C1C1C] mt-6">
            The Soils
          </p>

          <p>
            The diversity of soil types is staggering for such a small region:
          </p>

          <ul>
            <li>Limestone scree from ancient rockfalls (famously in Apremont and Abymes, from the 1248 Mont Granier landslide)</li>
            <li>Glacial moraines</li>
            <li>Clay-limestone mixtures</li>
            <li>Molasse (sedimentary rock)</li>
            <li>Alluvial river deposits</li>
          </ul>

          <p>
            These thin, poor soils force vines to struggle—low vigor, low yields, concentrated fruit.
          </p>

          <div className="bg-[#f4d35e]/20 border-l-4 border-[#f4d35e] p-6 my-8">
            <p className="font-semibold text-[#1C1C1C] mb-2">
              Production Scale
            </p>
            <p className="text-gray-700 mb-0">
              Savoie represents less than 1% of France's total wine production. That's approximately 11 million bottles annually from 2,050 hectares. For comparison, Sancerre alone produces 22 million bottles. About 70% of production is white, 20% red, 7% rosé, and 3% sparkling. Only about 12% is exported outside France.
            </p>
          </div>

          <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-12 mb-6">
            The Grapes: What You Need to Know
          </h2>

          <p>
            Savoie permits 23 grape varieties across its appellations, but a handful dominate. This is a region defined by grapes that grow almost nowhere else.
          </p>

          <h3 className="font-serif text-2xl italic text-[#722F37] mt-8 mb-4">
            Jacquère (40-50% of plantings)
          </h3>

          <p>
            This is Savoie's workhorse white grape, the one you'll encounter most often. Jacquère produces crisp, mineral-driven whites with high acidity, notes of green apple, white flowers, pear, and citrus, and occasionally a subtle herbal or grassy quality.
          </p>

          <p>
            Jacquère wines are meant for early drinking—most should be consumed within 2-3 years. Think of Jacquère as Savoie's Muscadet—bright, bracing, mineral, food-friendly, inexpensive. Not profound, but perfectly suited to its purpose.
          </p>

          <p>
            <strong>Best crus:</strong> Apremont, Abymes, Chignin, Jongieux, Cruet
          </p>

          <h3 className="font-serif text-2xl italic text-[#722F37] mt-8 mb-4">
            Altesse (Roussette) (10-15% of plantings)
          </h3>

          <p>
            Altesse is Savoie's noble white grape. Also known as Roussette, it produces the region's most complex and age-worthy whites.
          </p>

          <p>
            Young Altesse shows bergamot, pineapple, peach, quince, fresh almonds, and white flowers. With 3-5 years of age (and these wines can go 10+ years), you get honey, hazelnuts, toast, beeswax, and sometimes white truffle.
          </p>

          <p>
            The acidity is vibrant, the texture richer than Jacquère, the finish longer. These are serious wines that reward patience.
          </p>

          <p>
            <strong>Best crus:</strong> Frangy, Marestel, Monthoux, Monterminod (the four Roussette de Savoie crus)
          </p>

          <p>
            If Jacquère is Muscadet, Altesse is Chenin Blanc from Savennières—structured, complex, built to age.
          </p>

          <h3 className="font-serif text-2xl italic text-[#722F37] mt-8 mb-4">
            Roussanne (locally called Bergeron)
          </h3>

          <p>
            Roussanne from the Rhône Valley found a tiny niche in Savoie, specifically in Chignin, where it's known as Bergeron.
          </p>

          <p>
            Chignin-Bergeron produces rich, aromatic whites with honey, apricot, quince, grilled almonds, mango, and beeswax. The wines have firm acidity despite their opulence, and they age beautifully for 10+ years.
          </p>

          <p>
            These are Savoie's most Rhône-like whites—fuller-bodied, riper, more exotic than Jacquère or Altesse.
          </p>

          <p>
            <strong>Best source:</strong> Chignin-Bergeron (exclusive appellation)
          </p>

          <h3 className="font-serif text-2xl italic text-[#722F37] mt-8 mb-4">
            Gringet (rare)
          </h3>

          <p>
            Gringet is the ghost grape of Savoie—grown almost exclusively in the remote northern cru of Ayze, and only by a handful of producers.
          </p>

          <p>
            The late Dominique Belluard spent decades championing Gringet, producing both still and sparkling wines that showcased the grape's citrus peel, green apple, fresh herbs, and striking alpine minerality. Since his death in 2021, the estate (now Domaine du Gringet under Vincent Ruiz) continues his work.
          </p>

          <p>
            Gringet wines are nervy, crystalline, precise—like licking wet granite, as one writer described them.
          </p>

          <h3 className="font-serif text-2xl italic text-[#722F37] mt-8 mb-4">
            Mondeuse (15-20% of plantings)
          </h3>

          <p>
            Mondeuse is Savoie's flagship red grape, described by Roman writer Columella as "the grape variety that ripens amidst the snow."
          </p>

          <p>
            DNA testing confirms Mondeuse is related to Syrah, and the family resemblance shows: dark color, peppery spice, herbal notes, firm tannins. But Mondeuse is lighter-bodied than Syrah, with brighter acidity, more pronounced floral aromatics (violet), and flavors of red currant, raspberry, wild strawberry, black plum, and white pepper.
          </p>

          <p>
            Young Mondeuse can be rustic and tannic. With 5-10 years of age, the wines develop complexity: undergrowth, game, earth, leather, dried herbs. The best examples can age 20+ years.
          </p>

          <p>
            <strong>Best crus:</strong> Arbin (the spiritual home of Mondeuse), Saint-Jean-de-la-Porte, Chautagne
          </p>

          <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-12 mb-6">
            The Producers: Who to Buy
          </h2>

          <p>
            Savoie has seen a generational shift over the past 20 years. A group of producers—many working organically or biodynamically—have elevated the region from ski-resort obscurity to somm-list relevance.
          </p>

          <h3 className="font-serif text-2xl italic text-[#722F37] mt-8 mb-4">
            The Icons: Expensive and Worth It
          </h3>

          <p className="font-semibold text-[#1C1C1C] mt-6">
            Domaine Prieuré Saint-Christophe (now Domaine Giachino)
          </p>

          <p>
            Michel Grisard founded Prieuré Saint-Christophe in 1978 and converted to biodynamics in 1994, becoming known as the "Pope of Mondeuse." His wines showcased what Savoie could achieve: finesse, balance, terroir transparency, age-worthiness.
          </p>

          <p>
            Grisard sold the estate to the Giachino brothers (Frédéric and Clément) in 2015. They've maintained his vision—low yields, biodynamic farming, minimal intervention—and the wines remain among Savoie's finest.
          </p>

          <div className="bg-[#722F37]/10 border-l-4 border-[#722F37] p-6 my-8">
            <p className="font-semibold text-[#1C1C1C] mb-2">
              Record-Breaking Auction
            </p>
            <p className="text-gray-700 mb-0">
              In 2021, a bottle of 2003 Mondeuse Prestige sold at auction for €442—a record for Savoie.
            </p>
          </div>

          <p>
            <strong>What to buy:</strong> Mondeuse Tradition, Mondeuse Prestige, Altesse<br />
            <strong>Aging potential:</strong> 10-20+ years for Mondeuse, 10+ for Altesse<br />
            <strong>Price range:</strong> $40-100+ (Prestige much higher)
          </p>

          <p className="font-semibold text-[#1C1C1C] mt-6">
            Domaine Belluard (now Domaine du Gringet)
          </p>

          <p>
            The late Dominique Belluard was Savoie's most famous winemaker internationally, thanks to his tireless promotion of the Gringet grape from Ayze. His sudden death by suicide in 2021 shocked the wine world. The estate is now run by Vincent Ruiz and partners, renamed Domaine du Gringet.
          </p>

          <p>
            The still "Le Feu" bottling and the sparkling "Les Perles du Mont Blanc" (Gringlette) are both exceptional—mineral, precise, crystalline.
          </p>

          <p>
            <strong>What to buy:</strong> Le Feu (still), Les Perles du Mont Blanc (sparkling)<br />
            <strong>Aging potential:</strong> 5-10 years<br />
            <strong>Price range:</strong> $35-60
          </p>

          <p className="font-semibold text-[#1C1C1C] mt-6">
            Domaine des Ardoisières
          </p>

          <p>
            Founded by Michel Grisard and Brice Omont in 1998 on abandoned vineyard sites with schist soils, Ardoisières focuses on indigenous varieties including Persan (a nearly extinct red).
          </p>

          <p>
            The wines are powerful, structured, and complex—the Améthyste cuvée (Altesse) and Schiste cuvée command serious prices. In 2021, the 2014 Améthyste sold at auction for €60, making it the second-most expensive Savoie wine after Grisard's Mondeuse Prestige.
          </p>

          <p>
            <strong>What to buy:</strong> Améthyste (Altesse), Schiste (blend), Persan<br />
            <strong>Aging potential:</strong> 10-15 years<br />
            <strong>Price range:</strong> $40-80
          </p>

          <h3 className="font-serif text-2xl italic text-[#722F37] mt-8 mb-4">
            The Rising Stars: Quality at Better Prices
          </h3>

          <p className="font-semibold text-[#1C1C1C] mt-6">
            Louis Magnin
          </p>

          <p>
            Louis Magnin is the Mondeuse specialist, farming 8 hectares (55% Mondeuse) in Arbin—the spiritual home of the grape. The estate has been organic since 2012 and uses biodynamic principles on certain parcels.
          </p>

          <p>
            The vineyards face south-southeast on steep slopes with clay-limestone soils. Magnin produces several Mondeuse cuvées:
          </p>

          <ul>
            <li><strong>Classique:</strong> Steel-aged, rustic, slightly smoky, herbaceous and spicy</li>
            <li><strong>La Rouge:</strong> From 60-year-old vines, aged in large barrels, more structured</li>
            <li><strong>Fille d'Arbin:</strong> Whole-cluster vinification, elegant with 20+ year aging potential</li>
          </ul>

          <p>
            <strong>What to buy:</strong> Arbin Mondeuse (any cuvée), Chignin-Bergeron<br />
            <strong>Aging potential:</strong> 10-20 years for top Mondeuse cuvées<br />
            <strong>Price range:</strong> $25-50
          </p>

          <p className="font-semibold text-[#1C1C1C] mt-6">
            Domaine Giachino
          </p>

          <p>
            Frédéric Giachino has been producing wine since 1988, converting to organic farming in 2006. His vineyards sit on the limestone scree from the 1248 Mont Granier landslide—soils that are uniquely suited to viticulture.
          </p>

          <p>
            The Jacquère bottlings are textbook examples of the grape—crisp, mineral, affordable. Frédéric also works with rare varieties like Persan and Douce Noire, making him one of Savoie's most innovative producers.
          </p>

          <p>
            <strong>What to buy:</strong> Jacquère Apremont, Altesse, Persan<br />
            <strong>Price range:</strong> $20-40
          </p>

          <p className="font-semibold text-[#1C1C1C] mt-6">
            André et Michel Quenard
          </p>

          <p>
            The Quenard family name appears frequently in Savoie—there are several branches making wine. André et Michel Quenard is one of the best, producing textbook Jacquère from Chignin and structured Mondeuse from Arbin ("Terres Brunes").
          </p>

          <p>
            These are accessible, well-made wines that over-deliver for the price.
          </p>

          <p>
            <strong>What to buy:</strong> Chignin Jacquère, Arbin Mondeuse Terres Brunes<br />
            <strong>Price range:</strong> $20-35
          </p>

          <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-12 mb-6">
            Buying Strategy: What to Buy When
          </h2>

          <p className="font-semibold text-[#1C1C1C] mt-6">
            For Immediate Drinking (1-3 years)
          </p>

          <ul>
            <li>Jacquère from any reputable producer: Apremont, Abymes, Chignin</li>
            <li>Chasselas from Lake Geneva crus: Crépy, Ripaille</li>
            <li>Basic Gamay or Pinot Noir blends</li>
            <li>Crémant de Savoie</li>
          </ul>

          <p>
            <strong>Why:</strong> These wines are designed for freshness and acidity. They don't improve with age—they fade.
          </p>

          <p className="font-semibold text-[#1C1C1C] mt-6">
            For Medium-Term Cellaring (3-7 years)
          </p>

          <ul>
            <li>Chignin-Bergeron (Roussanne)</li>
            <li>Entry-level Roussette de Savoie (without cru designation)</li>
            <li>Arbin Mondeuse from good producers</li>
          </ul>

          <p className="font-semibold text-[#1C1C1C] mt-6">
            For Long-Term Cellaring (7-20+ years)
          </p>

          <ul>
            <li>Roussette de Savoie cru bottlings: Frangy, Marestel, Monthoux, Monterminod</li>
            <li>Top Mondeuse: Prieuré Saint-Christophe, Louis Magnin, Dupasquier</li>
            <li>Domaine des Ardoisières Améthyste and Schiste</li>
            <li>Persan from any producer</li>
          </ul>

          <div className="bg-[#2a9d8f]/20 border-l-4 border-[#2a9d8f] p-6 my-8">
            <p className="font-semibold text-[#1C1C1C] mb-2">
              What happens with age:
            </p>
            <p className="text-gray-700 mb-0">
              Altesse develops white truffle, honey, hazelnut. Mondeuse becomes silky, complex, with undergrowth and game notes. Both become more Burgundian in profile—serious, contemplative wines.
            </p>
          </div>

          <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-12 mb-6">
            Food Pairing: What to Serve
          </h2>

          <p>
            Savoie wines are designed for Alpine cuisine, but they're more versatile than that suggests.
          </p>

          <p className="font-semibold text-[#1C1C1C] mt-6">
            Jacquère
          </p>

          <p>
            Lake fish (perch, trout, omble chevalier), oysters and shellfish, fondue and raclette, light salads with vinaigrette, fried foods (acidity cuts through fat)
          </p>

          <p className="font-semibold text-[#1C1C1C] mt-6">
            Altesse (Roussette)
          </p>

          <p>
            Richer fish dishes (turbot, sea bass), lobster and crab, aged Alpine cheeses (Beaufort, Comté, Reblochon), roast chicken with cream sauce, mushroom risotto
          </p>

          <p className="font-semibold text-[#1C1C1C] mt-6">
            Chignin-Bergeron (Roussanne)
          </p>

          <p>
            Foie gras, roast pork with apricots, rich cream-based dishes, aged hard cheeses, Moroccan tagines (the fruit and spice work beautifully)
          </p>

          <p className="font-semibold text-[#1C1C1C] mt-6">
            Mondeuse
          </p>

          <p>
            Lamb (especially with rosemary or mint), beef stew and pot-au-feu, game (venison, wild boar), duck confit, mushroom-heavy dishes, grilled sausages, tartiflette (potato gratin with Reblochon cheese and bacon)
          </p>

          <p>
            <strong>The key with Savoie reds:</strong> they have bright acidity, so they can handle dishes with tomato, vinegar, or mustard that would overwhelm Bordeaux or Burgundy.
          </p>

          <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-12 mb-6">
            Pricing Reality: What You'll Actually Pay
          </h2>

          <p>
            Savoie wines are still relatively affordable compared to other French regions, though prices for the best producers have risen significantly.
          </p>

          <ul>
            <li><strong>Entry Level ($15-25):</strong> Basic Jacquère from cooperatives or large producers, Chasselas from Lake Geneva, simple Crémant de Savoie</li>
            <li><strong>Mid-Range ($25-45):</strong> Producer Jacquère from top estates, Roussette de Savoie (non-cru), Chignin-Bergeron, Arbin Mondeuse from serious estates</li>
            <li><strong>Premium ($45-80):</strong> Roussette de Savoie cru (Marestel, Frangy), Top Mondeuse, Domaine des Ardoisières wines</li>
            <li><strong>Collector ($80-300+):</strong> Prieuré Saint-Christophe Mondeuse Prestige, aged library vintages, rare cuvées with auction provenance</li>
          </ul>

          <div className="bg-[#f4d35e]/20 border-l-4 border-[#f4d35e] p-6 my-8">
            <p className="font-semibold text-[#1C1C1C] mb-2">
              The Value Proposition
            </p>
            <p className="text-gray-700 mb-0">
              You can still find excellent Savoie wines for $25-35 that would cost $60-80 if they were from Burgundy or the Rhône. The value proposition is real—for now.
            </p>
          </div>

          <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-12 mb-6">
            Quick Reference: Best Wines to Buy by Category
          </h2>

          <p className="font-semibold text-[#1C1C1C] mt-6">
            Best Value Whites
          </p>
          <ul>
            <li>André et Michel Quenard Chignin Jacquère</li>
            <li>Domaine Berthollier Les Cristallins Jacquère</li>
            <li>Jean Perrier Apremont</li>
          </ul>

          <p className="font-semibold text-[#1C1C1C] mt-6">
            Best Age-Worthy Whites
          </p>
          <ul>
            <li>Dupasquier Roussette de Savoie Marestel</li>
            <li>Domaine des Ardoisières Améthyste (Altesse)</li>
            <li>Gilles Berlioz Chignin-Bergeron</li>
          </ul>

          <p className="font-semibold text-[#1C1C1C] mt-6">
            Best Reds
          </p>
          <ul>
            <li>Louis Magnin Arbin Mondeuse (any cuvée)</li>
            <li>Prieuré Saint-Christophe Mondeuse Tradition</li>
            <li>André et Michel Quenard Terres Brunes Mondeuse</li>
          </ul>

          <p className="font-semibold text-[#1C1C1C] mt-6">
            Best Sparkling
          </p>
          <ul>
            <li>Domaine du Gringet Les Perles du Mont Blanc</li>
            <li>Domaine Giachino Giac' Bulles</li>
            <li>Any reputable Crémant de Savoie</li>
          </ul>

          <p className="font-semibold text-[#1C1C1C] mt-6">
            Most Distinctive/Rare
          </p>
          <ul>
            <li>Domaine du Gringet Le Feu (Gringet)</li>
            <li>Domaine Giachino Persan</li>
            <li>Domaine des Ardoisières Schiste</li>
          </ul>

          <div className="bg-[#2a9d8f] text-white p-8 rounded-lg my-12">
            <p className="text-xl font-semibold mb-4">
              Best Introduction to the Region
            </p>
            <p className="text-lg mb-4">
              Start with a bottle each of:
            </p>
            <ul className="mb-4">
              <li>Jacquère from Apremont or Abymes (Giachino, Quenard)</li>
              <li>Roussette de Savoie (Dupasquier Marestel if you can find it)</li>
              <li>Arbin Mondeuse (Louis Magnin)</li>
            </ul>
            <p className="text-lg mb-0">
              That trio gives you the workhorse white, the noble white, and the flagship red—the essential Savoie experience for under $100 total.
            </p>
          </div>

          <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-12 mb-6">
            Final Thoughts: Why Savoie Matters
          </h2>

          <p>
            Savoie will never be Burgundy. It doesn't want to be. The region produces less than 1% of French wine, most of it consumed domestically, much of it drunk young with melted cheese.
          </p>

          <p>
            But for wine professionals and serious collectors, Savoie offers something increasingly rare: authenticity. These are wines that taste like where they're from—alpine, mineral, precise. They're made from grapes that grow almost nowhere else, by producers who farm organically on slopes where mechanization is impossible, who work in obscurity because they care more about quality than Instagram.
          </p>

          <p>
            The best Savoie wines age beautifully. Roussette de Savoie from top crus develops for 10-15 years. Mondeuse from Arbin can go 20. These aren't wines you flip for profit—they're wines you cellar and drink.
          </p>

          <p>
            The pricing is still reasonable compared to Burgundy, Rhône, or even Jura. A great bottle of Altesse from Marestel costs $40-50. A serious Mondeuse from Prieuré Saint-Christophe is $60-80 (Prestige excluded). These are wines you can actually afford to drink.
          </p>

          <p>
            If Jura is the wine region for natural wine obsessives and Burgundy hunters looking for the next big thing, Savoie is the region for people who want to drink distinctive, terroir-driven wines without the hype, the markup, or the allocation games.
          </p>

          <p className="text-xl font-semibold text-[#722F37] mt-8">
            Buy it before everyone else figures it out.
          </p>

          <p className="text-xl font-semibold text-gray-700 mt-4">
            Welcome to the Alps.
          </p>
        </div>

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t-2 border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Share This Article
            </span>
            <div className="flex gap-3">
              <button className="w-10 h-10 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center hover:bg-[#722F37] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center hover:bg-[#722F37] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center hover:bg-[#722F37] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667h-3.554v-11.452h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zm-15.11-13.019c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019h-3.564v-11.452h3.564v11.452zm15.106-20.452h-20.454c-.979 0-1.771.774-1.771 1.729v20.542c0 .956.792 1.729 1.771 1.729h20.451c.978 0 1.771-.773 1.771-1.729v-20.542c0-.955-.793-1.729-1.771-1.729z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-16 pt-12 border-t-3 border-[#1C1C1C]">
          <h3 className="font-serif text-2xl italic mb-8">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/articles/ginger-fox-pupillin" className="group">
              <div className="bg-white border-3 border-[#1C1C1C] rounded-lg overflow-hidden fun-card">
                <div className="aspect-[16/10] bg-[#ff6b35] relative">
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-block px-3 py-1 bg-[#1C1C1C] text-white text-xs font-bold uppercase tracking-wider rounded-full">
                      Features
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37] transition-colors">
                    The Ginger Fox of Pupillin
                  </h4>
                  <p className="mt-2 text-sm text-gray-500">
                    By Wine Saint Editorial
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/articles/loire-valley-2024-vintage" className="group">
              <div className="bg-white border-3 border-[#1C1C1C] rounded-lg overflow-hidden fun-card">
                <div className="aspect-[16/10] bg-[#2a9d8f] relative">
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-block px-3 py-1 bg-[#1C1C1C] text-white text-xs font-bold uppercase tracking-wider rounded-full">
                      Vintage Report
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37] transition-colors">
                    Loire Valley 2024: The Vintage Nobody Wanted But Somehow Survived
                  </h4>
                  <p className="mt-2 text-sm text-gray-500">
                    By Wine Saint Editorial
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
