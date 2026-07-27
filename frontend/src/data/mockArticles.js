/**
 * mockArticles.js
 * ----------------
 * Static mock data for the Knowledge Hub.
 * Structured with block-level content to mimic a headless CMS integration.
 */

export const MOCK_ARTICLES = [
  {
    id: 'a-1',
    slug: 'the-ethics-of-artisanal-mining',
    title: 'The Ethics and Impact of Artisanal Mining',
    category: 'Mining & Origin',
    excerpt: 'How traditional river bed and pit mining practices in Sri Lanka protect the environment and support local communities.',
    coverImage: '/images/knowledge/traditional-river-mining.jpg',
    author: 'Dr. Alistair Vance',
    publishedDate: '2024-05-12',
    readTime: '6 min read',
    featured: true,
    content: [
      {
        type: 'paragraph',
        value: 'In an era where "conflict-free" and "sustainable" are crucial factors for luxury buyers, Sri Lanka\'s gem mining industry stands out as a unique model of traditional, ethical extraction.'
      },
      {
        type: 'heading',
        value: 'The "Patal" & "Dulliya" Systems'
      },
      {
        type: 'paragraph',
        value: 'Mining in Sri Lanka is largely artisanal. Traditional river bed sifting ("Dulliya") and shaft mining ("Patal") involve sinking vertical shafts into gem-bearing gravel (illam) or washing river bed sediments.'
      },
      {
        type: 'image',
        url: '/images/knowledge/traditional-river-mining.jpg',
        caption: 'Traditional Sri Lankan miners sifting gem gravel in river bed currents.'
      },
      {
        type: 'paragraph',
        value: 'Furthermore, proceeds are traditionally split among workers, land owners, and financiers, ensuring that the wealth generated directly benefits local communities.'
      }
    ]
  },
  {
    id: 'a-2',
    slug: 'navigating-ceylon-sapphires',
    title: 'Navigating the World of Ceylon Sapphires',
    category: 'Buying Guide',
    excerpt: 'A comprehensive guide to selecting the perfect Sri Lankan sapphire, from cornflower blue to padparadscha.',
    coverImage: '/images/knowledge/nambuwa-gravel-sorting.jpg',
    author: 'Sunil Weeraratne',
    publishedDate: '2024-04-28',
    readTime: '8 min read',
    featured: false,
    content: [
      {
        type: 'paragraph',
        value: 'Sri Lanka, historically known as Ceylon, is one of the world\'s oldest and most prolific sources of fine sapphires. Known as the "Island of Gems," its gravels have yielded some of the largest and most famous sapphires in history.'
      },
      {
        type: 'heading',
        value: 'Washing & Inspecting Gem Rough'
      },
      {
        type: 'paragraph',
        value: 'Miners wash gem gravel in woven bamboo baskets ("Nambuwa") to isolate raw corundum crystals under natural sunlight.'
      },
      {
        type: 'image',
        url: '/images/knowledge/nambuwa-gravel-sorting.jpg',
        caption: 'A miner inspecting washed gem gravel in a traditional bamboo sifting basket.'
      },
      {
        type: 'paragraph',
        value: 'Ceylon sapphires are celebrated for their bright, luminous hues ranging from vivid cornflower blue to rare lotus-pink Padparadscha.'
      }
    ]
  },
  {
    id: 'a-3',
    slug: 'community-and-heritage-in-mining',
    title: 'Community and Heritage in Ceylon Gem Mining',
    category: 'Mining & Origin',
    excerpt: 'A deep look into the traditional mine crew cooperatives and field trade practices in Sri Lanka.',
    coverImage: '/images/knowledge/ceylon-miners-group-heritage.jpg',
    author: 'Elena Rostova',
    publishedDate: '2024-03-15',
    readTime: '5 min read',
    featured: false,
    content: [
      {
        type: 'paragraph',
        value: 'The gem trade in Sri Lanka is built upon generations of shared knowledge and community partnerships among local prospectors and miners.'
      },
      {
        type: 'image',
        url: '/images/knowledge/ceylon-miners-group-heritage.jpg',
        caption: 'A traditional Sri Lankan gem mining crew gathered with their sifting baskets.'
      },
      {
        type: 'paragraph',
        value: 'Teamwork and mutual trust remain the foundation of every pit operation from Ratnapura to Elahera.'
      }
    ]
  },
  {
    id: 'a-4',
    slug: 'evaluating-rough-gemstones-in-the-field',
    title: 'Evaluating Rough Gemstones in the Field',
    category: 'Buying Guide',
    excerpt: 'How miners and dealers inspect raw unheated sapphire rough directly at the mine site.',
    coverImage: '/images/knowledge/gem-stone-trade-heritage.jpg',
    author: 'Sunil Weeraratne',
    publishedDate: '2024-02-10',
    readTime: '5 min read',
    featured: false,
    content: [
      {
        type: 'paragraph',
        value: 'Field trading requires a keen eye to evaluate raw crystal shape, color saturation, and internal clarity under natural daylight.'
      },
      {
        type: 'image',
        url: '/images/knowledge/gem-stone-trade-heritage.jpg',
        caption: 'Miners and dealers examining raw rough stones on the field trail.'
      }
    ]
  },
  {
    id: 'a-5',
    slug: 'the-importance-of-independent-certification',
    title: 'The Importance of Independent Certification',
    category: 'Certification & Grading',
    excerpt: 'Why relying on a single origin report is essential in the modern era of gemology.',
    coverImage: '/images/knowledge/cert.png',
    author: 'Elena Rostova',
    publishedDate: '2024-01-22',
    readTime: '4 min read',
    featured: false,
    content: [
      {
        type: 'paragraph',
        value: 'In the high-stakes world of fine gemstone investment, trust is paramount. The bedrock of this verification is the independent gemological report.'
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
        value: 'Emeralds are uniquely prone to surface-reaching fractures. Standard practice for centuries is treating rough emeralds with cedarwood oil to improve clarity.'
      }
    ]
  }
];

export async function fetchArticles(filters = {}) {
  await new Promise(r => setTimeout(r, 400));

  let articles = [...MOCK_ARTICLES];

  if (filters.category && filters.category !== 'All') {
    articles = articles.filter(a => a.category === filters.category);
  }

  return articles;
}

export async function fetchArticleBySlug(slug) {
  await new Promise(r => setTimeout(r, 300));
  return MOCK_ARTICLES.find(a => a.slug === slug) ?? null;
}
