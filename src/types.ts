export interface SharkAttack {
  id: string;
  date: string;
  year: number;
  type: string;
  country: string;
  activity: string;
  fatal: boolean;
  species: string;
  lat: number;
  lng: number;
  continent: string;
  ocean: string;
  // Detail fields — loaded on demand
  area?: string;
  location?: string;
  name?: string;
  sex?: string;
  age?: string;
  injury?: string;
  time?: string;
}

export interface AttackDetail {
  area: string;
  location: string;
  name: string;
  sex: string;
  age: string;
  injury: string;
  time: string;
}

export interface Filters {
  yearRange: [number, number];
  countries: string[];
  continents: string[];
  oceans: string[];
  species: string[];
  activities: string[];
  types: string[];
  fatalOnly: boolean;
  nonFatalOnly: boolean;
  search: string;
}

export interface StatsData {
  total: number;
  fatal: number;
  nonFatal: number;
  countriesAffected: number;
  speciesIdentified: number;
  byDecade: { decade: string; count: number; fatal: number }[];
  byCountry: { name: string; count: number }[];
  bySpecies: { name: string; count: number }[];
  byActivity: { name: string; count: number }[];
  byContinent: { name: string; count: number }[];
  byOcean: { name: string; count: number }[];
  byType: { name: string; count: number }[];
  byMonth: { name: string; count: number }[];
}
