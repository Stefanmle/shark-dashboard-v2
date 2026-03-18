import React from 'react';

function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-shark-700/50 to-transparent" />
      <span className="mx-4 text-shark-600 text-lg">&#x2022;</span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-shark-700/50 to-transparent" />
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-shark-900/60 border border-shark-700/30 rounded-xl p-5 text-center">
      <div className="text-3xl font-bold text-ocean-400 mb-1">{value}</div>
      <div className="text-sm text-shark-400">{label}</div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group bg-shark-900/40 border border-shark-700/20 rounded-xl overflow-hidden">
      <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-left text-white font-medium hover:bg-shark-800/30 transition-colors list-none">
        <span>{question}</span>
        <svg
          className="w-5 h-5 text-ocean-400 transition-transform group-open:rotate-180 flex-shrink-0 ml-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="px-6 pb-5 text-shark-300 leading-relaxed border-t border-shark-700/20 pt-4">
        {answer}
      </div>
    </details>
  );
}

export function LandingContent() {
  return (
    <section className="bg-shark-950 text-shark-200" id="about">
      {/* Scroll indicator */}
      <div className="flex flex-col items-center py-8 bg-gradient-to-b from-shark-950 to-shark-950/95">
        <div className="animate-bounce text-shark-500 mb-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        <span className="text-xs text-shark-500 uppercase tracking-widest">Scroll for more</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20">
        {/* Hero / H1 */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Global Shark Attack Map &amp; Database
          </h1>
          <p className="text-lg md:text-xl text-shark-300 max-w-3xl mx-auto leading-relaxed">
            The most comprehensive interactive visualization of <strong className="text-ocean-400">6,773 shark attacks</strong> worldwide.
            Explore over a century of shark-human encounters sourced from
            the <a href="https://www.sharkattackfile.net/" target="_blank" rel="noopener noreferrer" className="text-ocean-400 underline underline-offset-2 hover:text-ocean-300 transition-colors">Global Shark Attack File (GSAF)</a>,
            the world's leading shark attack database.
          </p>
          <nav className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
            <a href="#statistics" className="bg-shark-800/60 hover:bg-shark-800 border border-shark-700/40 text-shark-200 px-4 py-2 rounded-lg transition-colors">Statistics</a>
            <a href="#species" className="bg-shark-800/60 hover:bg-shark-800 border border-shark-700/40 text-shark-200 px-4 py-2 rounded-lg transition-colors">Dangerous Species</a>
            <a href="#countries" className="bg-shark-800/60 hover:bg-shark-800 border border-shark-700/40 text-shark-200 px-4 py-2 rounded-lg transition-colors">Attacks by Country</a>
            <a href="#prevention" className="bg-shark-800/60 hover:bg-shark-800 border border-shark-700/40 text-shark-200 px-4 py-2 rounded-lg transition-colors">Prevention</a>
            <a href="#faq" className="bg-shark-800/60 hover:bg-shark-800 border border-shark-700/40 text-shark-200 px-4 py-2 rounded-lg transition-colors">FAQ</a>
          </nav>
        </header>

        {/* Statistics Section */}
        <article id="statistics" className="scroll-mt-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-ocean-400">&#x2587;</span>
            Shark Attack Statistics
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard value="6,773" label="Total Recorded Attacks" />
            <StatCard value="1,500+" label="Fatal Attacks" />
            <StatCard value="150+" label="Countries Affected" />
            <StatCard value="70-100" label="Attacks per Year" />
          </div>

          <div className="space-y-4 text-shark-300 leading-relaxed">
            <p>
              Shark attack statistics paint a vivid picture of how humans and sharks interact across the world's oceans.
              The Global Shark Attack File has documented <strong className="text-white">6,773 shark attack incidents</strong> spanning
              from the early 1900s to the present day. While the raw numbers may seem alarming, the data reveals that
              shark attacks remain exceedingly rare events. On average, roughly <strong className="text-white">70 to 100 unprovoked shark attacks</strong> are
              reported globally each year, with only 5 to 10 resulting in fatalities.
            </p>
            <p>
              Historical trends in shark attack data show a gradual increase in reported incidents over the past century.
              However, marine biologists attribute this rise primarily to increased human water recreation, improved
              global reporting systems, and growing coastal populations rather than changes in shark behavior. The
              decade-by-decade breakdown available in our <a href="#" className="text-ocean-400 underline underline-offset-2 hover:text-ocean-300">interactive dashboard above</a> shows
              how shark attack reporting has evolved alongside population growth and the rise of water sports.
            </p>
            <p>
              When examining shark attack data by activity, surfing and board sports account for the largest share of
              incidents, followed by swimming and wading. This is unsurprising, as surfers spend extended periods in the
              surf zone where sharks hunt. Divers, despite spending more time submerged, experience comparatively fewer
              attacks, likely due to their awareness of underwater surroundings and less erratic movements.
            </p>
          </div>
        </article>

        <SectionDivider />

        {/* Species Section */}
        <article id="species" className="scroll-mt-8 mb-16 mt-16">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-danger-400">&#x2587;</span>
            Most Dangerous Shark Species
          </h2>

          <div className="space-y-4 text-shark-300 leading-relaxed">
            <p>
              Of the more than 500 known shark species, only a small handful are responsible for the majority of attacks
              on humans. The <strong className="text-white">"Big Three"</strong> — the <strong className="text-danger-400">great white shark</strong> (<em>Carcharodon carcharias</em>),
              the <strong className="text-danger-400">tiger shark</strong> (<em>Galeocerdo cuvier</em>), and the <strong className="text-danger-400">bull shark</strong> (<em>Carcharhinus leucas</em>) —
              account for the vast majority of serious and fatal shark attacks worldwide.
            </p>
            <p>
              The <strong className="text-white">great white shark</strong> holds the record for the most documented
              attacks on humans. Growing up to 20 feet in length and weighing over 4,000 pounds, great whites are apex
              predators found in cool, coastal waters worldwide. Most great white attacks are believed to be
              investigatory "test bites" rather than predatory behavior — the sharks release their human victims once
              they realize they are not their preferred prey of seals and sea lions. Despite their fearsome reputation,
              great white sharks are listed as vulnerable by the IUCN.
            </p>
            <p>
              The <strong className="text-white">tiger shark</strong> is considered the most dangerous shark in tropical
              waters. Known for their indiscriminate diet, tiger sharks consume everything from fish and seals to
              sea turtles and even garbage. They are most prevalent in the waters around Hawaii, the Caribbean, and
              the western Pacific. The <strong className="text-white">bull shark</strong> may be the most dangerous of
              all due to its unique ability to survive in both saltwater and freshwater. Bull sharks have been found
              hundreds of miles up rivers, including the Mississippi, the Amazon, and the Ganges. Their preference for
              shallow, warm coastal waters brings them into close contact with swimmers and waders in areas where
              shark encounters would otherwise be unexpected.
            </p>
          </div>

          {/* Species quick-reference cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gradient-to-br from-shark-900/80 to-shark-900/40 border border-danger-700/20 rounded-xl p-5">
              <h3 className="text-lg font-bold text-white mb-1">Great White Shark</h3>
              <p className="text-sm text-danger-400 italic mb-3">Carcharodon carcharias</p>
              <ul className="text-sm text-shark-300 space-y-1.5">
                <li>&#x2022; Up to 20 ft (6 m) in length</li>
                <li>&#x2022; Most recorded attacks on humans</li>
                <li>&#x2022; Cool coastal waters worldwide</li>
                <li>&#x2022; Investigatory "test bite" behavior</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-shark-900/80 to-shark-900/40 border border-danger-700/20 rounded-xl p-5">
              <h3 className="text-lg font-bold text-white mb-1">Tiger Shark</h3>
              <p className="text-sm text-danger-400 italic mb-3">Galeocerdo cuvier</p>
              <ul className="text-sm text-shark-300 space-y-1.5">
                <li>&#x2022; Up to 16 ft (5 m) in length</li>
                <li>&#x2022; Most dangerous in tropics</li>
                <li>&#x2022; Indiscriminate "garbage eater" diet</li>
                <li>&#x2022; Hawaii, Caribbean, W. Pacific</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-shark-900/80 to-shark-900/40 border border-danger-700/20 rounded-xl p-5">
              <h3 className="text-lg font-bold text-white mb-1">Bull Shark</h3>
              <p className="text-sm text-danger-400 italic mb-3">Carcharhinus leucas</p>
              <ul className="text-sm text-shark-300 space-y-1.5">
                <li>&#x2022; Up to 11 ft (3.5 m) in length</li>
                <li>&#x2022; Thrives in freshwater and saltwater</li>
                <li>&#x2022; Found far upriver in major rivers</li>
                <li>&#x2022; Shallow, warm coastal waters</li>
              </ul>
            </div>
          </div>
        </article>

        <SectionDivider />

        {/* Countries Section */}
        <article id="countries" className="scroll-mt-8 mb-16 mt-16">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-shark-400">&#x2587;</span>
            Shark Attacks by Country
          </h2>

          <div className="space-y-4 text-shark-300 leading-relaxed">
            <p>
              The geographic distribution of shark attacks reveals clear hotspots shaped by ocean temperature,
              coastal population density, and marine biodiversity. The <strong className="text-white">United States</strong> leads
              the world in total recorded shark attacks, accounting for roughly a third of all documented incidents.
              Within the US, <strong className="text-white">Florida</strong> dominates the statistics — <strong className="text-ocean-400">Volusia County</strong> alone
              reports more shark attacks than most entire countries, earning it the informal title of "Shark Attack Capital of the World."
              The warm, shallow waters of the Atlantic coast, combined with heavy beach usage and abundant baitfish, create
              ideal conditions for shark-human encounters.
            </p>
            <p>
              <strong className="text-white">Australia</strong> ranks second globally, with the majority of attacks
              concentrated along the coasts of New South Wales, Queensland, and Western Australia. Australian attacks
              tend to involve larger species — particularly great whites and bull sharks — and consequently have a higher
              fatality rate than US incidents. <strong className="text-white">South Africa</strong> rounds out the top three,
              with the waters around KwaZulu-Natal, the Eastern Cape, and the Western Cape being the most affected
              regions. The annual sardine run along South Africa's east coast draws large predators including sharks
              close to shore.
            </p>
            <p>
              Beyond the top three, <strong className="text-white">Brazil</strong>, the <strong className="text-white">Bahamas</strong>,
              <strong className="text-white">Papua New Guinea</strong>, and <strong className="text-white">Reunion Island</strong> (France)
              report notable shark attack numbers. Reunion Island has seen a disproportionately high number of fatal attacks
              relative to its small size, leading to extensive shark-management programs and beach closures. In the
              Asia-Pacific region, countries such as <strong className="text-white">Indonesia</strong>, the <strong className="text-white">Philippines</strong>,
              and <strong className="text-white">Fiji</strong> also report recurring incidents, though many are believed to go undocumented
              in remote areas. Our <a href="#" className="text-ocean-400 underline underline-offset-2 hover:text-ocean-300">interactive map above</a> lets you explore every
              recorded incident by country, with filters for time period, species, and outcome.
            </p>
          </div>

          {/* Top countries list */}
          <div className="mt-8 bg-shark-900/40 border border-shark-700/20 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-shark-700/20">
              <h3 className="text-lg font-semibold text-white">Top 10 Countries by Shark Attacks</h3>
            </div>
            <div className="divide-y divide-shark-700/20">
              {[
                { rank: 1, country: 'United States', attacks: '2,300+', hotspot: 'Florida (Volusia County)' },
                { rank: 2, country: 'Australia', attacks: '1,300+', hotspot: 'New South Wales, Queensland' },
                { rank: 3, country: 'South Africa', attacks: '580+', hotspot: 'KwaZulu-Natal, Western Cape' },
                { rank: 4, country: 'Brazil', attacks: '110+', hotspot: 'Pernambuco (Recife)' },
                { rank: 5, country: 'Bahamas', attacks: '100+', hotspot: 'Nassau, Grand Bahama' },
                { rank: 6, country: 'Papua New Guinea', attacks: '95+', hotspot: 'Coastal villages' },
                { rank: 7, country: 'New Zealand', attacks: '90+', hotspot: 'North Island coasts' },
                { rank: 8, country: 'Reunion Island', attacks: '60+', hotspot: 'West coast beaches' },
                { rank: 9, country: 'Mexico', attacks: '55+', hotspot: 'Baja California, Guerrero' },
                { rank: 10, country: 'Philippines', attacks: '50+', hotspot: 'Visayas, Mindanao' },
              ].map((row) => (
                <div key={row.rank} className="flex items-center px-6 py-3 hover:bg-shark-800/20 transition-colors">
                  <span className="text-sm font-bold text-shark-500 w-8">{row.rank}</span>
                  <span className="text-white font-medium flex-1">{row.country}</span>
                  <span className="text-ocean-400 font-semibold w-24 text-right">{row.attacks}</span>
                  <span className="text-shark-400 text-sm w-56 text-right hidden md:block">{row.hotspot}</span>
                </div>
              ))}
            </div>
          </div>
        </article>

        <SectionDivider />

        {/* Prevention Section */}
        <article id="prevention" className="scroll-mt-8 mb-16 mt-16">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-ocean-400">&#x2587;</span>
            Shark Attack Prevention
          </h2>

          <div className="space-y-4 text-shark-300 leading-relaxed">
            <p>
              While the risk of a shark attack remains statistically minute — you are approximately <strong className="text-white">10 times more
              likely to be struck by lightning</strong> — there are evidence-based strategies that can further reduce
              your risk of an encounter. Understanding shark behavior and taking simple precautions can make ocean
              activities significantly safer.
            </p>
            <p>
              <strong className="text-white">Time your water activities carefully.</strong> Sharks are crepuscular predators,
              meaning they are most active during dawn and dusk. Avoid entering the water during these low-light periods
              when sharks are actively hunting and their ability to distinguish prey from non-prey is reduced.
              Swimming in well-lit conditions during midday significantly reduces encounter risk. Additionally, avoid
              the water at night when visibility is essentially zero for both you and sharks.
            </p>
            <p>
              <strong className="text-white">Be aware of your environment.</strong> Stay away from areas where people are
              fishing, as bait and hooked fish attract sharks. Avoid swimming near river mouths and channels where
              nutrient-rich water attracts baitfish and their predators. Murky water, sandbars, and steep drop-offs
              are favored hunting grounds for sharks. Swim in groups, as solitary individuals are more likely to be
              approached. Avoid wearing shiny jewelry, which can resemble the iridescent scales of fish. Do not enter
              the water if you are bleeding, as sharks can detect blood in minute concentrations from considerable
              distances.
            </p>
          </div>

          {/* Prevention tips grid */}
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {[
              { icon: '&#x2600;', title: 'Swim During Daylight', desc: 'Avoid dawn, dusk, and nighttime when sharks are most active hunters.' },
              { icon: '&#x1F465;', title: 'Swim in Groups', desc: 'Solitary swimmers are more vulnerable. Sharks are less likely to approach groups.' },
              { icon: '&#x1F3A3;', title: 'Avoid Fishing Areas', desc: 'Bait, chum, and hooked fish attract sharks. Keep your distance from anglers.' },
              { icon: '&#x1F30A;', title: 'Stay in Clear Water', desc: 'Avoid murky water, river mouths, and sandbars where sharks hunt by ambush.' },
              { icon: '&#x1F48D;', title: 'Skip the Jewelry', desc: 'Shiny metal can resemble fish scales and attract curious sharks.' },
              { icon: '&#x1F6A9;', title: 'Heed Warning Flags', desc: 'Always obey beach flag systems and local shark advisory warnings.' },
            ].map((tip) => (
              <div key={tip.title} className="flex gap-4 bg-shark-900/40 border border-shark-700/20 rounded-xl p-5">
                <span className="text-2xl flex-shrink-0" dangerouslySetInnerHTML={{ __html: tip.icon }} />
                <div>
                  <h3 className="text-white font-semibold mb-1">{tip.title}</h3>
                  <p className="text-sm text-shark-400">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <SectionDivider />

        {/* FAQ Section */}
        <article id="faq" className="scroll-mt-8 mb-16 mt-16">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-shark-300">&#x2587;</span>
            Frequently Asked Questions About Shark Attacks
          </h2>

          <div className="space-y-3">
            <FAQItem
              question="How many shark attacks happen each year?"
              answer="On average, there are approximately 70 to 100 unprovoked shark attacks reported worldwide each year, according to the International Shark Attack File (ISAF) maintained by the Florida Museum. Of these, around 5 to 10 are fatal. The actual number may be higher due to unreported incidents in remote coastal areas of developing nations. Provoked attacks — incidents where humans initiated contact, such as during fishing or diving with sharks — add to the total but are tracked separately."
            />
            <FAQItem
              question="Which country has the most shark attacks?"
              answer="The United States leads the world in recorded shark attacks with over 2,300 documented incidents, followed by Australia (1,300+) and South Africa (580+). Within the US, Florida accounts for the highest number of incidents — Volusia County alone has more recorded attacks than most entire countries. These three nations together account for the majority of all documented shark attacks globally, though this partly reflects better reporting infrastructure."
            />
            <FAQItem
              question="What shark species is responsible for the most attacks on humans?"
              answer="The three species most commonly involved in unprovoked shark attacks on humans are the great white shark (Carcharodon carcharias), the tiger shark (Galeocerdo cuvier), and the bull shark (Carcharhinus leucas). Together, these 'Big Three' account for the majority of serious and fatal attacks. However, many shark attack reports list the species as 'unidentified,' so the true species distribution may differ from recorded data."
            />
            <FAQItem
              question="How can you reduce your risk of a shark attack?"
              answer="To minimize shark encounter risk: swim during midday rather than dawn or dusk; stay in groups; avoid areas where people are fishing or where baitfish are schooling; stay out of murky water and away from river mouths; avoid wearing shiny jewelry; do not enter the water if bleeding; and always heed local shark advisories and beach warning flag systems. Despite the fear they inspire, sharks pose an extremely low statistical risk to swimmers."
            />
            <FAQItem
              question="Are shark attacks increasing over time?"
              answer="The number of reported shark attacks has risen gradually over the past century, but this increase is largely attributed to growing coastal populations, greater participation in ocean recreation, and improved global reporting systems — not to changes in shark behavior or population growth. In fact, many shark species have experienced significant population declines due to overfishing, bycatch, and habitat loss."
            />
            <FAQItem
              question="What is the Global Shark Attack File (GSAF)?"
              answer="The Global Shark Attack File (GSAF) is a comprehensive, publicly available database maintained by the Shark Research Institute. It documents shark attack incidents worldwide with details including date, location, species (when identified), victim activity, injury description, and outcome. The GSAF is one of the primary sources used by researchers, journalists, and policymakers studying shark-human interactions. This dashboard visualizes 6,773 incidents from the GSAF dataset."
            />
            <FAQItem
              question="What should you do if you encounter a shark?"
              answer="If you spot a shark while in the water, remain calm and avoid sudden movements. Maintain eye contact with the shark and slowly back away toward shore or your boat. Do not splash or thrash, as erratic movements can trigger predatory instincts. If a shark approaches aggressively, make yourself look as large as possible and be prepared to firmly strike the shark's nose, gills, or eyes — its most sensitive areas — as a last resort. Exit the water as calmly and quickly as possible."
            />
          </div>
        </article>

        <SectionDivider />

        {/* Data Attribution */}
        <footer className="mt-16 text-center">
          <div className="bg-shark-900/40 border border-shark-700/20 rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl font-bold text-white mb-4">About This Shark Attack Dashboard</h2>
            <p className="text-shark-300 leading-relaxed max-w-3xl mx-auto mb-4">
              This interactive shark attack map and database visualizes <strong className="text-white">6,773 recorded shark attack incidents</strong> from
              the <a href="https://www.sharkattackfile.net/" target="_blank" rel="noopener noreferrer" className="text-ocean-400 underline underline-offset-2 hover:text-ocean-300">Global Shark Attack File (GSAF)</a>,
              maintained by the Shark Research Institute. The GSAF is the world's most comprehensive database of shark-human
              interactions, used by researchers, marine biologists, and ocean safety professionals worldwide.
            </p>
            <p className="text-shark-300 leading-relaxed max-w-3xl mx-auto mb-6">
              Data is presented for educational and research purposes. Individual incident data may contain inaccuracies
              inherent to historical records. For the most current and authoritative shark attack data, please consult
              the <a href="https://www.sharkattackfile.net/" target="_blank" rel="noopener noreferrer" className="text-ocean-400 underline underline-offset-2 hover:text-ocean-300">GSAF</a> and
              the <a href="https://www.floridamuseum.ufl.edu/shark-attacks/" target="_blank" rel="noopener noreferrer" className="text-ocean-400 underline underline-offset-2 hover:text-ocean-300">International Shark Attack File (ISAF)</a> directly.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-shark-500">
              <span>Data: GSAF / Shark Research Institute</span>
              <span className="hidden md:inline">|</span>
              <span>Visualization: Leaflet + React</span>
              <span className="hidden md:inline">|</span>
              <span>6,773 incidents mapped</span>
            </div>
          </div>

          <p className="text-shark-600 text-sm mt-8 mb-4">
            &copy; {new Date().getFullYear()} Shark Attack Dashboard. Shark attack data sourced from the Global Shark Attack File (GSAF).
          </p>
        </footer>
      </div>
    </section>
  );
}
