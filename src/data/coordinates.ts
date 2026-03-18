// Comprehensive coastal coordinate mapping for shark attack locations
// Uses coastal points (not inland centroids) for accuracy

const COUNTRY_COORDS: Record<string, [number, number]> = {
  'USA': [28.5, -80.6],
  'AUSTRALIA': [-33.8, 151.2],
  'SOUTH AFRICA': [-33.9, 25.6],
  'BRAZIL': [-22.9, -43.2],
  'BAHAMAS': [25.0, -77.3],
  'PAPUA NEW GUINEA': [-5.4, 145.8],
  'NEW ZEALAND': [-36.8, 174.8],
  'REUNION': [-21.1, 55.5],
  'MEXICO': [20.6, -87.1],
  'FIJI': [-17.8, 177.9],
  'CUBA': [23.1, -82.4],
  'EGYPT': [27.2, 33.8],
  'PHILIPPINES': [14.5, 121.0],
  'ITALY': [40.8, 14.3],
  'JAPAN': [34.7, 138.7],
  'INDIA': [19.1, 72.9],
  'INDONESIA': [-8.7, 115.2],
  'CHINA': [22.3, 114.2],
  'IRAN': [26.5, 54.3],
  'THAILAND': [7.9, 98.4],
  'MALAYSIA': [3.1, 101.7],
  'GREECE': [37.9, 23.7],
  'CROATIA': [43.5, 16.4],
  'SPAIN': [36.7, -4.4],
  'PORTUGAL': [38.7, -9.1],
  'FRANCE': [43.3, 3.5],
  'UNITED KINGDOM': [50.4, -1.9],
  'ENGLAND': [50.4, -1.9],
  'SCOTLAND': [56.5, -5.5],
  'IRELAND': [53.3, -6.3],
  'TURKEY': [36.9, 30.7],
  'MALDIVES': [4.2, 73.5],
  'SEYCHELLES': [-4.7, 55.5],
  'MAURITIUS': [-20.2, 57.5],
  'MOZAMBIQUE': [-25.9, 32.6],
  'TANZANIA': [-6.8, 39.3],
  'KENYA': [-4.0, 39.7],
  'MADAGASCAR': [-18.9, 47.5],
  'SENEGAL': [14.7, -17.5],
  'SIERRA LEONE': [8.5, -13.3],
  'GHANA': [5.6, -0.2],
  'NIGERIA': [6.4, 3.4],
  'COLOMBIA': [10.4, -75.5],
  'VENEZUELA': [10.5, -67.0],
  'CHILE': [-33.0, -71.6],
  'ARGENTINA': [-38.0, -57.5],
  'PERU': [-12.0, -77.0],
  'ECUADOR': [-2.2, -80.9],
  'URUGUAY': [-34.9, -56.2],
  'COSTA RICA': [9.9, -84.1],
  'PANAMA': [8.4, -79.5],
  'HONDURAS': [15.5, -88.0],
  'NICARAGUA': [12.1, -86.3],
  'GUATEMALA': [15.7, -88.6],
  'BELIZE': [17.5, -88.2],
  'JAMAICA': [18.0, -76.8],
  'TRINIDAD & TOBAGO': [10.7, -61.5],
  'PUERTO RICO': [18.5, -66.1],
  'BERMUDA': [32.3, -64.8],
  'HAITI': [18.6, -72.3],
  'DOMINICAN REPUBLIC': [18.5, -69.9],
  'BARBADOS': [13.1, -59.6],
  'SAMOA': [-13.8, -172.0],
  'TONGA': [-21.2, -175.2],
  'NEW CALEDONIA': [-22.3, 166.5],
  'VANUATU': [-17.7, 168.3],
  'SOLOMON ISLANDS': [-9.4, 160.0],
  'MARSHALL ISLANDS': [7.1, 171.4],
  'PALAU': [7.5, 134.6],
  'GUAM': [13.4, 144.8],
  'HONG KONG': [22.3, 114.2],
  'TAIWAN': [25.0, 121.5],
  'SOUTH KOREA': [35.1, 129.0],
  'VIETNAM': [10.8, 106.7],
  'SRI LANKA': [6.9, 79.9],
  'PAKISTAN': [24.9, 67.0],
  'OMAN': [23.6, 58.5],
  'UNITED ARAB EMIRATES': [25.3, 55.3],
  'YEMEN': [12.8, 45.0],
  'SAUDI ARABIA': [21.5, 39.2],
  'ISRAEL': [32.1, 34.8],
  'LEBANON': [33.9, 35.5],
  'LIBYA': [32.9, 13.2],
  'TUNISIA': [36.8, 10.2],
  'ALGERIA': [36.8, 3.1],
  'MOROCCO': [33.6, -7.6],
  'CAPE VERDE': [15.0, -23.6],
  'ICELAND': [64.1, -21.9],
  'NORWAY': [60.4, 5.3],
  'SWEDEN': [57.7, 11.9],
  'DENMARK': [55.7, 12.6],
  'GERMANY': [54.3, 10.1],
  'NETHERLANDS': [52.1, 4.3],
  'BELGIUM': [51.2, 2.9],
  'POLAND': [54.4, 18.6],
  'RUSSIA': [43.6, 39.7],
  'CANADA': [44.6, -63.6],
  'GABON': [-0.4, 9.5],
  'CAMEROON': [4.0, 9.7],
  'ANGOLA': [-8.8, 13.2],
  'NAMIBIA': [-22.6, 14.5],
  'ERITREA': [15.6, 39.5],
  'DJIBOUTI': [11.6, 43.1],
  'SOMALIA': [2.0, 45.3],
  'COMOROS': [-12.2, 44.3],
  'SUDAN': [19.6, 37.2],
  'RED SEA': [22.0, 38.0],
  'ANDAMAN ISLANDS': [11.7, 92.7],
  'AZORES': [38.7, -27.2],
  'CANARY ISLANDS': [28.1, -15.4],
  'OKINAWA': [26.3, 127.8],
  'HAWAII': [21.3, -157.8],
  'MEDITERRANEAN SEA': [35.0, 18.0],
  'NORTH SEA': [56.0, 3.0],
  'CARIBBEAN SEA': [15.0, -75.0],
  'ATLANTIC OCEAN': [25.0, -45.0],
  'PACIFIC OCEAN': [0.0, -150.0],
  'INDIAN OCEAN': [-10.0, 70.0],
};

