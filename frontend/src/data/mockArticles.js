/**
 * mockArticles.js
 * ----------------
 * Comprehensive Knowledge Hub database featuring authentic Sri Lankan gem mining heritage,
 * traditional river panning, gravel sifting ("Nambuwa"), gemstone valuation, and gemology guides.
 */

export const HERITAGE_GALLERY = [
  {
    id: 'hg-1',
    title: 'Artisanal River Mining ("Dulliya")',
    location: 'Kalu Ganga Valley, Ratnapura',
    image: '/images/knowledge/traditional-river-mining.jpg',
    description: 'Miners working waist-deep in flowing river waters, using round woven baskets to swirl heavy gravel and isolate dense corundum gemstones.',
    technique: 'River Sifting (Dulliya)',
    era: 'Traditional Ceylon Heritage',
    relatedSlug: 'artisanal-river-mining-dulliya-legacy'
  },
  {
    id: 'hg-2',
    title: 'Gravel Sifting with the "Nambuwa"',
    location: 'Elahera Mining Belt, Central Province',
    image: '/images/knowledge/nambuwa-gravel-sorting.jpg',
    description: 'A master miner using the conical bamboo sifting tray ("Nambuwa") to wash off silt and inspect gem-bearing gravel under natural sunlight.',
    technique: 'Conical Sifting & Washing',
    era: 'Artisanal Gemology',
    relatedSlug: 'inside-the-nambuwa-ceylon-gravel-sifting'
  },
  {
    id: 'hg-3',
    title: 'Traditional Gem Miners Guild',
    location: 'Pelmadulla, Sabaragamuwa',
    image: '/images/knowledge/ceylon-miners-group-heritage.jpg',
    description: 'A community pit-mining crew ("Patal Karu") gathered with bamboo gem baskets after a successful day of extracting raw gravel from deep illam layers.',
    technique: 'Patal Karu Profit-Sharing',
    era: 'Ethical & Community Mining',
    relatedSlug: 'heritage-of-sri-lankan-gem-pits-teamwork'
  },
  {
    id: 'hg-4',
    title: 'Mine-Site Field Evaluation',
    location: 'Meetiyagoda Moonstone & Gem Belt',
    image: '/images/knowledge/gem-stone-trade-heritage.jpg',
    description: 'Local gem prospectors and trade partners inspecting raw unheated sapphire crystal rough on the field trail directly after extraction.',
    technique: 'Field Rough Valuation',
    era: 'Mine-to-Market Trade',
    relatedSlug: 'field-trading-rough-gemstone-evaluation'
  }
];

export const GLOSSARY_TERMS = [
  {
    term: 'Illam',
    pronunciation: 'eel-lahm',
    category: 'Mining & Geology',
    definition: 'The alluvial gem-bearing gravel layer beneath topsoil in Sri Lanka, deposited over millions of years by ancient river channels containing rich concentrations of sapphire, ruby, and chrysoberyl.'
  },
  {
    term: 'Nambuwa',
    pronunciation: 'nahm-boo-wah',
    category: 'Mining Tools',
    definition: 'A conical woven bamboo or rattan sieve used by Sri Lankan miners to wash gem gravel in water, using centrifugal rotation to separate light mud from heavy gemstone rough.'
  },
  {
    term: 'Dulliya',
    pronunciation: 'dool-lee-yah',
    category: 'Mining Techniques',
    definition: 'Traditional river bed gem mining where miners stand in river currents and dredge gravel beds using long-handled scoops and circular sifting baskets.'
  },
  {
    term: 'Patal Karu',
    pronunciation: 'pah-tahl kah-roo',
    category: 'Ethical Trade',
    definition: 'The ancient Sri Lankan cooperative gem mining system where profits are divided equally among pit diggers, landowners, and equipment providers.'
  },
  {
    term: 'Padparadscha',
    pronunciation: 'pad-pah-raj-shah',
    category: 'Gemology',
    definition: 'Derived from the Sinhalese word "Padma Raga" (Lotus Flower), this refers to an extraordinarily rare sapphire exhibiting a delicate blend of pink and orange hues.'
  },
  {
    term: 'Silk (Inclusions)',
    pronunciation: 'silk',
    category: 'Certification & Grading',
    definition: 'Microscopic needle-like inclusions of rutile inside natural sapphires that create a velvety sheen and serve as primary proof of unheated, natural origin.'
  },
  {
    term: 'GRS & SSEF',
    pronunciation: 'G-R-S / S-S-E-F',
    category: 'Certification & Grading',
    definition: 'Premier international gemological laboratories (GemResearch Swisslab and Swiss Gemmological Institute) issuing authoritative origin and treatment reports.'
  }
];

