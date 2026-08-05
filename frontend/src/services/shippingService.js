const SHIPPING_RATES = {
  Western: {
    Colombo: 350,
    Gampaha: 400,
    Kalutara: 400,
  },

  Central: {
    Kandy: 450,
    Matale: 500,
    NuwaraEliya: 550,
  },

  Southern: {
    Galle: 450,
    Matara: 500,
    Hambantota: 550,
  },

  Northern: {
    Jaffna: 650,
    Kilinochchi: 700,
    Mannar: 700,
    Mullaitivu: 750,
    Vavuniya: 650,
  },

  Eastern: {
    Batticaloa: 600,
    Ampara: 600,
    Trincomalee: 600,
  },

  NorthWestern: {
    Kurunegala: 500,
    Puttalam: 550,
  },

  NorthCentral: {
    Anuradhapura: 550,
    Polonnaruwa: 600,
  },

  Uva: {
    Badulla: 550,
    Monaragala: 600,
  },

  Sabaragamuwa: {
    Ratnapura: 500,
    Kegalle: 450,
  },
}

export const PROVINCES = [
  {
    name: 'Western',
    districts: ['Colombo', 'Gampaha', 'Kalutara'],
  },
  {
    name: 'Central',
    districts: ['Kandy', 'Matale', 'NuwaraEliya'],
  },
  {
    name: 'Southern',
    districts: ['Galle', 'Matara', 'Hambantota'],
  },
  {
    name: 'Northern',
    districts: [
      'Jaffna',
      'Kilinochchi',
      'Mannar',
      'Mullaitivu',
      'Vavuniya',
    ],
  },
  {
    name: 'Eastern',
    districts: ['Batticaloa', 'Ampara', 'Trincomalee'],
  },
  {
    name: 'NorthWestern',
    districts: ['Kurunegala', 'Puttalam'],
  },
  {
    name: 'NorthCentral',
    districts: ['Anuradhapura', 'Polonnaruwa'],
  },
  {
    name: 'Uva',
    districts: ['Badulla', 'Monaragala'],
  },
  {
    name: 'Sabaragamuwa',
    districts: ['Ratnapura', 'Kegalle'],
  },
]

export const DISTRICT_LABELS = {
  NuwaraEliya: 'Nuwara Eliya',
  Kilinochchi: 'Kilinochchi',
  Mullaitivu: 'Mullaitivu',
}

export function getDistrictLabel(district) {
  return DISTRICT_LABELS[district] || district
}

export function calculateShipping(province, district) {
  if (!province || !district) return 0

  return SHIPPING_RATES[province]?.[district] || 650
}