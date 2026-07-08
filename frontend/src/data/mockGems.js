/**
 * mockGems.js
 * -----------
 * Static mock data for the Gem Shop.
 * To connect to the real backend, replace the body of `fetchGems()`
 * and `fetchGemById()` with actual fetch() / axios calls.
 */

export const MOCK_GEMS = [
  {
    id: '1',
    name: 'Burmese Pigeon Blood Ruby',
    type: 'Ruby',
    caratWeight: 3.21,
    certNumber: 'GIA-2024-087431',
    certAuthority: 'GIA',
    price: 1850000,
    clarity: 'VS1',
    cut: 'Oval',
    origin: 'Mogok, Myanmar',
    color: '#B91C1C',
    colorName: 'Pigeon Blood Red',
    description:
      'An exceptional Burmese ruby of the finest pigeon blood hue, sourced from the legendary Mogok valley. GIA certified with no heat treatment — a rarity in today\'s market.',
    imageUrl: '/images/gems/ruby.png',
  },
  {
    id: '2',
    name: 'Ceylon Royal Blue Sapphire',
    type: 'Sapphire',
    caratWeight: 5.14,
    certNumber: 'GRS-2023-112908',
    certAuthority: 'GRS',
    price: 3200000,
    clarity: 'VVS2',
    cut: 'Cushion',
    origin: 'Ratnapura, Sri Lanka',
    color: '#1D4ED8',
    colorName: 'Royal Blue',
    description:
      'A prized royal blue sapphire from the gem fields of Ratnapura, bearing the intense velvety hue synonymous with Ceylon stones. Unheated, GRS certified.',
    imageUrl: '/images/gems/sapphire.png',
  },
  {
    id: '3',
    name: 'Colombian Vivid Green Emerald',
    type: 'Emerald',
    caratWeight: 2.87,
    certNumber: 'CDTEC-2024-005512',
    certAuthority: 'CDTEC',
    price: 2450000,
    clarity: 'SI1',
    cut: 'Emerald',
    origin: 'Muzo, Colombia',
    color: '#15803D',
    colorName: 'Vivid Green',
    description:
      'Muzo origin vivid green emerald exhibiting the classic warm saturation unique to Colombian stones. Minor natural inclusions — a hallmark of genuine unheated Muzo material.',
    imageUrl: '/images/gems/emerald.png',
  },
  {
    id: '4',
    name: 'Padparadscha Sapphire',
    type: 'Sapphire',
    caratWeight: 1.92,
    certNumber: 'GIA-2024-054209',
    certAuthority: 'GIA',
    price: 4800000,
    clarity: 'VVS1',
    cut: 'Oval',
    origin: 'Ratnapura, Sri Lanka',
    color: '#EA580C',
    colorName: 'Lotus Pink-Orange',
    description:
      'An exceptionally rare Padparadscha sapphire exhibiting the delicate salmon-pink hue reminiscent of a lotus blossom. Certified unheated — among the rarest of all sapphire varieties.',
    imageUrl: '/images/gems/topaz.png',
  },
  {
    id: '5',
    name: 'Alexandrite Cat\'s Eye',
    type: 'Alexandrite',
    caratWeight: 2.10,
    certNumber: 'GRS-2023-078342',
    certAuthority: 'GRS',
    price: 6700000,
    clarity: 'VVS2',
    cut: "Cat's Eye",
    origin: 'Hematita, Brazil',
    color: '#065F46',
    colorName: 'Colour-Change Green / Red',
    description:
      'A Brazilian alexandrite with pronounced colour change — vivid green under daylight, raspberry red under incandescent light — combined with a sharp cat\'s eye phenomenon.',
    imageUrl: '/images/gems/emerald.png',
  },
  {
    id: '6',
    name: 'Kashmiri Blue Sapphire',
    type: 'Sapphire',
    caratWeight: 4.05,
    certNumber: 'GIA-2022-031187',
    certAuthority: 'GIA',
    price: 12500000,
    clarity: 'VS2',
    cut: 'Cushion',
    origin: 'Kashmir, India',
    color: '#1E40AF',
    colorName: 'Kashmir Cornflower Blue',
    description:
      'The holy grail of sapphires — a Kashmir origin cushion cut with the legendary velvety cornflower blue. GIA certified, unheated. Fewer than 1% of sapphires carry a Kashmir origin report.',
    imageUrl: '/images/gems/sapphire.png',
  },
  {
    id: '7',
    name: 'Mozambique Paraiba Tourmaline',
    type: 'Tourmaline',
    caratWeight: 1.55,
    certNumber: 'GRS-2024-098001',
    certAuthority: 'GRS',
    price: 2100000,
    clarity: 'VVS1',
    cut: 'Oval',
    origin: 'Mozambique',
    color: '#0891B2',
    colorName: 'Neon Electric Blue',
    description:
      'A copper-bearing Paraíba-type tourmaline from Mozambique radiating an electric neon glow. GRS confirmed copper-bearing origin — the source of its extraordinary luminescence.',
    imageUrl: '/images/gems/paraiba.png',
  },
  {
    id: '8',
    name: 'Yellow Ceylon Sapphire',
    type: 'Sapphire',
    caratWeight: 6.80,
    certNumber: 'GIA-2023-064418',
    certAuthority: 'GIA',
    price: 980000,
    clarity: 'VS1',
    cut: 'Cushion',
    origin: 'Ratnapura, Sri Lanka',
    color: '#D97706',
    colorName: 'Golden Yellow',
    description:
      'A rich golden-yellow Ceylon sapphire of superb clarity and lively brilliance. Unheated, GIA certified — an undervalued collector\'s gem of pure Sri Lankan origin.',
    imageUrl: '/images/gems/topaz.png',
  },
  {
    id: '9',
    name: 'Tanzanian Tsavorite Garnet',
    type: 'Garnet',
    caratWeight: 3.44,
    certNumber: 'SSEF-2024-011754',
    certAuthority: 'SSEF',
    price: 1150000,
    clarity: 'VS1',
    cut: 'Oval',
    origin: 'Merelani, Tanzania',
    color: '#16A34A',
    colorName: 'Vivid Chrome Green',
    description:
      'A fine Merelani tsavorite garnet with saturated chrome-green colour rivalling the finest emeralds — without inclusions. SSEF certified with an exceptional colour grade.',
    imageUrl: '/images/gems/emerald.png',
  },
  {
    id: '10',
    name: 'Burmese Blue Spinel',
    type: 'Spinel',
    caratWeight: 4.22,
    certNumber: 'GRS-2023-055609',
    certAuthority: 'GRS',
    price: 1620000,
    clarity: 'VVS1',
    cut: 'Cushion',
    origin: 'Mogok, Myanmar',
    color: '#2563EB',
    colorName: 'Cobalt Blue',
    description:
      'A cobalt-blue Mogok spinel — one of the most sought-after collector gems, prized for its saturated blue and exceptional brilliance. GRS certified cobalt-bearing.',
    imageUrl: '/images/gems/sapphire.png',
  },
  {
    id: '11',
    name: 'Rhodolite Garnet',
    type: 'Garnet',
    caratWeight: 5.60,
    certNumber: 'GIA-2024-041230',
    certAuthority: 'GIA',
    price: 420000,
    clarity: 'VVS2',
    cut: 'Oval',
    origin: 'Umba Valley, Tanzania',
    color: '#9D174D',
    colorName: 'Raspberry Pink',
    description:
      'A vibrant raspberry-rose rhodolite garnet from the Umba Valley with excellent transparency and life. An accessible luxury gem of outstanding colour saturation.',
    imageUrl: '/images/gems/ruby.png',
  },
  {
    id: '12',
    name: 'Imperial Topaz',
    type: 'Topaz',
    caratWeight: 8.15,
    certNumber: 'GRS-2022-088314',
    certAuthority: 'GRS',
    price: 760000,
    clarity: 'IF',
    cut: 'Oval',
    origin: 'Ouro Preto, Brazil',
    color: '#C2410C',
    colorName: 'Imperial Orange',
    description:
      'A true imperial topaz — the rarest colour variant, a warm peachy-orange — from the historic Ouro Preto deposit in Brazil. Internally flawless. An heirloom-quality stone.',
    imageUrl: '/images/gems/topaz.png',
  },
]

// ─── API shim ────────────────────────────────────────────────────────────────
// Replace these functions with real fetch() calls once the backend is ready.

export async function fetchGems(filters = {}) {
  await new Promise(r => setTimeout(r, 600)) // simulate network delay
  let gems = [...MOCK_GEMS]

  if (filters.type) {
    gems = gems.filter(g => g.type === filters.type)
  }
  if (filters.minPrice != null) {
    gems = gems.filter(g => g.price >= filters.minPrice)
  }
  if (filters.maxPrice != null) {
    gems = gems.filter(g => g.price <= filters.maxPrice)
  }
  if (filters.clarity) {
    gems = gems.filter(g => g.clarity === filters.clarity)
  }
  if (filters.sort === 'price-asc') {
    gems.sort((a, b) => a.price - b.price)
  } else if (filters.sort === 'price-desc') {
    gems.sort((a, b) => b.price - a.price)
  }

  return gems
}

export async function fetchGemById(id) {
  await new Promise(r => setTimeout(r, 400))
  return MOCK_GEMS.find(g => g.id === id) ?? null
}
