/**
 * mockArticles.js
 * ----------------
 * Static mock data for the Knowledge Hub.
 * Structured with block-level content to mimic a headless CMS integration.
 */

export const MOCK_ARTICLES = [
  {
    id: 'a-1',
    slug: 'understanding-the-pigeon-blood-ruby',
    title: 'Understanding the "Pigeon Blood" Ruby',
    category: 'Gem History',
    excerpt: 'The story behind the most coveted color in the world of rubies and why Mogok remains the undisputed king of origin.',
    coverImage: '/images/knowledge/ruby.png',
    author: 'Dr. Alistair Vance',
    publishedDate: '2024-05-12',
    readTime: '6 min read',
    featured: true,
    content: [
      {
        type: 'paragraph',
        value: 'For centuries, the term "pigeon blood" has been whispered in the gem trade with a mix of reverence and awe. But what exactly defines this elusive colour, and why does it command such a premium at international auctions?'
      },
      {
        type: 'heading',
        value: 'The Origins of the Term'
      },
      {
        type: 'paragraph',
        value: 'The origin of the phrase is deeply rooted in Burmese folklore. Traditionally, it refers to the colour of the first two drops of blood from a freshly killed pigeon. While the imagery is visceral, it accurately captures the vivid, slightly purplish-red hue that is the hallmark of the finest rubies.'
      },
      {
        type: 'quote',
        value: 'To hold a true pigeon blood ruby is to hold a glowing ember that refuses to be extinguished.'
      },
      {
        type: 'paragraph',
        value: 'What sets true pigeon blood rubies apart is their strong red fluorescence under ultraviolet light—a natural phenomenon caused by high chromium content and low iron. This fluorescence gives the stone an inner glow, making it appear as if it is illuminated from within, even under normal daylight.'
      },
      {
        type: 'heading',
        value: 'The Mogok Connection'
      },
      {
        type: 'paragraph',
        value: 'While beautiful rubies are mined in Mozambique, Madagascar, and Vietnam, the standard-bearer remains the Mogok Valley in Myanmar (Burma). The unique geology of Mogok, a collision of marble and metamorphic rock, provides the perfect recipe for chromium-rich corundum with minimal iron.'
      },
      {
        type: 'image',
        url: '/images/knowledge/ruby-2.png',
        caption: 'A stunning example of an unheated Burmese ruby.'
      },
      {
        type: 'paragraph',
        value: 'When evaluating a pigeon blood ruby, always demand certification from a reputable laboratory like GRS, GIA, or SSEF. Only these institutions have the strict colour-grading criteria necessary to append the coveted "Pigeon Blood" descriptor to a certification.'
      }
    ]
  },
  {
    id: 'a-2',
    slug: 'the-importance-of-independent-certification',
    title: 'The Importance of Independent Certification',
    category: 'Certification & Grading',
    excerpt: 'Why relying on a single origin report is no longer enough in the modern era of gemology.',
    coverImage: '/images/knowledge/cert.png',
    author: 'Elena Rostova',
    publishedDate: '2024-04-28',
    readTime: '4 min read',
    featured: false,
    content: [
      {
        type: 'paragraph',
        value: 'In the high-stakes world of fine gemstone investment, trust is paramount. However, trust should always be verified. The bedrock of this verification is the independent gemological report.'
      },
      {
        type: 'heading',
        value: 'Why Certification Matters'
      },
      {
        type: 'paragraph',
        value: 'A certificate from a recognized laboratory—such as the Gemological Institute of America (GIA), the Swiss Gemmological Institute (SSEF), or GemResearch Swisslab (GRS)—serves as a stone\'s passport. It confirms its identity, weight, dimensions, and most importantly, any treatments it has undergone.'
      },
      {
        type: 'quote',
        value: 'The difference between an unheated sapphire and a heated one can mean a price variance of over 300%. A certificate is your only absolute defense.'
      },
      {
        type: 'paragraph',
        value: 'As treatment technologies become more sophisticated (such as beryllium diffusion or high-pressure high-temperature treatments), the naked eye, and even the standard jeweler\'s loupe, are no longer sufficient.'
      }
    ]
  },
  {
    id: 'a-3',
    slug: 'navigating-ceylon-sapphires',
    title: 'Navigating the World of Ceylon Sapphires',
    category: 'Buying Guide',
    excerpt: 'A comprehensive guide to selecting the perfect Sri Lankan sapphire, from cornflower blue to padparadscha.',
    coverImage: '/images/knowledge/sapphire.png',
    author: 'Sunil Weeraratne',
    publishedDate: '2024-03-15',
    readTime: '8 min read',
    featured: false,
    content: [
      {
        type: 'paragraph',
        value: 'Sri Lanka, historically known as Ceylon, is one of the world\'s oldest and most prolific sources of fine sapphires. Known as the "Island of Gems," its gravels have yielded some of the largest and most famous sapphires in history.'
      },
      {
        type: 'heading',
        value: 'The Spectrum of Ceylon Blues'
      },
      {
        type: 'paragraph',
        value: 'Unlike the dark, inky blues often associated with Australian or Thai sapphires, Ceylon sapphires are celebrated for their bright, luminous hues. The most sought-after colors are "Cornflower Blue" (a bright, vivid blue with a hint of violet) and "Royal Blue" (a deep, highly saturated blue).'
      },
      {
        type: 'quote',
        value: 'A fine Ceylon sapphire doesn\'t just reflect light; it dances with it.'
      },
      {
        type: 'paragraph',
        value: 'Beyond blue, Sri Lanka is the primary source of the extraordinarily rare Padparadscha sapphire—a delicate balance of pink and orange, named after the lotus flower.'
      }
    ]
  },
  {
    id: 'a-4',
    slug: 'the-ethics-of-artisanal-mining',
    title: 'The Ethics and Impact of Artisanal Mining',
    category: 'Mining & Origin',
    excerpt: 'How traditional mining practices in Sri Lanka protect the environment and support local communities.',
    coverImage: '/images/knowledge/mining-1.jpg',
    author: 'Dr. Alistair Vance',
    publishedDate: '2024-02-10',
    readTime: '5 min read',
    featured: false,
    content: [
      {
        type: 'paragraph',
        value: 'In an era where "conflict-free" and "sustainable" are crucial factors for luxury buyers, Sri Lanka\'s gem mining industry stands out as a unique model of traditional, ethical extraction.'
      },
      {
      type: 'image',
      url: '/images/knowledge/mining-2.jpg',
      caption: 'A mining team gathers around a traditionally woven "kulla" basket used to transport gem-bearing gravel from the pit.'
    },
      {
        type: 'heading',
        value: 'The "Patal" System'
      },
      {
        type: 'paragraph',
        value: 'Mining in Sri Lanka is largely artisanal. The traditional pit mining method, known as "Patal," involves sinking vertical shafts into the gem-bearing gravel (illam). This method is highly regulated by the government to prevent environmental degradation.'
      },
      {
      type: 'image',
      url: '/images/knowledge/mining-3.jpg',
      caption: 'Freshly extracted gravel is inspected before being carried to a nearby stream for washing.'
    },
    {
      type: 'paragraph',
      value: 'Once the illam is brought to the surface, it must be washed to remove clay and silt, revealing any gem rough hidden within. This is traditionally done by hand in a nearby river or stream.'
    },
    {
      type: 'image',
      url: '/images/knowledge/mining-1.jpg',
      caption: 'Miners use flat, woven "wallam" sieves to wash and sort gravel in a stream — a technique passed down through generations.'
    },
      {
        type: 'paragraph',
        value: 'Furthermore, the proceeds of a find are traditionally split among the workers, the land owner, and the financier, ensuring that the wealth generated by the land directly benefits the local community.'
      },
      {
      type: 'image',
      url: '/images/knowledge/mining-4.jpg',
      caption: 'Two miners sort through washed gravel by hand, searching for gem rough.'
    }
    ]
  },
  {
    id: 'a-5',
    slug: 'investing-in-colored-gemstones',
    title: 'Investing in Colored Gemstones vs. Diamonds',
    category: 'Buying Guide',
    excerpt: 'An analytical look at the rising market value of colored stones over the past decade.',
    coverImage: '/images/knowledge/diamand vs gems.png',
    author: 'Elena Rostova',
    publishedDate: '2024-01-22',
    readTime: '7 min read',
    featured: false,
    content: [
      {
        type: 'paragraph',
        value: 'For generations, white diamonds were the undisputed champions of the gemstone investment world. However, the last two decades have seen a dramatic shift in collector focus toward exceptional colored gemstones.'
      },
      {
        type: 'heading',
        value: 'The Rarity Factor'
      },
      {
        type: 'paragraph',
        value: 'The simple truth driving the colored gemstone market is rarity. A high-quality, unheated, three-carat Burmese ruby is exponentially rarer than a three-carat, D-flawless diamond. As supply from historical mines depletes, the value of these unheated natural wonders continues to soar.'
      }
    ]
  },
  {
    id: 'a-6',
    slug: 'understanding-emerald-enhancements',
    title: 'Understanding Emerald Enhancements',
    category: 'Certification & Grading',
    excerpt: 'Demystifying oiling, resin treatments, and what is considered acceptable in high-end emeralds.',
    coverImage: '/images/knowledge/emerald.png',
    author: 'Dr. Alistair Vance',
    publishedDate: '2023-11-05',
    readTime: '5 min read',
    featured: false,
    content: [
      {
        type: 'paragraph',
        value: 'Emeralds are uniquely prone to surface-reaching fractures. Because of this, it has been standard practice for centuries to treat rough emeralds with oil (like cedarwood oil) to improve their clarity.'
      },
      {
        type: 'heading',
        value: 'Acceptable vs. Unacceptable Treatments'
      },
      {
        type: 'paragraph',
        value: 'Minor to moderate oiling with natural cedarwood oil is entirely accepted in the trade. However, treatments involving colored oils or synthetic resins (like Opticon) are frowned upon in the high-end market.'
      }
    ]
  },
  {
    id: 'a-7',
    slug: 'the-lost-mines-of-kashmir',
    title: 'The Lost Mines of Kashmir',
    category: 'Gem History',
    excerpt: 'The brief, legendary history of the sapphire mines that set the benchmark for blue forever.',
    coverImage: '/images/knowledge/kashmir-sapphire-mines.png',
    author: 'Sunil Weeraratne',
    publishedDate: '2023-09-18',
    readTime: '6 min read',
    featured: false,
    content: [
      {
        type: 'paragraph',
        value: 'In 1881, a landslide in the Zanskar range of the Himalayas revealed a pocket of sapphires the likes of which the world had never seen. The stones possessed a velvety, "cornflower" blue that seemed unaffected by changes in lighting.'
      },
      {
        type: 'quote',
        value: 'A Kashmir sapphire does not ask for attention; it demands it with quiet, undeniable authority.'
      },
      {
        type: 'paragraph',
        value: 'The original mines were largely exhausted within a decade. Today, a certified Kashmir sapphire is a multi-million dollar auction headliner, representing the absolute pinnacle of sapphire collecting.'
      }
    ]
  },
  {
    id: 'a-8',
    slug: 'how-to-read-a-grs-report',
    title: 'How to Read a GRS Report',
    category: 'Certification & Grading',
    excerpt: 'A practical breakdown of the GemResearch Swisslab certification terminology.',
    coverImage: '/images/knowledge/cert.png',
    author: 'Elena Rostova',
    publishedDate: '2023-08-30',
    readTime: '4 min read',
    featured: false,
    content: [
      {
        type: 'paragraph',
        value: 'GemResearch Swisslab (GRS) is one of the most respected colored stone laboratories in the world, particularly famous for creating industry-standard color terms like "Pigeon Blood" and "Muzo Green".'
      },
      {
        type: 'heading',
        value: 'Deciphering the Comments Section'
      },
      {
        type: 'paragraph',
        value: 'The most critical section of any GRS report is the "Comments" field. An entry of "No indication of thermal treatment" is the golden phrase every investor looks for. If the stone is heated, it will be clearly denoted as "H" (heated), with further sub-grades indicating the presence of residues.'
      }
    ]
  }
];

export async function fetchArticles(filters = {}) {
  await new Promise(r => setTimeout(r, 600)); // Simulate network latency

  let articles = [...MOCK_ARTICLES];

  if (filters.category && filters.category !== 'All') {
    articles = articles.filter(a => a.category === filters.category);
  }

  return articles;
}

export async function fetchArticleBySlug(slug) {
  await new Promise(r => setTimeout(r, 400));
  return MOCK_ARTICLES.find(a => a.slug === slug) ?? null;
}
