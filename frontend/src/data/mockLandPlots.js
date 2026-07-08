/**
 * mockLandPlots.js
 * ----------------
 * Static mock data for the Land Mining & Reservation module.
 * To connect to a real backend, replace the body of `fetchLandPlots()`,
 * `fetchLandPlotById()`, and `submitSiteVisitBooking()` with actual API calls.
 */

export const MOCK_LAND_PLOTS = [
  {
    id: 'l-1',
    locationName: 'Ratnapura Blue Vein Plot',
    region: 'Ratnapura',
    sizePerch: 120,
    sizeAcres: 0.75,
    yieldPotential: 'High (Sapphire Focus)',
    status: 'Available',
    images: [
      '/images/land/river_valley.png',
      '/images/land/rocky_ridge.png'
    ],
    surveyDate: '2025-11-12',
    soilComposition: 'Alluvial gravel (illam) rich in corundum',
    historicalYieldData: 'Historically produced fine Ceylon sapphires in 1990s adjacent plots.',
    description: 'A prime unmined plot located in the heart of Ratnapura\'s traditional gem-bearing region. Extensive geological surveys indicate a high probability of sapphire-rich alluvial deposits at a depth of 15-20 meters. Ideal for a mid-scale mechanized or traditional pit mining operation.',
    coordinates: '6°41\'02.0"N 80°23\'49.2"E'
  },
  {
    id: 'l-2',
    locationName: 'Pelmadulla Ruby Ridge',
    region: 'Pelmadulla',
    sizePerch: 240,
    sizeAcres: 1.5,
    yieldPotential: 'Medium-High',
    status: 'Reserved',
    images: [
      '/images/land/rocky_ridge.png'
    ],
    surveyDate: '2026-01-05',
    soilComposition: 'Residual soil over crystalline limestone',
    historicalYieldData: 'Known for producing star rubies and spinel.',
    description: 'An elevated plot situated on a crystalline limestone ridge in Pelmadulla. The site shows strong indications of ruby and spinel formations in the residual soil layer. Suitable for both open-cast and shallow shaft mining techniques.',
    coordinates: '6°37\'15.5"N 80°32\'10.1"E'
  },
  {
    id: 'l-3',
    locationName: 'Elahera Green Valley Site',
    region: 'Elahera',
    sizePerch: 80,
    sizeAcres: 0.5,
    yieldPotential: 'High (Tourmaline/Garnet)',
    status: 'Available',
    images: [
      '/images/land/river_valley.png'
    ],
    surveyDate: '2026-03-20',
    soilComposition: 'Metamorphic rock debris and clay',
    historicalYieldData: 'Consistent yield of tourmaline, garnet, and occasional sapphires.',
    description: 'A compact but highly promising plot in the renowned Elahera gem field. This region is famous for its vibrant tourmalines and garnets. The plot benefits from easy access to water sources for washing gravel, reducing operational costs.',
    coordinates: '7°45\'30.0"N 80°48\'12.4"E'
  },
  {
    id: 'l-4',
    locationName: 'Opanayake Deep Seam',
    region: 'Opanayake',
    sizePerch: 400,
    sizeAcres: 2.5,
    yieldPotential: 'Very High (Mixed Corundum)',
    status: 'Under Survey',
    images: [
      '/images/land/deep_mine.png',
      '/images/land/rocky_ridge.png'
    ],
    surveyDate: '2026-06-15 (Ongoing)',
    soilComposition: 'Deep alluvial sedimentary layers',
    historicalYieldData: 'Adjacent plots have yielded museum-quality padparadscha sapphires.',
    description: 'A large-scale operation site currently undergoing deep seismic and geological surveying. Initial test pits reveal rich gem-bearing gravels at a depth of 30 meters. This site represents a significant investment opportunity for advanced mechanised mining consortiums.',
    coordinates: '6°35\'40.2"N 80°38\'55.8"E'
  },
  {
    id: 'l-5',
    locationName: 'Nivithigala River Bend',
    region: 'Nivithigala',
    sizePerch: 160,
    sizeAcres: 1.0,
    yieldPotential: 'Medium',
    status: 'Available',
    images: [
      '/images/land/river_valley.png',
      '/images/land/deep_mine.png'
    ],
    surveyDate: '2025-08-22',
    soilComposition: 'River sand and gravel',
    historicalYieldData: 'Steady output of semi-precious stones and commercial grade sapphires.',
    description: 'Located at a natural bend in the river, this plot captures alluvial deposits washed downstream. It offers a lower barrier to entry for smaller mining outfits and has a proven track record of consistent, albeit lower-value, gem yields.',
    coordinates: '6°33\'18.7"N 80°26\'05.3"E'
  },
  {
    id: 'l-6',
    locationName: 'Kuruwita Highland Claim',
    region: 'Kuruwita',
    sizePerch: 320,
    sizeAcres: 2.0,
    yieldPotential: 'High (Blue Sapphire)',
    status: 'Available',
    images: [
      '/images/land/deep_mine.png'
    ],
    surveyDate: '2026-02-10',
    soilComposition: 'Weathered pegmatite and laterite',
    historicalYieldData: 'Virgin territory, newly opened for licensing.',
    description: 'A newly accessible highland plot near Kuruwita. Geological sampling indicates a high concentration of weathered pegmatite, strongly associated with fine blue sapphires. Requires robust infrastructure setup but offers exceptional upside potential.',
    coordinates: '6°46\'11.9"N 80°21\'52.0"E'
  }
];

export async function fetchLandPlots(filters = {}) {
  await new Promise(r => setTimeout(r, 600)); // simulate network delay
  let plots = [...MOCK_LAND_PLOTS];

  if (filters.region && filters.region !== 'All') {
    plots = plots.filter(p => p.region === filters.region);
  }
  if (filters.status && filters.status !== 'All') {
    plots = plots.filter(p => p.status === filters.status);
  }
  if (filters.minAcres != null) {
    plots = plots.filter(p => p.sizeAcres >= filters.minAcres);
  }
  if (filters.maxAcres != null) {
    plots = plots.filter(p => p.sizeAcres <= filters.maxAcres);
  }
  
  // Sort
  if (filters.sort === 'size-asc') {
    plots.sort((a, b) => a.sizeAcres - b.sizeAcres);
  } else if (filters.sort === 'size-desc') {
    plots.sort((a, b) => b.sizeAcres - a.sizeAcres);
  }

  return plots;
}

export async function fetchLandPlotById(id) {
  await new Promise(r => setTimeout(r, 400));
  return MOCK_LAND_PLOTS.find(p => p.id === id) ?? null;
}

export async function submitSiteVisitBooking(formData) {
  await new Promise(r => setTimeout(r, 800)); // simulate submission delay
  console.log('Booking submitted successfully:', formData);
  return { success: true, bookingReference: 'REF-' + Math.floor(Math.random() * 1000000) };
}