// US state coastal coordinates
const US_AREA_COORDS: Record<string, [number, number]> = {
  'Florida': [27.8, -80.4],
  'California': [33.8, -118.5],
  'Hawaii': [21.3, -157.8],
  'South Carolina': [32.8, -79.9],
  'North Carolina': [34.2, -77.8],
  'Texas': [27.8, -97.1],
  'New York': [40.6, -73.8],
  'New Jersey': [39.4, -74.2],
  'Oregon': [44.6, -124.1],
  'Massachusetts': [41.7, -70.1],
  'Virginia': [37.0, -76.0],
  'Georgia': [31.1, -81.4],
  'Alabama': [30.3, -87.7],
  'Mississippi': [30.4, -89.1],
  'Louisiana': [29.3, -89.9],
  'Connecticut': [41.2, -72.9],
  'Rhode Island': [41.5, -71.4],
  'Maine': [43.7, -70.3],
  'Maryland': [38.3, -76.5],
  'Delaware': [38.7, -75.1],
  'Washington': [47.9, -124.6],
  'Alaska': [58.3, -134.4],
  'Puerto Rico': [18.5, -66.1],
  'US Virgin Islands': [18.3, -64.9],
};

// Australian state coastal coordinates
const AU_AREA_COORDS: Record<string, [number, number]> = {
  'New South Wales': [-33.8, 151.3],
  'Queensland': [-27.5, 153.0],
  'Western Australia': [-31.9, 115.9],
  'South Australia': [-35.0, 138.5],
  'Victoria': [-38.1, 145.0],
  'Tasmania': [-42.9, 147.3],
  'Northern Territory': [-12.5, 130.8],
};

