export interface ProvinceData {
  id: string;
  name: string;
  capital: string;
  climate: string;
  economyType: string;
  topProducts: string[];
  demandDrivers: string[];
}

export const PROVINCE_DATA: ProvinceData[] = [
  {
    id: 'western',
    name: 'Western',
    capital: 'Colombo',
    climate: 'Humid tropical',
    economyType: 'Urban commercial',
    topProducts: ['Beverages', 'Premium Snacks', 'Dairy', 'Packaged Foods'],
    demandDrivers: ['Payday cycles', 'Corporate events', 'Tourism', 'High disposable income'],
  },
  {
    id: 'central',
    name: 'Central',
    capital: 'Kandy',
    climate: 'Cool highland',
    economyType: 'Tourism & tea',
    topProducts: ['Warm Beverages', 'Tea', 'Rice & Dhal', 'Cooking Oil'],
    demandDrivers: ['Tourism seasons', 'Esala Perahera', 'Cool climate staples'],
  },
  {
    id: 'southern',
    name: 'Southern',
    capital: 'Galle',
    climate: 'Tropical coastal',
    economyType: 'Tourism & fishing',
    topProducts: ['Cold Beverages', 'Fish Products', 'Coconut Oil', 'Snacks'],
    demandDrivers: ['Beach tourism', 'High temperatures', 'Monsoon patterns', 'Festival seasons'],
  },
  {
    id: 'northern',
    name: 'Northern',
    capital: 'Jaffna',
    climate: 'Dry arid',
    economyType: 'Agriculture',
    topProducts: ['Rice Flour', 'Coconut Products', 'Dried Fish', 'Spices'],
    demandDrivers: ['Tamil cultural events', 'Extreme heat', 'Agricultural cycles'],
  },
  {
    id: 'eastern',
    name: 'Eastern',
    capital: 'Trincomalee',
    climate: 'Tropical',
    economyType: 'Tourism & agriculture',
    topProducts: ['Cold Drinks', 'Rice', 'Pulses', 'Seafood Products'],
    demandDrivers: ['Ramadan', 'Coastal tourism', 'Monsoon timing differs'],
  },
  {
    id: 'north-western',
    name: 'North Western',
    capital: 'Kurunegala',
    climate: 'Dry zone tropical',
    economyType: 'Agriculture & industry',
    topProducts: ['Rice', 'Coconut Oil', 'Sugar', 'Flour'],
    demandDrivers: ['Harvest seasons', 'Payday cycles', 'Rural purchasing patterns'],
  },
  {
    id: 'north-central',
    name: 'North Central',
    capital: 'Anuradhapura',
    climate: 'Dry zone',
    economyType: 'Agriculture & pilgrimage',
    topProducts: ['Rice', 'Vegetables', 'Biscuits', 'Spices'],
    demandDrivers: ['Pilgrimage season', 'Buddhist events', 'Agricultural income cycles'],
  },
  {
    id: 'uva',
    name: 'Uva',
    capital: 'Badulla',
    climate: 'Highland',
    economyType: 'Tea & vegetables',
    topProducts: ['Tea', 'Warm Food Items', 'Cooking Staples', 'Dairy'],
    demandDrivers: ['Tea season income', 'Cool climate patterns', 'Rural demand cycles'],
  },
  {
    id: 'sabaragamuwa',
    name: 'Sabaragamuwa',
    capital: 'Ratnapura',
    climate: 'Wet zone',
    economyType: 'Gem trade & agriculture',
    topProducts: ['Rice', 'Coconut', 'Fish', 'Packaged Goods'],
    demandDrivers: ['Gem trade income cycles', 'High rainfall season', 'Festival periods'],
  },
];