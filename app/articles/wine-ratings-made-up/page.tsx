import Link from 'next/link';

export default function WineRatingsArticle() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-[#722F37]">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/articles" className="hover:text-[#722F37]">
                Articles
              </Link>
            </li>
            <li>/</li>
            <li className="text-[#1C1C1C] font-medium">
              Wine Ratings Are Made Up
            </li>
          </ol>
        </nav>

        {/* Article Header */}
        <article className="bg-white border-3 border-[#1C1C1C] rounded-lg p-8 md:p-12">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-[#722F37] text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4">
              Opinion
            </span>
            <h1 className="font-serif text-4xl md:text-5xl italic text-[#1C1C1C] mb-4">
              Wine Ratings Are Made Up and the Points Don't Matter (But Also They Completely Matter)
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Let me tell you about wine ratings, which are a system where we pretend that the subjective experience of drinking fermented grape juice can be quantified on a 100-point scale...
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>By Wine Saint Editorial</span>
              <span>•</span>
              <span>January 27, 2026</span>
              <span>•</span>
              <span>12 min read</span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-gray-700">
              Let me tell you about wine ratings, which are a system where we pretend that the subjective experience of drinking fermented grape juice can be quantified on a 100-point scale that actually starts at 50, where different publications use completely different criteria to assign the same numbers, where a single point can mean the difference between a $30 bottle and a $300 bottle, and where approximately 75% of wine never gets rated at all.
            </p>

            <p>It's a fascinating system. It's also deeply flawed. And it completely runs the industry.</p>

            <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-10 mb-4">How We Got Here</h2>

            <p>The modern wine rating system was popularized in the 1980s by Robert Parker, who at the time was a lawyer writing a wine newsletter on the side. Parker wanted to create a system where wines would be judged on their actual merits rather than just their pedigree and reputation. This was genuinely noble—the European wine industry was deeply invested in the idea that a wine's value came from whose dirt it grew in rather than how it actually tasted.</p>

            <p>Parker's innovation was to apply a 100-point scale to wine, borrowed from the American school grading system. He famously went all-in on the 1982 Bordeaux vintage when other critics were dismissing it, saying these wines were too rich, too ripe, too opulent to be "serious" Bordeaux. He was right. They were wrong. His newsletter became Wine Advocate, and suddenly one person's palate was moving markets.</p>

            <p className="bg-[#f4d35e]/20 p-6 rounded-lg border-l-4 border-[#722F37] italic my-6">
              <strong>Note:</strong> The part-time wine critic who becomes influential enough to reshape an entire industry is a recurring pattern in wine. Often the outsider perspective—someone who isn't embedded in the traditional wine establishment—brings valuable clarity. Though it can also bring its own biases.
            </p>

            <p>Which brings us to today, where we have Wine Spectator (WS), Wine Advocate/Robert Parker (RP/WA), Wine Enthusiast (WE), Decanter (D), James Suckling (JS), Vinous (V), Jeb Dunnuck (JD), and several others, all rating wines on scales that look the same but aren't, using criteria that overlap but diverge in important ways, tasted under conditions that vary significantly, and published with descriptors that mean different things depending on who's using them.</p>

            <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-10 mb-4">The 100-Point Scale (That Doesn't Actually Use 100 Points)</h2>

            <p>Here's the first peculiarity: the 100-point scale doesn't actually use 100 points. Most systems start at 50. Some critics never publish anything below 80. So you're really working with a 50-point scale, or a 30-point scale, that we've labeled from 50-100 or 80-100 for reasons that aren't entirely clear. Presumably "100-point scale" sounds more authoritative than "50-point scale."</p>

            <p>Here's how the major scales break down:</p>

            <div className="bg-gray-50 p-6 rounded-lg my-6">
              <h3 className="font-semibold text-lg mb-3">Wine Advocate / Robert Parker:</h3>
              <ul className="space-y-2">
                <li><strong>96-100:</strong> Extraordinary</li>
                <li><strong>90-95:</strong> Outstanding</li>
                <li><strong>80-89:</strong> Barely above average to very good</li>
                <li><strong>70-79:</strong> Average</li>
              </ul>

              <h3 className="font-semibold text-lg mt-6 mb-3">Wine Spectator:</h3>
              <ul className="space-y-2">
                <li><strong>95-100:</strong> Classic: great wine</li>
                <li><strong>90-94:</strong> Outstanding</li>
                <li><strong>85-89:</strong> Very good</li>
                <li><strong>80-84:</strong> Good</li>
                <li><strong>75-79:</strong> Mediocre</li>
              </ul>

              <h3 className="font-semibold text-lg mt-6 mb-3">Wine Enthusiast:</h3>
              <ul className="space-y-2">
                <li><strong>98-100:</strong> Classic</li>
                <li><strong>94-97:</strong> Superb</li>
                <li><strong>90-93:</strong> Excellent</li>
                <li><strong>87-89:</strong> Very good</li>
                <li><strong>83-86:</strong> Good</li>
              </ul>
            </div>

            <p className="bg-[#722F37]/10 p-6 rounded-lg my-6">
              <strong>Notice the problem?</strong> Wine Spectator's 85-89 is "very good" while Wine Advocate's 80-89 range spans from "barely above average to very good." An 88-point wine from Wine Spectator is definitively "very good." An 88-point wine from Wine Advocate might be very good, or might be just above average. The number is identical but means different things.
            </p>

            <p>Wine Enthusiast considers 87-89 "very good" while 83-86 is just "good," which means an 86 from them is categorically different from an 87, but an 86 from Wine Spectator falls comfortably in the "very good" range. Meanwhile, Decanter uses medals—bronze, silver, gold, platinum—mapped to point ranges, creating yet another conversion problem.</p>

            <p>James Suckling uses a 100-point scale where 95-100 is "A+ Outstanding (and a must buy)" and anything below 88 "might still be worth buying but proceed with caution." In Suckling's system, "B" territory starts at 88, which is fairly aggressive grade inflation.</p>

            <p>These organizations are all tasting the same wines and using versions of the same scale, but an 88 means completely different things depending on who assigned it. There's no standardization, no conversion chart, no easy way for consumers to compare across publications.</p>

            <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-10 mb-4">How Wine Ratings Actually Work</h2>

            <p>Let's talk about methodology, because this is where you discover that wine ratings aren't just subjective—they're derived under wildly different conditions.</p>

            <p>Most major publications conduct "blind tastings," though "blind" means different things to different organizations. Wine Spectator does proper blind tastings where judges know the varietal, region, and vintage but not the producer or price. They taste 60-100 wines in a sitting and assign scores based on "typicity"—whether the wine expresses what you'd expect from that grape and region—plus structural elements like balance, tannins, acidity, and aromatics.</p>

            <p>Wine Advocate, however, does NOT taste blind. Their reviewers know exactly what they're tasting: producer, vineyard, vintage, everything. There's an argument for this—context matters, and knowing a wine comes from a legendary producer helps you evaluate whether they're meeting their own standards. But it's fundamentally different from blind tasting and introduces different considerations into the scoring.</p>

            <p>Decanter does blind tastings in peer groups with some context. Vinous doesn't conduct blind tastings—they taste at wineries and private tastings where everything is known. James Suckling does "mostly" blind tastings, which is an interesting qualifier that suggests some flexibility in the approach.</p>

            <p>None of these approaches is necessarily wrong. Wine Spectator is essentially saying "strip away the marketing and let's see if this wine is objectively good at being what it claims to be." Wine Advocate is saying "context matters and we should evaluate wines with full knowledge of their provenance." These are both defensible philosophies. They're also philosophies that can lead to different conclusions about the same wine.</p>

            <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-10 mb-4">The Structural Problems</h2>

            <h3 className="text-xl font-semibold text-[#722F37] mt-6 mb-3">Problem #1: The ratings shape the wines</h3>

            <p>Here's what happens: a winemaker makes a wine. Robert Parker gives it 100 points. That wine becomes nearly impossible to find and the price quintuples. Other winemakers in the region look at what succeeded—probably a bold, fruit-forward style with significant oak—and adjust their winemaking accordingly. Over time, the region starts producing wines that chase the same high-scoring profile.</p>

            <p>This is excellent if you love that style. It's less ideal if you value diversity or experimentation. The system creates a feedback loop where critics rate wines that were made to score well with critics, which becomes somewhat self-referential over time.</p>

            <h3 className="text-xl font-semibold text-[#722F37] mt-6 mb-3">Problem #2: Most wine isn't rated</h3>

            <p>Wine Spectator rates about 15,000 wines per year. Wine Advocate rates about 30,000. James Suckling's site does about 18,000. These are substantial numbers—these publications taste dozens of wines daily.</p>

            <p><strong>Yet 75% of wine globally is unrated.</strong> Tens of thousands of wineries produce hundreds of thousands of different wines every year, and most never get reviewed by major publications. They're too small, too far from established wine regions that critics focus on, or they didn't submit samples.</p>

            <p>This means the rating system performs price discovery and quality signaling for maybe 25% of the market, while the other 75% exists unquantified. Some of that 75% is genuinely poor wine. Some is probably spectacular and interesting in ways that might never score well because it's not "typical" enough.</p>

            <h3 className="text-xl font-semibold text-[#722F37] mt-6 mb-3">Problem #3: Low ratings don't get published</h3>

            <p>When did you last see a wine bottle with a shelf-talker proclaiming "79 points!"? Low ratings exist but never get advertised. Wine Advocate rates wines from 50-100, but you'll only see 90+ scores displayed in stores. This creates selection bias where ratings become purely a marketing tool rather than a complete information system.</p>

            <p>If you see a wine with no displayed rating, it doesn't necessarily mean it's bad. It might have received an 85, which is actually quite good. Or it was never submitted for review. Or it got a 73 and the winery chose not to publicize that score. There's no way to know.</p>

            <h3 className="text-xl font-semibold text-[#722F37] mt-6 mb-3">Problem #4: Critics have different palates</h3>

            <p>Even experienced critics who agree that a wine is technically well-made will diverge dramatically in the 90+ range. Some prefer bold, powerful wines with concentration and intensity. Others prefer subtle, elegant wines with restraint and finesse. These are stylistic preferences, and they result in the same wine getting notably different scores.</p>

            <p>A wine might receive 95 points from James Suckling and 89 points from Wine Spectator. Both scores accurately reflect what those critics thought. But they create confusion for consumers who assume points are objective quality measures rather than subjective taste expressions.</p>

            <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-10 mb-4">Why This System Exists (And Why It Persists)</h2>

            <p>For all its flaws, the wine rating system serves genuinely useful functions.</p>

            <p><strong>First,</strong> it provides a quality signal in a complex market. If you're in a wine shop looking at 500 bottles and don't know much about wine, a 92-point rating gives you a useful heuristic. It indicates that someone knowledgeable tasted this and thought it was very good.</p>

            <p><strong>Second,</strong> it creates accountability. Before Parker, the wine world ran largely on reputation and pedigree. Famous châteaux could rely on their name to sell wine regardless of actual quality. Parker's approach forced producers to maintain standards or risk exposure. That benefits consumers.</p>

            <p><strong>Third,</strong> it helps retailers and restaurants make decisions. When a wine shop decides which Napa Cabernets to stock, or a restaurant builds its wine list, ratings provide a practical shortcut for evaluation.</p>

            <p><strong>Fourth,</strong> it gives producers something to strive for. A 100-point wine can transform a winery's reputation and financial trajectory. That's powerful. It incentivizes quality and excellence, even if it sometimes incentivizes a specific type of quality rather than innovation or distinctiveness.</p>

            <p>The system does all these things while being inconsistent, poorly standardized, and prone to creating feedback loops that reduce diversity. It's useful but flawed. It's necessary but imperfect.</p>

            <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-10 mb-4">What You Should Actually Do</h2>

            <p>If you're buying wine and want to use ratings intelligently:</p>

            <ol className="space-y-4 my-6">
              <li className="pl-2"><strong>Pick a critic and stick with them.</strong> If you consistently enjoy wines that Jeb Dunnuck rates highly, use Dunnuck's scores as your guide. Don't try to compare across different critics—an 88 from one source isn't equivalent to an 88 from another.</li>

              <li className="pl-2"><strong>Learn what the numbers mean for your preferred source.</strong> If you're using Wine Spectator, understand that 85-89 is "very good" and 90+ is special. If you're using Wine Advocate, know their scale runs slightly differently. Read the descriptions, not just the numbers.</li>

              <li className="pl-2"><strong>Don't ignore unrated wines.</strong> Some excellent values are bottles that never got reviewed because the producer is too small or too obscure. If you see something interesting from a region you like, try it regardless of ratings.</li>

              <li className="pl-2"><strong>Remember that ratings measure typicity and technical quality, not personal enjoyment.</strong> A 95-point Burgundy and a 95-point Napa Cabernet are both excellent wines, but they taste completely different. Ratings can't tell you which one you'll prefer.</li>

              <li className="pl-2"><strong>Use ratings as one input among many.</strong> Look at the score, certainly, but also consider the price, region, vintage, varietal, and the actual tasting notes. Critics write descriptions for good reason—they contain more useful information than the number alone.</li>
            </ol>

            <p className="text-xl font-semibold mt-8 mb-4">Most importantly:</p>

            <p className="bg-[#722F37] text-white p-8 rounded-lg text-lg my-6">
              <strong>Develop your own palate.</strong> The entire ratings system assumes that experienced tasters can identify quality. You can develop this skill too. Taste widely. Notice what you enjoy. Figure out why. Over time, you'll build your own internal rating system calibrated to your preferences, which will always be more useful than what any critic can tell you.
            </p>

            <h2 className="font-serif text-3xl italic text-[#1C1C1C] mt-10 mb-4">The Conclusion</h2>

            <p>Wine ratings are an imperfect system that we've collectively decided to treat as authoritative while simultaneously acknowledging their subjectivity and inconsistency. They provide useful information and misleading information in equal measure. They help consumers navigate a complex market and also constrain that market in limiting ways.</p>

            <p>A 100-point wine isn't necessarily better than a 92-point wine in any absolute sense—it's more typical, more technically perfect, more aligned with what critics expect from great wine. Sometimes that's what you want. Sometimes you want something unusual and distinctive that might never score above 88 because it's too idiosyncratic.</p>

            <p className="text-2xl font-serif italic text-center my-12 text-[#722F37]">
              The points matter enormously to the industry. They also can't tell you what you'll actually enjoy drinking. Both things are true simultaneously.
            </p>

            <p className="text-lg">Use ratings as a tool, not a gospel. They're helpful guideposts in a vast and sometimes overwhelming wine landscape. But they're just one piece of information among many, and your own developing taste and knowledge will always be more valuable than any number on a shelf-talker.</p>

            <p className="text-xl text-center mt-8 font-semibold">
              After all, the wine that scores 95 points is only the best wine if you actually like drinking it.
            </p>
          </div>

          {/* Share/Social */}
          <div className="mt-12 pt-8 border-t-2 border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Share this article</p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-[#1C1C1C] text-white rounded-lg text-sm hover:bg-[#722F37] transition-colors">
                  Twitter
                </button>
                <button className="px-4 py-2 bg-[#1C1C1C] text-white rounded-lg text-sm hover:bg-[#722F37] transition-colors">
                  Facebook
                </button>
                <button className="px-4 py-2 bg-[#1C1C1C] text-white rounded-lg text-sm hover:bg-[#722F37] transition-colors">
                  Email
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-12">
          <h3 className="font-serif text-2xl italic text-[#1C1C1C] mb-6">Related Reading</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/articles/bordeaux-2022-vintage-report" className="group bg-white border-3 border-[#1C1C1C] rounded-lg p-6 hover:border-[#722F37] transition-colors">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Vintage Report</span>
              <h4 className="font-serif text-xl italic text-[#1C1C1C] mt-2 group-hover:text-[#722F37]">
                Bordeaux 2022: A Vintage for the Ages
              </h4>
            </Link>
            <Link href="/articles/best-wines-under-30" className="group bg-white border-3 border-[#1C1C1C] rounded-lg p-6 hover:border-[#722F37] transition-colors">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Buying Guide</span>
              <h4 className="font-serif text-xl italic text-[#1C1C1C] mt-2 group-hover:text-[#722F37]">
                The Best Wines Under $30
              </h4>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