// South Africa regions
const ZA_AREA_COORDS: Record<string, [number, number]> = {
  'KwaZulu-Natal': [-29.9, 31.0],
  'Eastern Cape': [-33.8, 25.9],
  'Western Cape': [-34.1, 18.5],
  'Western Cape Province': [-34.1, 18.5],
  'Eastern Cape Province': [-33.8, 25.9],
};

// Known hotspot beaches/locations with specific coordinates
const SPECIFIC_LOCATIONS: Record<string, [number, number]> = {
  'New Smyrna Beach': [29.03, -80.93],
  'Daytona Beach': [29.21, -81.02],
  'Cocoa Beach': [28.32, -80.61],
  'Melbourne Beach': [28.07, -80.56],
  'Jupiter': [26.93, -80.09],
  'Palm Beach': [26.71, -80.04],
  'Fort Lauderdale': [26.12, -80.10],
  'Miami Beach': [25.79, -80.13],
  'Key West': [24.56, -81.78],
  'Myrtle Beach': [33.69, -78.89],
  'Outer Banks': [35.56, -75.47],
  'Hilton Head': [32.22, -80.75],
  'Cape Cod': [41.67, -70.30],
  'Montauk': [41.04, -71.86],
  'San Diego': [32.72, -117.16],
  'Los Angeles': [33.94, -118.45],
  'Santa Cruz': [36.96, -122.02],
  'San Francisco': [37.76, -122.51],
  'Malibu': [34.03, -118.78],
  'Huntington Beach': [33.66, -118.00],
  'Bolinas': [37.91, -122.69],
  'Oahu': [21.46, -158.19],
  'Maui': [20.80, -156.32],
  'Kauai': [22.07, -159.52],
  'Big Island': [19.64, -155.99],
  'Waikiki': [21.28, -157.83],
  'Galveston': [29.30, -94.79],
  'Bondi Beach': [-33.89, 151.27],
  'Byron Bay': [-28.64, 153.62],
  'Gold Coast': [-28.00, 153.43],
  'Ballina': [-28.87, 153.57],
  'Newcastle': [-32.93, 151.78],
  'Sydney': [-33.87, 151.21],
  'Perth': [-31.95, 115.86],
  'Margaret River': [-33.95, 114.98],
  'Esperance': [-33.86, 121.89],
  'Adelaide': [-34.93, 138.60],
  'Cairns': [-16.92, 145.77],
  'Port Douglas': [-16.48, 145.46],
  'Townsville': [-19.26, 146.82],
  'Mackay': [-21.14, 149.19],
  'Hervey Bay': [-25.29, 152.85],
  'Sunshine Coast': [-26.65, 153.09],
  'Noosa': [-26.39, 153.09],
  'Durban': [-29.86, 31.03],
  'East London': [-33.02, 27.91],
  'Port Elizabeth': [-33.76, 25.67],
  'Cape Town': [-33.92, 18.42],
  'Jeffreys Bay': [-33.97, 25.00],
  'Muizenberg': [-34.11, 18.47],
  'Fish Hoek': [-34.13, 18.43],
  'Gansbaal': [-34.58, 19.35],
  'Recife': [-8.05, -34.87],
  'Rio de Janeiro': [-22.97, -43.18],
  'Florianopolis': [-27.59, -48.55],
  'Fernando de Noronha': [-3.85, -32.42],
  'Sharm El Sheikh': [27.92, 34.33],
  'Hurghada': [27.26, 33.81],
  'Marsa Alam': [25.07, 34.91],
  'Dahab': [28.50, 34.51],
  'Saint-Gilles': [-21.07, 55.22],
  'Boucan Canot': [-21.03, 55.22],
  'Cancun': [21.16, -86.85],
  'Playa del Carmen': [20.63, -87.08],
  'Zihuatanejo': [17.64, -101.55],
  'Reunion Island': [-21.12, 55.53],
  'Nassau': [25.05, -77.35],
  'Freeport': [26.53, -78.70],
};

