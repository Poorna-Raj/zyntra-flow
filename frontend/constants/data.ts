export const SITE_NAME = 'Lokalens';
export const SITE_TAGLINE = 'AI Demand Intelligence for Sri Lankan SMEs';

export const PRODUCTS_SAMPLE = [
  { name: 'Coca-Cola 1.5L', category: 'Beverages', demandScore: 91 },
  { name: 'Anchor Full Cream 400g', category: 'Dairy', demandScore: 84 },
  { name: 'Munchee Chocolate Biscuit', category: 'Snacks', demandScore: 79 },
  { name: 'Milo 400g', category: 'Beverages', demandScore: 76 },
  { name: 'Samba Rice 5kg', category: 'Staples', demandScore: 73 },
  { name: 'Maliban Marie Biscuit', category: 'Snacks', demandScore: 69 },
  { name: 'Coconut Oil 750ml', category: 'Cooking', demandScore: 66 },
  { name: 'Dil Milk Toffee', category: 'Confectionery', demandScore: 61 },
];

export const CONTEXTUAL_SIGNALS = [
  { label: 'Payday Cycles', example: '15th & 30th salary periods', icon: '💸' },
  { label: 'Religious Events', example: 'Vesak, Poya, Ramadan', icon: '🕌' },
  { label: 'Cultural Events', example: 'Sinhala & Tamil New Year', icon: '🎉' },
  { label: 'Weather Patterns', example: 'Rainfall, temperature zones', icon: '🌦️' },
  { label: 'School Seasons', example: 'Term reopening cycles', icon: '🎒' },
  { label: 'Tourism Activity', example: 'High-season coastal surge', icon: '✈️' },
];

export const PROVINCES = [
  'Western',
  'Central',
  'Southern',
  'Northern',
  'Eastern',
  'North Western',
  'North Central',
  'Uva',
  'Sabaragamuwa',
] as const;

export type Province = (typeof PROVINCES)[number];

export const ML_FEATURES = [
  'Province',
  'Product Name',
  'Week Number',
  'Month',
  'Payday Week',
  'Holiday Type',
  'Festival Season',
  'School Season',
  'Temperature Level',
  'Rainfall Level',
  'Tourism Level',
  'Urbanization Level',
  'Average Income Level',
];