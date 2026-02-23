import Link from 'next/link';

export default function RussianRiverValleyArticle() {
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
            <span className="text-[#1C1C1C]">Russian River Valley</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <div className="bg-gradient-to-br from-[#6d597a] to-[#457b9d] py-16 border-b-3 border-[#1C1C1C]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <span className="inline-block px-3 py-1 bg-[#f4d35e] text-[#1C1C1C] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Features
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl italic text-white leading-tight mb-6">
            Russian River Valley: What's Old Is New Again
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
            In 1987, an unknown winery operating out of a garage in Forestville shocked California's wine establishment. The 1985 Rochioli Vineyard Pinot Noir from Williams Selyem—made by two friends who'd pooled their tip money from restaurant jobs—won the Sweepstakes Prize at the California State Fair. Best red wine in the state. The winery also took home Winery of the Year. Not bad for guys using a hand-cranked de-stemmer and crusher.
          </p>

          <p className="text-xl leading-relaxed text-gray-700 mb-12">
            That moment didn't just launch Williams Selyem into the stratosphere. It announced to the world that Russian River Valley was California's answer to Burgundy. For the next two decades, the region would reign as the undisputed king of American Pinot Noir.
          </p>

          <p className="text-xl leading-relaxed text-gray-700 mb-12">
            Then, somewhere along the way, it wasn't hip anymore.
          </p>

          <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-12 mb-6">
            The Golden Era: When the River Ran Red
          </h2>

          <p>
            The Russian River Valley's emergence as a Pinot Noir powerhouse didn't happen overnight. Viticulture in Sonoma County dates back to 1824, and immigrants from Mediterranean countries had been planting vines in the river valley for generations. But serious, world-class Pinot Noir? That started in the 1970s.
          </p>

          <p>
            In 1973, Joe Rochioli Jr. saw his first crop of Pinot Noir grapes go into bottles via Davis Bynum, a former San Francisco Chronicle reporter who'd built the first winery on Westside Road. That same year set things in motion. By 1979, Ed Selyem and Burt Williams—another Chronicle pressman—were making Pinot Noir in Selyem's garage in Forestville, initially calling their project Hacienda del Rio before legal troubles forced them to change the name.
          </p>

          <div className="bg-[#6d597a]/20 border-l-4 border-[#6d597a] p-6 my-8">
            <p className="font-semibold text-[#1C1C1C] mb-2">
              The Perfect Geography
            </p>
            <p className="text-gray-700 mb-0">
              The Russian River takes a meandering right-hand turn below Healdsburg and heads west toward the Pacific Ocean, creating what locals call the "Middle Reach." Cold ocean fog funnels inland through the valley, creating the valley's "vacuum effect"—the warmer the Central Valley becomes during summer days, the more intensely the fog pours in from the coast.
            </p>
          </div>

          <p>
            The result? A cool-climate paradise for Pinot Noir and Chardonnay. Warm enough days for ripening, cool enough nights to preserve acidity and elegance. And the soils—Goldridge sandy loam, Sebastopol clay, alluvial benchland deposits—gave the wines distinctive character that varied block by block, vineyard by vineyard.
          </p>

          <p>
            Williams Selyem pioneered single-vineyard designations, making stars of Rochioli, Allen, and Olivet Lane vineyards by fashioning their fruit into compelling and diverse wines. Gary Farrell, who launched his eponymous label in 1982 while still winemaking at Davis Bynum, recalled the quality of those early efforts as "literally breathtaking." The approach answered critics who thought terroir didn't apply in California. These weren't one-note fruit bombs. These were wines with place, with personality, with soul.
          </p>

          <p>
            In 1981, while judging Pinot Noirs at the Sonoma County Harvest Fair, legendary winemaker André Tchelistcheff tasted a wine blind and declared: "Whoever made it, he knows Pinot Noir." It was Gary Farrell's 1978 Davis Bynum Pinot Noir. Tchelistcheff knew nothing about Farrell, but predicted great things for him. He was right.
          </p>

          <p>
            By the mid-1980s, the triumvirate of Rochioli, Williams Selyem, and Gary Farrell had established Westside Road as ground zero for American Pinot Noir. They were all connected—Gary Farrell told the story of how Ed Selyem would buy his Pinot Noir at Speers Market in Forestville, asking questions about Rochioli vineyards and winemaking. "I gave him the recipe," Farrell said. "It never occurred to me what he was up to until Joe Rochioli told me that he'd sold grapes to Williams Selyem."
          </p>

          <div className="bg-[#f4d35e]/20 border-l-4 border-[#f4d35e] p-6 my-8">
            <p className="font-semibold text-[#1C1C1C] mb-2">
              The Historic Moment
            </p>
            <p className="text-gray-700 mb-0">
              In 1998, a Williams Selyem 1995 Rochioli Vineyard Pinot Noir became the first American Pinot Noir to receive a perfect 100-point score from Wine Spectator. The same year, Williams and Selyem sold their garage operation to New York businessman John Dyson. The waiting list to get on their mailing list averaged two years. Their 1991 Summa Vineyard Pinot Noir became the first California Pinot to retail for $100.
            </p>
          </div>

          <p>
            Then the real frenzy began. In the late 1990s and early 2000s, as Pinot Noir's popularity exploded, Russian River Valley saw an avalanche of investment. Pinot plantings jumped from 4,000 acres in the late 1990s to over 12,000 acres by 2003—a tripling of acreage in less than a decade. By 2008, Russian River Valley accounted for nearly 19% of all Pinot Noir plantings in California.
          </p>

          <p>
            The money followed. In 2009, Kosta Browne—another garage winery started by two restaurant workers pooling tip money—sold a controlling stake to the Vincraft Group for a reported $40 million. For a winery with no vineyard holdings producing just 11,000 cases, it was the highest price ever paid for a Sonoma-based producer. The wines were selling for $58 to $72 per bottle, all direct-to-consumer, all sold out instantly.
          </p>

          <p>
            Russian River Valley wasn't just making great wine. It was minting millionaires.
          </p>

          <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-12 mb-6">
            The Slide: When Cool Became Unfashionable
          </h2>

          <p>
            But here's the thing about being on top: there's nowhere to go but down.
          </p>

          <p>
            The problem started, ironically, with wine critics. The classic Russian River style—produced from older clones like Martini, Swan, and Pommard planted in the mid-to-late 20th century—was characterized by vibrant but pale color, lively acidity, cherry and berry fruit flavors, and delicate aromas that often included earthy mushroom notes.
          </p>

          <p>
            That style had passionate fans. But as Robert Parker's influence grew in the 2000s, the lack of deep color became a liability. Wine critics started dinging Russian River Pinots for being too light, too delicate, too... Burgundian. In response, some Russian River winemakers altered their techniques to enhance color—blending in darker Alicante Bouschet and Syrah, using the red wine concentrate "Mega Purple," employing extended maceration and oak extraction to add weight and phenolic compounds.
          </p>

          <p>
            The wines got darker. They got riper. They got higher in alcohol. Kosta Browne found its signature style in 2002 when they unexpectedly received fruit from Kanzler Vineyard already at 25.2 brix. "I was in this mind-set of, I've gotta make Burgundy, I've gotta 23.5 it," co-founder Michael Browne recalled. "But this fruit tasted great." The resulting wine was lush, opulent, fruit-forward. Critics loved it. The 2003 vintage put Kosta Browne on the map—all six Pinots earned outstanding to classic ratings from Wine Spectator.
          </p>

          <p>
            And in chasing scores, Russian River started losing what made it special in the first place.
          </p>

          <div className="bg-[#722F37]/10 border-l-4 border-[#722F37] p-6 my-8">
            <p className="font-semibold text-[#1C1C1C] mb-2">
              The Competition
            </p>
            <p className="text-gray-700 mb-0">
              Meanwhile, Oregon's Willamette Valley started getting serious attention. The wines emphasized earthy notes, red fruit, and bright acidity. Critics started calling them more "authentic," more "terroir-driven," more like actual Burgundy. Then came Santa Barbara's Sta. Rita Hills. Suddenly sommeliers were geeking out over everywhere except Russian River.
            </p>
          </div>

          <p>
            By the late 2000s and early 2010s, Russian River Valley had a problem. It wasn't the new thing anymore. It wasn't the cool thing. Oregon was ascendant. Santa Barbara was hot. Even Monterey's Santa Lucia Highlands was generating buzz. Russian River? That's where your parents drank Pinot.
          </p>

          <p>
            Wine Searcher data told the story: "Interest in this wine has fallen off relative to previous years" became a common refrain for Russian River producers. Even cult wines were showing declining search traffic. The region that had invented modern American Pinot Noir was yesterday's news.
          </p>

          <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-12 mb-6">
            The Return: New Generation, Old Values
          </h2>

          <p>
            But something interesting has been happening over the past five years. Russian River Valley is having a moment again. Not a comeback—the wines never stopped being excellent—but a rediscovery. A recognition that maybe, just maybe, the region had it right all along.
          </p>

          <p>
            Part of this is generational change. Williams Selyem, under winemaker Jeff Mangahas (who took over from Bob Cabral), has returned to the elegant, restrained style that made the winery famous. The protocols built around Rochioli fruit since the 1980s—foot treading, fermentation with local yeast that Burt Williams isolated—are being honored again. Recent vintages show "cool, balanced ripeness" and "fern-green freshness" rather than overripe fruit and excessive extraction.
          </p>

          <p>
            At Gary Farrell Winery, winemaker Theresa Heredia (who joined in 2012 after working at Joseph Phelps Freestone and even spending time at Domaine de Montille in Burgundy) articulated the new philosophy: "My winemaking philosophy is really about using gentle techniques that are respectful of the fruit, to capture as much site specificity as possible. I like to pick slightly on the early side of the ripeness spectrum, in order to capture freshness, purity, and vibrant acidity."
          </p>

          <p>
            This represents a dramatic shift from the mid-2000s approach. Heredia continued: "If I let the fruit ripen too much, the fruit qualities will tip toward jammy, and that's not the expression of place that I'm trying to capture. Our wines are intended to be food friendly, mouthwatering and age worthy."
          </p>

          <div className="bg-[#457b9d]/10 border-l-4 border-[#457b9d] p-6 my-8">
            <p className="font-semibold text-[#1C1C1C] mb-2">
              Kosta Browne Evolves
            </p>
            <p className="text-gray-700 mb-0">
              After selling to Duckhorn Wine Company in 2018, the winery recognized it needed to change. "We were at the risk of becoming victims of our own success," CEO Scott Becker said. Under winemaker Nico Cueva, open-top wood fermenters and concrete eggs are increasingly used. Whole cluster fermentation is back. The style is "contemporary and relevant" while respecting the region's heritage.
            </p>
          </div>

          <p>
            Even the geography is being appreciated anew. What once seemed like a liability—the region's diversity, its patchwork of microclimates and soil types—is now understood as a strength. The Russian River Valley Winegrowers have formalized the "neighborhoods" concept, recognizing six distinct sub-regions within the broader AVA: Middle Reach, Green Valley, Laguna Ridge, Santa Rosa Plain, Sebastopol Hills, and Eastern Hills.
          </p>

          <p>
            Each produces distinctively different wines. The warm Middle Reach offers "lushness in texture, length and body, and bold opulent black fruit with hints of cola spice." The cooler Sebastopol Hills offer "exotic, savory Asian spice and crisp acidity, with tons of black tea, dried herb and almost crunchy red fruit." This isn't one-size-fits-all Pinot. It's a million small plots with different soils, microclimates, and farming techniques—exactly what Pinot Noir needs to shine.
          </p>

          <p>
            Critics are noticing, too. Recent reviews celebrate wines that would have been criticized 15 years ago for being too light. A 2017 Williams Selyem Rochioli Riverblock received praise for being "distinctly beautiful in the cool, balanced ripeness of the fruit" and its "elegant, fern-green freshness." Reviewers describe it as "coming home to RRV" after years tasting overripe, over-extracted Pinots from elsewhere.
          </p>

          <p>
            The market is responding. Williams Selyem Russian River Valley Pinot Noir currently averages $131 per bottle—premium pricing that reflects renewed demand. DuMOL's Russian River Valley Pinot has seen "popularity increase considerably over the past year" according to Wine Searcher data. The region is no longer fighting an uphill battle for critical attention.
          </p>

          <p>
            More importantly, younger wine drinkers discovering Pinot Noir for the first time are finding Russian River without the baggage of trends and counter-trends. They're tasting wines from Rochioli, Williams Selyem, Gary Farrell, Kosta Browne, and newer producers like Freeman (founded 2001), and simply recognizing quality. The wines have energy, balance, and complexity. They age beautifully—verticals of Williams Selyem going back to the 1980s show wines "awash in gorgeous California red-berry fruit" that could be mistaken for "perfectly cellared Burgundy."
          </p>

          <div className="bg-[#2a9d8f]/20 border-l-4 border-[#2a9d8f] p-6 my-8">
            <p className="font-semibold text-[#1C1C1C] mb-2">
              Different, Not Better
            </p>
            <p className="text-gray-700 mb-0">
              The comparison to Oregon is instructive. Where once Willamette Valley's delicate, earthy style was seen as superior to Russian River's fruit-forward approach, now they're understood as different expressions of cool-climate Pinot. Russian River offers "riper fruit notes, fleshier mouthfeel, and more palate weight" thanks to slightly more sunshine and warmth. Oregon offers "more exotic, earth-driven characteristics." Both are valid. Both are excellent.
            </p>
          </div>

          <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-12 mb-6">
            What Old Is New Again
          </h2>

          <p>
            There's a wine industry truism that's worth remembering: fashion changes, but terroir doesn't. Russian River Valley's fog, its Goldridge soils, its proximity to the Pacific—none of that went anywhere during the region's unfashionable period. The vineyards that made great wine in 1985 still make great wine in 2025.
          </p>

          <p>
            What changed was perception. For a decade or two, the wine world decided elegant, delicate Pinot Noir wasn't "serious" enough. It wanted power, extraction, darkness, ripeness. Russian River Valley tried to adapt, and in doing so, lost some of its identity.
          </p>

          <p>
            Now, the pendulum has swung back. Younger winemakers and wine drinkers are rediscovering that "classic" Russian River style—vibrant acidity, cherry and berry fruit, delicate aromatics, that earthy mushroom note—and recognizing it as not just valid, but exceptional.
          </p>

          <p>
            The region's pioneers are still here, still farming the same vineyards. Tom Rochioli still manages the Rochioli and Allen vineyards his father planted. Williams Selyem still sources from those same sites. The 2025 vintage marked Williams Selyem's 45th anniversary—four and a half decades of benchmark California Pinot Noir. As wine critic John Winthrop Haeger wrote: "Rochioli remains the incontrovertible nexus of Pinot Noir in the Russian River Valley."
          </p>

          <p>
            But there's also a new generation. Winemakers who grew up drinking these wines, who understand the region's heritage, who have the technical skills and resources to push quality even higher. They're using concrete fermenters and whole clusters not because it's trendy, but because it works. They're pursuing elegance and balance not because critics demand it, but because that's what the terroir wants to give them.
          </p>

          <p>
            Gary Farrell's Theresa Heredia summed up what makes the region unique: "We don't currently own any estate vineyards so what makes us unique is the access that we have to some of the best vineyards in all of California. For example, we get grapes from Rochioli, Bacigalupi, Durell, Ritchie, Hallberg and Gap's Crown. In Burgundy, there are a number of producers called négociants, who purchase all of their grapes from Grand Cru and/or Premier Cru vineyards and bottle the wines under their own label. We're using the same concept, but there's no equivalent name for this type of producer in California."
          </p>

          <div className="bg-[#6d597a] text-white p-8 rounded-lg my-12">
            <p className="text-xl font-semibold mb-4">
              Russian River Valley isn't trying to be Oregon. It isn't trying to be Santa Barbara. It isn't trying to be Burgundy.
            </p>
            <p className="text-lg mb-0">
              It's content being itself—producing Pinot Noir with distinctive California character, generous fruit, and a sense of place that comes from fog and Goldridge soil and decades of accumulated vineyard wisdom.
            </p>
          </div>

          <p>
            The neighborhood initiative, which began in the late 1990s as plantings expanded dramatically, now provides clarity that wasn't possible when the AVA was first established in 1983. As one winemaker noted: "When the Russian River Valley AVA was established in 1983, the amount of planted Pinot Noir acreage was very small. Zinfandel and French Colombard accounted for more acres. The notion that wines made from grapes grown in the Russian River Valley expressed different nuances depending upon where they were grown was not yet realized."
          </p>

          <p>
            Now, with over 15,000 planted acres and 90+ wineries, those nuances are crystal clear. And consumers are appreciating them.
          </p>

          <p>
            The rest of the wine world is finally catching up to what locals knew all along: Russian River Valley makes some of the finest Pinot Noir in California. It did in 1987, when Williams Selyem shocked everyone. It did in 1998, when that first 100-point score arrived. It did during the unfashionable years when nobody was paying attention.
          </p>

          <p>
            And it does now, when old is new again, and what was once dismissed as "classic" is being rediscovered as simply exceptional.
          </p>

          <p className="text-xl font-semibold text-gray-700 mt-8">
            Some things are worth waiting for. Sometimes you have to go away before you can come home. And sometimes the best way forward is to remember what made you special in the first place.
          </p>

          <p className="text-xl font-semibold text-[#722F37] mt-4">
            Welcome back, Russian River Valley. We missed you.
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
          </div>
        </div>
      </article>
    </div>
  );
}
