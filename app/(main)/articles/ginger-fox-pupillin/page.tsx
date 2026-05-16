import Link from 'next/link';

export default function GingerFoxPupillinArticle() {
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
            <span className="text-[#1C1C1C]">The Ginger Fox of Pupillin</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <div className="bg-gradient-to-br from-[#722F37] to-[#ff6b35] py-10 sm:py-16 border-b-3 border-[#1C1C1C]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <span className="inline-block px-3 py-1 bg-[#f4d35e] text-[#1C1C1C] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Features
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl italic text-white leading-tight mb-6">
            The Ginger Fox of Pupillin
          </h1>
          <p className="text-xl text-white/90 mb-6">
            Domaine Bornard and the Jura Wine Renaissance
          </p>
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
            In the oldest building in Pupillin, a tiny village of 265 souls tucked into the Jura Mountains between Burgundy and Switzerland, there's a cramped cellar where some of France's most sought-after wines are made. You can spot them immediately on any wine list: the ginger fox. That simple orange-red emblem has become synonymous with Domaine Bornard, a family estate that went from selling grapes to a cooperative to producing wines that sommeliers fight over and collectors pay absurd prices to acquire.
          </p>

          <p className="text-xl leading-relaxed text-gray-700 mb-12">
            This is the story of Philippe Bornard, who took a leap of faith in his mid-fifties. Of his son Tony, who quietly built his own estate before merging it with his father's vision. And of how a forgotten French wine region became one of the hottest tickets in natural wine—only to face existential threats that may determine whether this renaissance can survive.
          </p>

          <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-12 mb-6">
            Philippe: The Reluctant Revolutionary
          </h2>

          <p>
            For thirty years, Philippe Bornard did what generations of Jura vignerons had done before him: he grew grapes and sold them to the Fruitière de Pupillin, the village cooperative. It was 1975 when he began, working the vineyards he'd inherited from his father. Safe. Predictable. Unremarkable.
          </p>

          <p>
            But Philippe lived next door to a legend. Pierre Overnoy, the man who would become known as the godfather of natural wine, resided just down the lane in that same ancient Pupillin building. The meeting between these neighbors changed everything.
          </p>

          <p>
            Overnoy had been making wine since 1968, stubbornly refusing to follow the modern winemaking trends that swept through France in the 1970s. While other producers embraced synthetic fertilizers, commercial yeasts, and chemical shortcuts, Overnoy did the opposite. He farmed organically, fermented with wild yeasts, used minimal—and later zero—sulfur. His wines were living things, unpredictable and profound. By the time Philippe really took notice in the mid-2000s, Overnoy's wines had achieved cult status among a small but passionate group of natural wine devotees.
          </p>

          <div className="bg-[#ff6b35]/20 border-l-4 border-[#ff6b35] p-6 my-8">
            <p className="font-semibold text-[#1C1C1C] mb-2">
              The Leap of Faith
            </p>
            <p className="text-gray-700 mb-0">
              In 2005, at age 55, Philippe Bornard made a decision that most people would consider insane: he stopped selling his grapes to the cooperative and started making his own wine.
            </p>
          </div>

          <p>
            With his wife Annie, he founded Domaine Bornard, working from that cramped cellar beneath his house. The approach was pure Overnoy—low-intervention, low-sulfur, respectful of terroir. Philippe's winemaking philosophy was simple but radical: wine needed to remain pure.
          </p>

          <p>
            He farmed his 11 hectares biodynamically, cultivating the five Jura grape varieties—Chardonnay, Savagnin, Poulsard (called Ploussard in Pupillin), Pinot Noir, and Trousseau—as well as the rare Melon à Queue Rouge, a red-stemmed variant of Chardonnay whose stems literally turn red as they ripen.
          </p>

          <p>
            In his cellar, Philippe employed a mix of stainless steel, fiberglass fermenters, and neutral oak barrels of various sizes, choosing vessels based on what each cuvée demanded. The wines were made with spontaneous fermentation, minimal intervention, and deep attention to the vineyard's voice. Each bottling was microscopic in production—a few hundred cases at most from such small parcels of land.
          </p>

          <p>
            The wines quickly became very successful. Too successful. As Wine Advocate's Luis Gutiérrez wrote, Philippe became "in a matter of ten years, an absolute star of the zone."
          </p>

          <p>
            There was just one problem: there was never enough wine.
          </p>

          <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-12 mb-6">
            The Jura Paradox: Too Small to Meet Demand
          </h2>

          <p>
            To understand why Bornard wines became so hard to find, you need to understand the Jura itself.
          </p>

          <p>
            This is one of France's smallest wine regions—just 2,000 hectares under vine. That's one-tenth the size it was before phylloxera devastated the vineyards in the late 1800s. For comparison: Burgundy has 30,000 hectares, Bordeaux has 500 million bottles of production annually. Jura makes about 11 million bottles total. As of 2021, only 12% of Jura wines were exported outside France.
          </p>

          <p>
            The region was wiped off the map, essentially, by a perfect storm of disasters. First came downy mildew in the 1850s, then phylloxera, then two world wars. Many vineyards were grubbed up and became pasture. What remained was a tiny sliver of terroir that, frankly, most people had never heard of.
          </p>

          <p>
            Those who did know about Jura thought of it as the region that made weird oxidized wines. Vin Jaune, the "yellow wine" aged for six years and three months under a veil of yeast, tasted like fino sherry crossed with hazelnuts and curry leaf. Vin de Paille, a sweet wine made from grapes dried on straw mats, was even more esoteric. To most of the wine world, these were curiosities, not collectibles.
          </p>

          <div className="bg-[#f4d35e]/20 border-l-4 border-[#f4d35e] p-6 my-8">
            <p className="font-semibold text-[#1C1C1C] mb-2">
              The Turning Point
            </p>
            <p className="text-gray-700 mb-0">
              "Jura is not new to greatness. Arbois, its most famous appellation, became an AOC in 1936—one of France's first. What we're witnessing isn't a discovery, but a resurgence."
            </p>
          </div>

          <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-12 mb-6">
            The Natural Wine Explosion
          </h2>

          <p>
            The rise happened at wine bars and natural wine fairs. La Dive Bouteille in the Loire Valley exposed a generation of wine lovers to Jura's iconoclasts: Houillon-Overnoy, Jean-François Ganevat, Philippe Bornard, Stéphane Tissot, Domaine de la Tournelle, Labet. People returned from these events with stars in their eyes and Savagnin on their breath.
          </p>

          <p>
            In New York, sommelier Jorge Riera (now wine director of the Frenchette restaurant group) was pouring Houillon-Overnoy by the glass at 360 in Brooklyn. "A lot of the somms thought PlouPlou [Poulsard] lacked flavor," Riera recalled. Today that reads like a flex; back then, it was a dare. But Riera found that Jura wines resonated with a particular type of guest: "someone that was open minded and with a palate, someone looking for more gourmand wines, savory and lip smacking flavors."
          </p>

          <p>
            The wines were unlike anything else in France. Poulsard was pale red, almost rosé in color, but packed with strawberry, spice, and forest floor. Trousseau was darker and more structured, with wild berries and smoke. And Savagnin walked the line between wine and alchemy—saline, nutty, oxidative, with aromas that sommeliers struggled to describe but couldn't stop talking about.
          </p>

          <p>
            Philippe Bornard's wines fit perfectly into this moment. His Trousseau Le Ginglet came from red shale and gravel soils in Pupillin, producing herb-tinged, finely structured red fruit that he fermented for three weeks in stainless steel. His Ploussard La Chamade came from half-century-old vines in red loam, giving the fruit uncommon depth and earthiness. His Savagnin Les Chassagnes, from limestone-rich soils, was aged for two years in foudre—ouillé style, carefully topped up to avoid oxidation for the purest expression of terroir, yet still with that Jura tang.
          </p>

          <p>
            And the Melon à Queue Rouge? That was the unicorn—a wine combining orchard fruit richness with razor-sharp acidity, concentrated by naturally low yields. Bornard became one of the champions of this now-rare variety.
          </p>

          <p>
            The problem was production. Like Overnoy, Bornard priced his wines modestly at the domaine. But once they left the cellar, prices multiplied three, four, five times. With every sommelier in France vying for an allocation, very little made it anywhere else. Bottles that sold for 30 euros at the estate commanded 100, 150, even 200 euros on restaurant lists and in retail shops.
          </p>

          <p>
            The secondary market went even more insane. At auction, Overnoy wines routinely fetch prices that would make Burgundy blush. In July 2024, a 2010 Overnoy Savagnin sold for €525. A 2000 Vieux Savagnin Ouillé went for €501 for a 500ml bottle—equivalent to €751 scaled to standard size. These were fortified wine prices for table wine. All from a man who lived humbly in a tiny village and sold his wines at modest prices.
          </p>

          <div className="bg-[#722F37]/10 border-l-4 border-[#722F37] p-6 my-8">
            <p className="font-semibold text-[#1C1C1C] mb-2">
              The Price of Success
            </p>
            <p className="text-gray-700 mb-0">
              Pierre Overnoy himself expressed frustration with the speculation: "A fortified wine that sells for 16 euros might end up on a restaurant table for 1,450 euros. That's just excess. But it shows how absurd things have become."
            </p>
          </div>

          <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-12 mb-6">
            Tony: The Next Generation
          </h2>

          <p>
            Tony Bornard grew up watching his father transform from grape grower to winemaking star. He traveled—working harvests in France, the United States, and Australia—before returning to the Jura in 2011. But rather than immediately join his father's operation, Tony did something interesting: in 2013, he quietly created his own estate.
          </p>

          <p>
            For four years, Tony made wines under his own label, establishing his own identity separate from the famous fox. His approach was similar to his father's—biodynamic farming, natural winemaking, zero additions—but with his own experimental edge. Tony wasn't afraid to depart from traditional methods. He used open-top wood fermenters, concrete eggs, whole cluster fermentation. He made everything from clean, minerally-fresh styles to traditional Vin Jaune and Macvin.
          </p>

          <p>
            Then in 2017, Philippe retired. Tony took over the family estate and merged it with his own holdings, reaching a total of 11.5 hectares.
          </p>

          <p>
            The transition was seamless. As one observer noted: "Big changes have occurred in the Bornard domaine. Philippe has retired and his talented son Tony has taken over the operation (since 2017) with little fuss and with few observable differences for outsiders."
          </p>

          <p>
            Tony kept the ginger fox logo but simplified it. Some wines retained the Tony Bornard label he'd used in the past. Others carried only the Domaine Bornard name. The approach was flexible, responsive to what the vintage gave him.
          </p>

          <p>
            And that flexibility was immediately tested.
          </p>

          <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-12 mb-6">
            2017: The Frost That Changed Everything
          </h2>

          <p>
            The weather in 2017 was brutal. Spring frosts hit the Jura hard, devastating yields across the region. For the Bornard domaine, it meant there weren't enough grapes to make separate cuvées for the regular Domaine Bornard and Tony Bornard wines.
          </p>

          <p>
            So Tony made a decision: he combined everything into one new cuvée called <em>Au Fil des Générations</em>—"Through the Generations"—with a label created using an old family label for inspiration. It was a wine born of necessity, a blend of Philippe's vineyards and Tony's, Chardonnay from one and Ploussard from the other, father and son literally combined in the bottle.
          </p>

          <p>
            The 2017 frost wasn't an isolated incident. It was a warning.
          </p>

          <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-12 mb-6">
            The Existential Threat: Climate and the Future of Jura
          </h2>

          <p>
            The Jura has always been a precarious place to make wine. Continental climate. Cold winters. Late harvests—often extending well into October—to achieve ripeness in grapes that struggle in the cool conditions. Frost has always been a risk, which is why vines are trained to the Guyot system to help protect against it.
          </p>

          <p>
            But what's happening now is different.
          </p>

          <p>
            Significant frost losses hit in 2017, 2019, and 2021. Then came 2024, with estimated losses of 60-70% across the region—the worst in 25 years. A late April cold snap scorched young shoots just as they were developing. An unusually wet autumn in 2023 promoted mildew and fungal diseases. The harvest was delayed until September, compared to late August in 2023.
          </p>

          <p>
            Winemaker Benoît Sermier described the situation bluntly: the combination of repeated frost damage and increasing climate volatility poses what one industry website called an "existential threat" to the region.
          </p>

          <p>
            For younger winemakers like Tony, the challenges are even more acute. Established producers have stockpiles of older vintages to sell through lean years. But newer operations don't have that buffer. Three bad vintages in a row can bankrupt a young domaine.
          </p>

          <div className="bg-[#457b9d]/10 border-l-4 border-[#457b9d] p-6 my-8">
            <p className="font-semibold text-[#1C1C1C] mb-2">
              The Irony of Natural Wine
            </p>
            <p className="text-gray-700 mb-0">
              The philosophical approach that made Jura natural wine famous—organic and biodynamic farming, minimal intervention, working with nature rather than against it—becomes a vulnerability when nature turns hostile. For biodynamic and organic producers in particular, whose methods rely on natural processes, the impact is even more profound.
            </p>
          </div>

          <p>
            The cruel irony is that this is happening precisely as global demand for Jura wines reaches its peak. Allocations have shrunk. Prices from the wineries have more than doubled. But producer importer Aaron Rovine sees the upside: "I think that's a relatively good thing. People are willing to pay a lot for the wines, so I'm happy to see the winemakers raising their prices as they are far from rich and a little more financial security is a good thing, especially in a region so prone to frost and other disease pressure."
          </p>

          <p>
            Still, sommelier Jorge Riera believes the challenges are mounting: "The scarcity and high demand are tough when production is so small—especially after these last few difficult years of climate change."
          </p>

          <p>
            Some producers are adapting by planting hybrid grapes like Le Rayon d'Or, Plantet, and Souvignier Gris, which are more resilient to fungal diseases and temperature fluctuations. But these aren't traditional Jura varieties. They represent a departure from the very heritage that made the region special.
          </p>

          <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-12 mb-6">
            Tony's Vision: Evolution Without Abandonment
          </h2>

          <p>
            Despite the challenges, Tony Bornard has pushed forward. In recent years, he completed construction of a new, state-of-the-art winery in Pupillin—still modest by Napa standards, but a significant investment for a Jura producer. The facility includes special areas for maturing white wines and incorporates environmentally-friendly materials based on traditional Comtoise farm architecture.
          </p>

          <p>
            As Tony explained on the domaine's website: "This new winery has been designed to take a dynamic approach to wine and vines, using environmentally-friendly materials based on the model of a traditional Comtoise farm. We're more than excited about this new beginning, this new page in our history. Still in Pupillin, we'll be keen to carry on the family winemaking tradition that goes back so many generations before us."
          </p>

          <p>
            The farming has evolved, too. Tony describes his methods: "I've radically changed my farming methods, cutting back on tillage and the use of plant protection products, stopped trimming and eliminated all inputs into the wine. I produce my herbal teas, decoctions, macerations and fermentations on the estate to enhance soil life, plant defenses and growth."
          </p>

          <p>
            The wine range remains ambitious despite production challenges. Tony continues making all the traditional Jura styles when the vintage permits: Vin Jaune aged for a decade in barrel, Vin de Paille, Macvin (a fortified wine), Pét-Nat. The estate's annual production is around 55,000 bottles—minuscule compared to most wine regions, but substantial for Jura.
          </p>

          <p>
            Popular bottlings include Le Ginglet (Trousseau), Les Chassagnes (Savagnin), Le Vin de Ploussard, and the revered Vin Jaune. They sell out fast. Retailers frequently note: "These wines are rare and SELL OUT FAST. Don't sleep on them."
          </p>

          <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-12 mb-6">
            What the Bornards Represent
          </h2>

          <p>
            The story of Domaine Bornard is, in many ways, the story of modern Jura itself.
          </p>

          <p>
            A region that was nearly wiped out by phylloxera, abandoned for a century, dismissed as too weird, too oxidized, too rustic. A handful of stubborn vignerons—Overnoy, Tissot, Ganevat, the Bornards—who kept farming the old ways, not because it was trendy, but because it was all they could afford or all they believed in.
          </p>

          <p>
            Then a sudden explosion of interest. Natural wine becoming a global movement. Sommeliers championing these obscure bottles. Collectors driving up prices. A tiny village like Pupillin becoming a pilgrimage site for wine geeks.
          </p>

          <p>
            And now, the reckoning. Climate change threatening the very existence of viticulture in the region. Frost after frost decimating harvests. Young producers wondering if they can survive the next bad vintage. Prices rising to levels that would have been unthinkable a decade ago, but still leaving the actual winemakers living modestly while speculators profit.
          </p>

          <p>
            Philippe Bornard took a risk at 55 and became a star in ten years. Tony inherited that legacy at 30-something and has to figure out how to sustain it through climate chaos and market madness. Both men live in the same ancient building in Pupillin, making wine in the same cramped cellar, farming the same terroir their ancestors farmed, neighbors to the legendary Overnoy.
          </p>

          <div className="bg-[#722F37] text-white p-8 rounded-lg my-12">
            <p className="text-xl font-semibold mb-4">
              The ginger fox on their labels has become an emblem not just of a domaine, but of a philosophy
            </p>
            <p className="text-lg mb-0">
              Wine as a living thing, made with minimal intervention, expressing place above all else. It represents a connection to land, to history, to community that feels increasingly rare in an industrialized wine world.
            </p>
          </div>

          <p>
            But symbols don't protect against frost. Icons don't guarantee another vintage. And fame, as the Bornards and their Jura neighbors are learning, brings as many problems as it solves.
          </p>

          <p>
            As Tony works his 11 hectares of vines, making herbal teas and decoctions to enhance soil life, he's betting that the Jura's natural resilience—forged through centuries of hardship—can withstand this latest challenge. That the same terroir which produces wines of such singular character can adapt to a changing climate without losing its soul.
          </p>

          <p>
            It's a bet his father made when he left the security of the cooperative. A bet Overnoy made when he refused to use sulfur. A bet every natural winemaker in the Jura makes every vintage when they choose restraint over control, observation over intervention.
          </p>

          <p>
            Whether that bet pays off will determine not just the future of Domaine Bornard, but the future of one of France's most distinctive wine regions. For now, those ginger fox labels remain among the most sought-after in the wine world.
          </p>

          <p className="text-xl font-semibold text-gray-700 mt-8">
            The question is how long the foxes can keep running.
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
            <Link href="/articles/napa-inconvenient-truth" className="group">
              <div className="bg-white border-3 border-[#1C1C1C] rounded-lg overflow-hidden fun-card">
                <div className="aspect-[16/10] bg-[#457b9d] relative">
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-block px-3 py-1 bg-[#1C1C1C] text-white text-xs font-bold uppercase tracking-wider rounded-full">
                      Analysis
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37] transition-colors">
                    Napa: An Inconvenient Truth
                  </h4>
                  <p className="mt-2 text-sm text-gray-500">
                    By Wine Saint Editorial
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/articles/wine-ratings-made-up" className="group">
              <div className="bg-white border-3 border-[#1C1C1C] rounded-lg overflow-hidden fun-card">
                <div className="aspect-[16/10] bg-[#722F37] relative">
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-block px-3 py-1 bg-[#1C1C1C] text-white text-xs font-bold uppercase tracking-wider rounded-full">
                      Opinion
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37] transition-colors">
                    Wine Ratings Are Made Up and the Points Don't Matter
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