// Continent mapping
const COUNTRY_CONTINENT: Record<string, string> = {
  'USA': 'North America', 'CANADA': 'North America', 'MEXICO': 'North America',
  'BAHAMAS': 'North America', 'CUBA': 'North America', 'JAMAICA': 'North America',
  'HAITI': 'North America', 'DOMINICAN REPUBLIC': 'North America',
  'PUERTO RICO': 'North America', 'BERMUDA': 'North America',
  'TRINIDAD & TOBAGO': 'North America', 'BARBADOS': 'North America',
  'COSTA RICA': 'North America', 'PANAMA': 'North America',
  'HONDURAS': 'North America', 'NICARAGUA': 'North America',
  'GUATEMALA': 'North America', 'BELIZE': 'North America',
  'BRAZIL': 'South America', 'COLOMBIA': 'South America',
  'VENEZUELA': 'South America', 'CHILE': 'South America',
  'ARGENTINA': 'South America', 'PERU': 'South America',
  'ECUADOR': 'South America', 'URUGUAY': 'South America',
  'AUSTRALIA': 'Oceania', 'NEW ZEALAND': 'Oceania', 'FIJI': 'Oceania',
  'PAPUA NEW GUINEA': 'Oceania', 'SAMOA': 'Oceania', 'TONGA': 'Oceania',
  'NEW CALEDONIA': 'Oceania', 'VANUATU': 'Oceania',
  'SOLOMON ISLANDS': 'Oceania', 'MARSHALL ISLANDS': 'Oceania',
  'PALAU': 'Oceania', 'GUAM': 'Oceania',
  'SOUTH AFRICA': 'Africa', 'MOZAMBIQUE': 'Africa', 'TANZANIA': 'Africa',
  'KENYA': 'Africa', 'MADAGASCAR': 'Africa', 'SENEGAL': 'Africa',
  'SIERRA LEONE': 'Africa', 'GHANA': 'Africa', 'NIGERIA': 'Africa',
  'GABON': 'Africa', 'CAMEROON': 'Africa', 'ANGOLA': 'Africa',
  'NAMIBIA': 'Africa', 'ERITREA': 'Africa', 'DJIBOUTI': 'Africa',
  'SOMALIA': 'Africa', 'COMOROS': 'Africa', 'SUDAN': 'Africa',
  'EGYPT': 'Africa', 'LIBYA': 'Africa', 'TUNISIA': 'Africa',
  'ALGERIA': 'Africa', 'MOROCCO': 'Africa', 'CAPE VERDE': 'Africa',
  'REUNION': 'Africa', 'SEYCHELLES': 'Africa', 'MAURITIUS': 'Africa',
  'JAPAN': 'Asia', 'CHINA': 'Asia', 'INDIA': 'Asia', 'INDONESIA': 'Asia',
  'PHILIPPINES': 'Asia', 'THAILAND': 'Asia', 'MALAYSIA': 'Asia',
  'VIETNAM': 'Asia', 'SRI LANKA': 'Asia', 'PAKISTAN': 'Asia',
  'IRAN': 'Asia', 'OMAN': 'Asia', 'UNITED ARAB EMIRATES': 'Asia',
  'YEMEN': 'Asia', 'SAUDI ARABIA': 'Asia', 'ISRAEL': 'Asia',
  'LEBANON': 'Asia', 'TURKEY': 'Asia', 'SOUTH KOREA': 'Asia',
  'TAIWAN': 'Asia', 'HONG KONG': 'Asia', 'MALDIVES': 'Asia',
  'RUSSIA': 'Europe',
  'ITALY': 'Europe', 'GREECE': 'Europe', 'CROATIA': 'Europe',
  'SPAIN': 'Europe', 'PORTUGAL': 'Europe', 'FRANCE': 'Europe',
  'UNITED KINGDOM': 'Europe', 'ENGLAND': 'Europe', 'SCOTLAND': 'Europe',
  'IRELAND': 'Europe', 'ICELAND': 'Europe', 'NORWAY': 'Europe',
  'SWEDEN': 'Europe', 'DENMARK': 'Europe', 'GERMANY': 'Europe',
  'NETHERLANDS': 'Europe', 'BELGIUM': 'Europe', 'POLAND': 'Europe',
  'HAWAII': 'North America', 'OKINAWA': 'Asia',
};