export const MOCK_ARTICLES = [
  {
    id: 'a-1',
    slug: 'artisanal-river-mining-dulliya-legacy',
    title: 'Artisanal River Mining in Sri Lanka: The Legacy of "Dulliya"',
    category: 'Mining & Origin',
    tags: ['River Mining', 'Dulliya', 'Ceylon Heritage', 'Eco Mining'],
    excerpt: 'Explore the ancient technique of river bed gem mining where Ceylon miners harness flowing waters to harvest world-renowned sapphires.',
    coverImage: '/images/knowledge/traditional-river-mining.jpg',
    author: 'Sunil Weeraratne',
    authorRole: 'Master Gemologist & Mining Historian',
    publishedDate: '2024-05-18',
    readTime: '7 min read',
    featured: true,
    keyTakeaways: [
      'Sri Lanka’s river gem mining ("Dulliya") dates back over 2,000 years.',
      'River beds naturally concentrate heavy corundum crystals due to specific gravity.',
      'Strict environmental laws prohibit heavy machinery in river channels, preserving ecosystems.'
    ],
    content: [
      {
        type: 'paragraph',
        value: 'For more than two millennia, the rivers flowing down from Sri Lanka’s central highlands—most notably the Kalu Ganga and Wey Ganga—have carried treasures fit for emperors. Known locally as "Dulliya", river gem mining is one of the world’s oldest surviving sustainable extraction techniques.'
      },
      {
        type: 'heading',
        value: 'The Natural Gravity Sieve'
      },
      {
        type: 'paragraph',
        value: 'Corundum (the mineral species of sapphire and ruby) possesses a high specific gravity of ~4.0, making it significantly heavier than surrounding quartz and river sand. As monsoon rains erode primary mountain deposits, heavy gemstone rough settles deep into river beds and gravel bars.'
      },
      {
        type: 'image',
        url: '/images/knowledge/traditional-river-mining.jpg',
        caption: 'Sri Lankan river miners sifting river gravel in Kalu Ganga using traditional woven baskets.'
      },
      {
        type: 'heading',
        value: 'Step-by-Step River Mining Process'
      },
      {
        type: 'paragraph',
        value: 'Miners work in coordinated teams of 4 to 8 men. Standing chest-deep in water, they use long wooden poles to dig into deep river pockets where heavy gravel accumulates. The gravel is scooped into hand-woven circular baskets.'
      },
      {
        type: 'quote',
        value: 'In the quiet rush of the river, a single swirl of the basket can reveal a cornflower blue sapphire that has waited five million years to see the sun.'
      },
      {
        type: 'paragraph',
        value: 'By rhythmically rotating the submerged basket, light mud and light silica wash downstream, while dense sapphires, rubies, and chrysoberyls sink to the center of the basket cone.'
      },
      {
        type: 'heading',
        value: 'Eco-Friendly & Sustainable Heritage'
      },
      {
        type: 'paragraph',
        value: 'Unlike industrial open-pit mining seen in other parts of the world, Sri Lanka strictly forbids chemical leaching and heavy bulldozers in river beds. This ensures that river ecosystems remain pristine and local agricultural lands are preserved for generations to come.'
      }
    ]
  },
  {
    id: 'a-2',
    slug: 'inside-the-nambuwa-ceylon-gravel-sifting',
    title: 'Inside the "Nambuwa": Mastering Traditional Ceylon Gravel Sifting',
    category: 'Mining & Origin',
    tags: ['Nambuwa', 'Gravel Washing', 'Illam', 'Gem Sorting'],
    excerpt: 'How traditional miners use the iconic bamboo "Nambuwa" tray to isolate raw gemstones from illam gravel.',
    coverImage: '/images/knowledge/nambuwa-gravel-sorting.jpg',
    author: 'Dr. Alistair Vance',
    authorRole: 'Senior Field Gemologist',
    publishedDate: '2024-05-02',
    readTime: '6 min read',
    featured: false,
    keyTakeaways: [
      'The "Nambuwa" is a specially woven conical basket made from local bamboo and rattan.',
      'Miners use specific hand-whirling physics to separate worthless quartz from precious corundum.',
      'Experienced sorters can spot raw sapphire crystals in seconds under natural sunlight.'
    ],
    content: [
      {
        type: 'paragraph',
        value: 'If you walk through the gem mining regions of Ratnapura, Pelmadulla, or Elahera, you will see a tool that has remained unchanged for centuries: the "Nambuwa". This conical woven basket is the ultimate extension of the miner’s hands.'
      },
      {
        type: 'heading',
        value: 'The Anatomy of the Nambuwa'
      },
      {
        type: 'paragraph',
        value: 'Crafted from flexible bamboo strips treated with natural oils to prevent rotting, the Nambuwa features a precise conical shape with a tight weave near the center. The conical shape is vital—it creates a focal point where heavy minerals gather during centrifugal spinning.'
      },
      {
        type: 'image',
        url: '/images/knowledge/nambuwa-gravel-sorting.jpg',
        caption: 'A veteran Sri Lankan miner examining washed gravel in the Nambuwa under morning daylight.'
      },
      {
        type: 'heading',
        value: 'The Art of "Garana Thattuva" (Washing & Sorting)'
      },
      {
        type: 'paragraph',
        value: 'Gem-bearing gravel ("Illam") extracted from underground shafts is brought to nearby washing pits filled with clear water. Miners submerge the loaded Nambuwa and perform a rapid clockwise and counter-clockwise swirling motion.'
      },
      {
        type: 'quote',
        value: 'Sorting gem gravel is not just physical work; it requires an eye trained to distinguish rough crystal facets from ordinary pebbles under glinting sunlight.'
      },
      {
        type: 'paragraph',
        value: 'Once the mud is completely washed away, the miner flips the basket upright. In the center lies the concentrated heavy mineral residue—containing sapphires, rubies, chrysoberyl cat’s eyes, tourmalines, and spinels.'
      }
    ]
  },
  {
    id: 'a-3',
    slug: 'heritage-of-sri-lankan-gem-pits-teamwork',
    title: 'The Heritage of Sri Lankan Gem Pits: Teamwork, Karu, & Community',
    category: 'Mining & Origin',
    tags: ['Ethical Mining', 'Patal System', 'Community', 'Fair Trade'],
    excerpt: 'Discover how Sri Lanka’s traditional pit-mining cooperative model empowers local workers and supports sustainable rural communities.',
    coverImage: '/images/knowledge/ceylon-miners-group-heritage.jpg',
    author: 'Elena Rostova',
    authorRole: 'Ethical Luxury & Sustainability Analyst',
    publishedDate: '2024-04-14',
    readTime: '8 min read',
    featured: false,
    keyTakeaways: [
      'The "Patal Karu" system guarantees equitable profit splits among miners, landholders, and financiers.',
      'Pit restoration is legally mandatory upon completion to restore agricultural land.',
      'Sri Lankan artisanal mining serves as a global benchmark for ethical gemstone sourcing.'
    ],
    content: [
      {
        type: 'paragraph',
        value: 'In an era where luxury consumers demand total transparency, Sri Lanka stands as a beacon of fair-trade gemstone extraction. At the heart of this success is the traditional "Patal" (mine pit) cooperative system.'
      },
      {
        type: 'heading',
        value: 'Equal Stakes: The Karu Shared Ownership'
      },
      {
        type: 'paragraph',
        value: 'Unlike corporate mining operations where laborers receive fixed low wages, Sri Lankan gem miners operate as equity partners. Under the traditional "Karu" agreement:'
      },
      {
        type: 'paragraph',
        value: '• 1/5th to 1/3rd goes to the pit miners who perform physical extraction.\n• 1/3rd goes to the landowner whose property yielded the illam gravel.\n• The remaining portion covers timber, pump equipment, and operational permits.'
      },
      {
        type: 'image',
        url: '/images/knowledge/ceylon-miners-group-heritage.jpg',
        caption: 'A traditional Ceylon gem pit crew gathered together with sifting equipment.'
      },
      {
        type: 'quote',
        value: 'When a magnificent Padparadscha or Royal Blue sapphire is found, every worker on the pit crew shares in the life-changing profit.'
      },
      {
        type: 'heading',
        value: 'Environmental Rehabilitation'
      },
      {
        type: 'paragraph',
        value: 'When a mine pit ("Patal") has yielded its illam layer, the soil and clay removed during excavation are filled back in. Crops, tea bushes, or coconut trees are replanted, leaving zero open scars on the landscape.'
      }
    ]
  },
  {
    id: 'a-4',
    slug: 'field-trading-rough-gemstone-evaluation',
    title: 'Field Trading & Rough Gem Evaluation: From Pit to Market',
    category: 'Buying Guide',
    tags: ['Rough Gems', 'Field Trading', 'Valuation', 'Sapphire Rough'],
    excerpt: 'Inside the fast-paced world of field trading where experienced gem buyers assess raw unheated corundum directly at the mine side.',
    coverImage: '/images/knowledge/gem-stone-trade-heritage.jpg',
    author: 'Sunil Weeraratne',
    authorRole: 'Master Gemologist & Mining Historian',
    publishedDate: '2024-03-29',
    readTime: '5 min read',
    featured: false,
    keyTakeaways: [
      'Rough gemstone valuation requires inspecting internal crystal clarity, color zoning, and silk inclusions.',
      'Water immersion and pen-light illumination reveal hidden fractures before cutting.',
      'Field deals require deep trust and immediate cash settlement between miners and trade dealers.'
    ],
    content: [
      {
        type: 'paragraph',
        value: 'Step onto the red earth trails of Sabaragamuwa after a fresh gravel wash, and you will witness the high-stakes art of field trading. Here, raw rough stones change hands within minutes of leaving the river bed.'
      },
      {
        type: 'heading',
        value: 'The Field Inspection Ritual'
      },
      {
        type: 'paragraph',
        value: 'Evaluating rough corundum is vastly different from inspecting a polished gem. Dealers submerge the stone in a small glass of water or specialized optical oil to eliminate surface reflection.'
      },
      {
        type: 'image',
        url: '/images/knowledge/gem-stone-trade-heritage.jpg',
        caption: 'Miners and local gem merchants evaluating freshly found gemstone rough on the village trail.'
      },
      {
        type: 'quote',
        value: 'A skilled buyer sees through the rough skin of a crystal to visualize the finished 5-carat cushion-cut gemstone within.'
      },
      {
        type: 'paragraph',
        value: 'By shining a concentrated fiber-optic light through the crystal axes, experts check for dichroism, color saturation, internal silk needles, and stress cracks that might cause the stone to split during cutting.'
      }
    ]
  },
  {
    id: 'a-5',
    slug: 'navigating-ceylon-sapphires-cornflower-padparadscha',
    title: 'Navigating Ceylon Sapphires: Cornflower, Royal Blue & Padparadscha',
    category: 'Buying Guide',
    tags: ['Sapphire', 'Ceylon Blue', 'Padparadscha', 'Color Grading'],
    excerpt: 'A comprehensive collector’s guide to selecting exceptional Sri Lankan sapphires, from electric cornflower blues to lotus padparadscha.',
    coverImage: '/images/knowledge/sapphire.png',
    author: 'Dr. Alistair Vance',
    authorRole: 'Senior Field Gemologist',
    publishedDate: '2024-03-12',
    readTime: '9 min read',
    featured: false,
    keyTakeaways: [
      'Ceylon blues are famed for their high transparency and vivid color saturation without darkness.',
      'Padparadscha is the world’s rarest sapphire hue, requiring a delicate balance of pink and orange.',
      'Unheated Ceylon sapphires retain superior resale liquidity in global auction houses.'
    ],
    content: [
      {
        type: 'paragraph',
        value: 'Sri Lanka, historically known as Ceylon, is universally acknowledged as the "Island of Gems" (Ratna-Dweepa). Its ancient gravels have yielded many of the world’s most iconic sapphires, including the 423-carat Logan Sapphire and the Bismarck Sapphire.'
      },
      {
        type: 'heading',
        value: 'The Spectrum of Ceylon Blues'
      },
      {
        type: 'paragraph',
        value: 'Unlike Australian or Thai sapphires which often appear dark or inky due to high iron content, Ceylon sapphires possess lower iron levels. This results in luminous, fiery blues that pop brilliantly under artificial light and natural daylight alike.'
      },
      {
        type: 'image',
        url: '/images/knowledge/sapphire.png',
        caption: 'An unheated 4.2-carat Ceylon Royal Blue Sapphire with classic cushion facet proportions.'
      },
      {
        type: 'heading',
        value: 'The Sovereign Padparadscha'
      },
      {
        type: 'paragraph',
        value: 'Named after the Sinhalese word for lotus flower, the Padparadscha is a rare sapphire with a harmonized fusion of sunset orange and delicate lotus pink. True Padparadscha sapphires are overwhelmingly mined in Sri Lanka.'
      }
    ]
  },
  {
    id: 'a-6',
    slug: 'importance-of-independent-certification-gia-grs',
    title: 'The Science of Independent Certification: GIA, GRS, & SSEF Decoded',
    category: 'Certification & Grading',
    tags: ['Certification', 'GRS', 'GIA', 'Lab Reports', 'Gem Testing'],
    excerpt: 'Why multi-lab verification is essential in high-end gemstone investing and how to decipher lab report code words.',
    coverImage: '/images/knowledge/cert.png',
    author: 'Elena Rostova',
    authorRole: 'Ethical Luxury & Sustainability Analyst',
    publishedDate: '2024-02-20',
    readTime: '6 min read',
    featured: false,
    keyTakeaways: [
      'A lab report is an objective scientific analysis confirming identity, treatments, and origin.',
      'Unheated status ("No indication of thermal treatment") commands up to 300% value premiums.',
      'Top-tier labs (GIA, GRS, SSEF, Gübelin) use advanced mass spectrometry to trace geographic origin.'
    ],
    content: [
      {
        type: 'paragraph',
        value: 'In the world of high-value gemstone acquisition, trust must be backed by rigorous laboratory science. A gemological certificate issued by an independent world-class lab serves as the gemstone’s immutable passport.'
      },
      {
        type: 'heading',
        value: 'Key Code Words in Lab Reports'
      },
      {
        type: 'paragraph',
        value: '• "No Indication of Thermal Treatment" (Unheated / Natural): The gold standard. Indicates the stone’s color and clarity were formed entirely by nature.\n• "H(a)" or "H(b)": Indicates minor heat treatment with residual glass or borax flux.\n• "Pigeon Blood" / "Royal Blue": Exclusive color descriptors granted only by GRS or SSEF when saturation meets precise spectral benchmarks.'
      },
      {
        type: 'image',
        url: '/images/knowledge/cert.png',
        caption: 'Official GRS GemResearch Swisslab certificate for a natural Ceylon Sapphire.'
      }
    ]
  },
  {
    id: 'a-7',
    slug: 'understanding-emerald-and-ruby-enhancements',
    title: 'Understanding Natural Gemstone Treatments & Clarity Enhancements',
    category: 'Certification & Grading',
    tags: ['Treatments', 'Heat Treatment', 'Oiling', 'Gem Safety'],
    excerpt: 'Demystifying heat treatment, cedarwood oiling, and beryllium diffusion in rubies, sapphires, and emeralds.',
    coverImage: '/images/knowledge/emerald.png',
    author: 'Dr. Alistair Vance',
    authorRole: 'Senior Field Gemologist',
    publishedDate: '2024-01-15',
    readTime: '7 min read',
    featured: false,
    keyTakeaways: [
      'Heat treatment has been practiced for over 1,000 years to dissolve rutile silk and enrich color.',
      'Cedarwood oiling in emeralds is traditional and reversible, unlike synthetic epoxy resins.',
      'Full disclosure of treatments is mandatory under CIBJO international rules.'
    ],
    content: [
      {
        type: 'paragraph',
        value: 'Gemstone enhancement is one of the most misunderstood topics among collectors. Understanding the boundary between traditional acceptable treatments and aggressive lab modifications is vital for every buyer.'
      },
      {
        type: 'image',
        url: '/images/knowledge/emerald.png',
        caption: 'Natural Colombian Emerald undergoing microscopic clarity evaluation.'
      }
    ]
  }
];

export async function fetchArticles(filters = {}) {
  await new Promise(r => setTimeout(r, 400)); // Simulate ultra-fast network response

  let articles = [...MOCK_ARTICLES];

  if (filters.category && filters.category !== 'All') {
    articles = articles.filter(a => a.category === filters.category);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    articles = articles.filter(a => 
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      (a.tags && a.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  return articles;
}

export async function fetchArticleBySlug(slug) {
  await new Promise(r => setTimeout(r, 300));
  return MOCK_ARTICLES.find(a => a.slug === slug) ?? null;
}