// Ocean mapping based on country
const COUNTRY_OCEAN: Record<string, string> = {
  'USA': 'Atlantic', 'BAHAMAS': 'Atlantic', 'CUBA': 'Atlantic',
  'JAMAICA': 'Atlantic', 'HAITI': 'Atlantic', 'DOMINICAN REPUBLIC': 'Atlantic',
  'PUERTO RICO': 'Atlantic', 'BERMUDA': 'Atlantic',
  'TRINIDAD & TOBAGO': 'Atlantic', 'BARBADOS': 'Atlantic',
  'BRAZIL': 'Atlantic', 'URUGUAY': 'Atlantic', 'ARGENTINA': 'Atlantic',
  'VENEZUELA': 'Atlantic',
  'SOUTH AFRICA': 'Indian', 'MOZAMBIQUE': 'Indian', 'TANZANIA': 'Indian',
  'KENYA': 'Indian', 'MADAGASCAR': 'Indian', 'REUNION': 'Indian',
  'SEYCHELLES': 'Indian', 'MAURITIUS': 'Indian', 'MALDIVES': 'Indian',
  'INDIA': 'Indian', 'SRI LANKA': 'Indian', 'INDONESIA': 'Indian',
  'AUSTRALIA': 'Pacific', 'NEW ZEALAND': 'Pacific', 'FIJI': 'Pacific',
  'PAPUA NEW GUINEA': 'Pacific', 'SAMOA': 'Pacific', 'TONGA': 'Pacific',
  'NEW CALEDONIA': 'Pacific', 'VANUATU': 'Pacific',
  'SOLOMON ISLANDS': 'Pacific',
  'JAPAN': 'Pacific', 'PHILIPPINES': 'Pacific', 'CHINA': 'Pacific',
  'TAIWAN': 'Pacific', 'SOUTH KOREA': 'Pacific',
  'MEXICO': 'Pacific', 'COSTA RICA': 'Pacific', 'PANAMA': 'Pacific',
  'COLOMBIA': 'Pacific', 'CHILE': 'Pacific', 'PERU': 'Pacific',
  'ECUADOR': 'Pacific',
  'HONDURAS': 'Atlantic', 'NICARAGUA': 'Atlantic',
  'GUATEMALA': 'Pacific', 'BELIZE': 'Atlantic',
  'CANADA': 'Atlantic',
  'EGYPT': 'Red Sea', 'SUDAN': 'Red Sea', 'ERITREA': 'Red Sea',
  'DJIBOUTI': 'Red Sea', 'YEMEN': 'Red Sea', 'SAUDI ARABIA': 'Red Sea',
  'IRAN': 'Indian', 'OMAN': 'Indian', 'UNITED ARAB EMIRATES': 'Indian',
  'PAKISTAN': 'Indian',
  'ITALY': 'Mediterranean', 'GREECE': 'Mediterranean', 'CROATIA': 'Mediterranean',
  'SPAIN': 'Mediterranean', 'FRANCE': 'Mediterranean', 'TURKEY': 'Mediterranean',
  'ISRAEL': 'Mediterranean', 'LEBANON': 'Mediterranean',
  'LIBYA': 'Mediterranean', 'TUNISIA': 'Mediterranean',
  'ALGERIA': 'Mediterranean', 'MOROCCO': 'Atlantic',
  'PORTUGAL': 'Atlantic', 'UNITED KINGDOM': 'Atlantic',
  'ENGLAND': 'Atlantic', 'SCOTLAND': 'Atlantic', 'IRELAND': 'Atlantic',
  'ICELAND': 'Atlantic', 'NORWAY': 'Atlantic', 'SWEDEN': 'Atlantic',
  'DENMARK': 'Atlantic', 'GERMANY': 'Atlantic',
  'NETHERLANDS': 'Atlantic', 'BELGIUM': 'Atlantic',
  'SENEGAL': 'Atlantic', 'SIERRA LEONE': 'Atlantic', 'GHANA': 'Atlantic',
  'NIGERIA': 'Atlantic', 'GABON': 'Atlantic', 'CAMEROON': 'Atlantic',
  'ANGOLA': 'Atlantic', 'NAMIBIA': 'Atlantic', 'CAPE VERDE': 'Atlantic',
  'THAILAND': 'Indian', 'MALAYSIA': 'Indian', 'VIETNAM': 'Pacific',
  'HONG KONG': 'Pacific', 'RUSSIA': 'Pacific',
  'HAWAII': 'Pacific', 'OKINAWA': 'Pacific',
};

// Simple hash function for deterministic jitter
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}

// Get coordinates for an attack, with deterministic jitter
export function getCoordinates(
  country: string,
  area: string,
  location: string,
  id: string
): [number, number] | null {
  const countryUpper = country?.toUpperCase().trim() || '';
  const areaClean = area?.trim() || '';
  const locationClean = location?.trim() || '';

  // First try specific location
  for (const [key, coords] of Object.entries(SPECIFIC_LOCATIONS)) {
    if (locationClean.toLowerCase().includes(key.toLowerCase()) ||
        areaClean.toLowerCase().includes(key.toLowerCase())) {
      const jitter = hashString(id);
      return [
        coords[0] + (((jitter & 0xFF) / 255) - 0.5) * 0.15,
        coords[1] + ((((jitter >> 8) & 0xFF) / 255) - 0.5) * 0.15
      ];
    }
  }

  // Try area-specific coords for major countries
  if (countryUpper === 'USA') {
    for (const [state, coords] of Object.entries(US_AREA_COORDS)) {
      if (areaClean.toLowerCase().includes(state.toLowerCase())) {
        const jitter = hashString(id);
        return [
          coords[0] + (((jitter & 0xFF) / 255) - 0.5) * 0.5,
          coords[1] + ((((jitter >> 8) & 0xFF) / 255) - 0.5) * 0.5
        ];
      }
    }
  }

  if (countryUpper === 'AUSTRALIA') {
    for (const [state, coords] of Object.entries(AU_AREA_COORDS)) {
      if (areaClean.toLowerCase().includes(state.toLowerCase())) {
        const jitter = hashString(id);
        return [
          coords[0] + (((jitter & 0xFF) / 255) - 0.5) * 0.5,
          coords[1] + ((((jitter >> 8) & 0xFF) / 255) - 0.5) * 0.5
        ];
      }
    }
  }

  if (countryUpper === 'SOUTH AFRICA') {
    for (const [region, coords] of Object.entries(ZA_AREA_COORDS)) {
      if (areaClean.toLowerCase().includes(region.toLowerCase())) {
        const jitter = hashString(id);
        return [
          coords[0] + (((jitter & 0xFF) / 255) - 0.5) * 0.3,
          coords[1] + ((((jitter >> 8) & 0xFF) / 255) - 0.5) * 0.3
        ];
      }
    }
  }

  // Fall back to country coords
  const countryCoords = COUNTRY_COORDS[countryUpper];
  if (countryCoords) {
    const jitter = hashString(id);
    return [
      countryCoords[0] + (((jitter & 0xFF) / 255) - 0.5) * 1.0,
      countryCoords[1] + ((((jitter >> 8) & 0xFF) / 255) - 0.5) * 1.0
    ];
  }

  return null;
}

export function getContinent(country: string): string {
  return COUNTRY_CONTINENT[country?.toUpperCase().trim()] || 'Unknown';
}

export function getOcean(country: string, area?: string): string {
  const countryUpper = country?.toUpperCase().trim() || '';
  // Special case: California-side of USA/Mexico is Pacific
  if (countryUpper === 'USA' && area) {
    const pacificStates = ['California', 'Oregon', 'Washington', 'Hawaii', 'Alaska'];
    if (pacificStates.some(s => area.includes(s))) return 'Pacific';
    const gulfStates = ['Texas', 'Louisiana', 'Mississippi', 'Alabama'];
    if (gulfStates.some(s => area.includes(s))) return 'Gulf of Mexico';
  }
  if (countryUpper === 'AUSTRALIA' && area) {
    if (area.includes('Western Australia')) return 'Indian';
    if (area.includes('South Australia')) return 'Indian';
  }
  return COUNTRY_OCEAN[countryUpper] || 'Unknown';
}
