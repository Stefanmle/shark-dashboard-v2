import { readFileSync } from 'fs';
import { watch, type FSWatcher } from 'fs';
import XLSX from 'xlsx';
import type { SharkAttack, AttackDetail, StatsData } from '../src/types';

// ---- Coordinate mappings (from process-data.mjs — source of truth) ----

const COUNTRY_COORDS: Record<string, [number, number]> = {
  'USA': [28.5, -80.6], 'AUSTRALIA': [-33.8, 151.2], 'SOUTH AFRICA': [-33.9, 25.6],
  'BRAZIL': [-22.9, -43.2], 'BAHAMAS': [25.0, -77.3], 'PAPUA NEW GUINEA': [-5.4, 145.8],
  'NEW ZEALAND': [-36.8, 174.8], 'REUNION': [-21.1, 55.5], 'MEXICO': [20.6, -87.1],
  'FIJI': [-17.8, 177.9], 'CUBA': [23.1, -82.4], 'EGYPT': [27.2, 33.8],
  'PHILIPPINES': [14.5, 121.0], 'ITALY': [40.8, 14.3], 'JAPAN': [34.7, 138.7],
  'INDIA': [19.1, 72.9], 'INDONESIA': [-8.7, 115.2], 'CHINA': [22.3, 114.2],
  'IRAN': [26.5, 54.3], 'THAILAND': [7.9, 98.4], 'MALAYSIA': [3.1, 101.7],
  'GREECE': [37.9, 23.7], 'CROATIA': [43.5, 16.4], 'SPAIN': [36.7, -4.4],
  'PORTUGAL': [38.7, -9.1], 'FRANCE': [43.3, 3.5], 'UNITED KINGDOM': [50.4, -1.9],
  'ENGLAND': [50.4, -1.9], 'SCOTLAND': [56.3, -2.8], 'IRELAND': [53.3, -9.1],
  'TURKEY': [36.9, 30.7], 'MALDIVES': [4.2, 73.5], 'SEYCHELLES': [-4.7, 55.5],
  'MAURITIUS': [-20.2, 57.5], 'MOZAMBIQUE': [-25.9, 32.6], 'TANZANIA': [-6.8, 39.3],
  'KENYA': [-4.0, 39.7], 'MADAGASCAR': [-15.7, 46.3], 'SENEGAL': [14.7, -17.5],
  'SIERRA LEONE': [8.5, -13.3], 'GHANA': [5.6, -0.2], 'NIGERIA': [6.4, 3.4],
  'COLOMBIA': [3.5, -77.0], 'VENEZUELA': [10.5, -67.0], 'CHILE': [-33.0, -71.6],
  'ARGENTINA': [-38.0, -57.5], 'PERU': [-12.0, -77.0], 'ECUADOR': [-2.2, -80.9],
  'URUGUAY': [-34.9, -56.2], 'COSTA RICA': [10.0, -85.8], 'PANAMA': [8.4, -79.5],
  'HONDURAS': [15.8, -86.5], 'NICARAGUA': [12.1, -83.8], 'GUATEMALA': [15.7, -88.6],
  'BELIZE': [17.5, -88.2], 'JAMAICA': [18.0, -76.8], 'TRINIDAD & TOBAGO': [10.7, -61.5],
  'PUERTO RICO': [18.5, -66.1], 'BERMUDA': [32.3, -64.8], 'HAITI': [18.6, -72.3],
  'DOMINICAN REPUBLIC': [18.5, -69.9], 'BARBADOS': [13.1, -59.6],
  'SAMOA': [-13.8, -172.0], 'TONGA': [-21.2, -175.2], 'NEW CALEDONIA': [-22.3, 166.5],
  'VANUATU': [-17.7, 168.3], 'SOLOMON ISLANDS': [-9.4, 160.0],
  'MARSHALL ISLANDS': [7.1, 171.4], 'PALAU': [7.5, 134.6], 'GUAM': [13.4, 144.8],
  'HONG KONG': [22.3, 114.2], 'TAIWAN': [25.0, 121.5], 'SOUTH KOREA': [35.1, 129.0],
  'VIETNAM': [10.8, 106.7], 'SRI LANKA': [6.9, 79.9], 'PAKISTAN': [24.9, 67.0],
  'OMAN': [23.6, 58.5], 'UNITED ARAB EMIRATES': [25.3, 55.3], 'YEMEN': [14.8, 42.9],
  'SAUDI ARABIA': [21.5, 39.2], 'ISRAEL': [32.1, 34.8], 'LEBANON': [33.9, 35.5],
  'LIBYA': [32.9, 13.2], 'TUNISIA': [36.8, 10.2], 'ALGERIA': [36.8, 3.1],
  'MOROCCO': [33.6, -7.6], 'CAPE VERDE': [15.0, -23.6], 'ICELAND': [64.1, -21.9],
  'NORWAY': [60.4, 5.3], 'SWEDEN': [57.7, 11.9], 'DENMARK': [55.7, 12.6],
  'GERMANY': [54.3, 10.1], 'NETHERLANDS': [52.1, 4.3], 'BELGIUM': [51.2, 2.9],
  'POLAND': [54.4, 18.6], 'RUSSIA': [43.1, 131.9], 'CANADA': [44.6, -63.6],
  'GABON': [-0.4, 9.5], 'CAMEROON': [4.0, 9.7], 'ANGOLA': [-8.8, 13.2],
  'NAMIBIA': [-22.6, 14.5], 'ERITREA': [15.6, 39.5], 'DJIBOUTI': [11.6, 43.1],
  'SOMALIA': [2.0, 45.3], 'COMOROS': [-12.2, 44.3], 'SUDAN': [19.6, 37.2],
  'RED SEA': [22.0, 38.0], 'ANDAMAN ISLANDS': [11.7, 92.7], 'AZORES': [38.7, -27.2],
  'CANARY ISLANDS': [28.1, -15.4], 'OKINAWA': [26.3, 127.8], 'HAWAII': [21.3, -157.8],
  'MEDITERRANEAN SEA': [35.0, 18.0], 'NORTH SEA': [56.0, 3.0],
  'CARIBBEAN SEA': [15.0, -75.0], 'ATLANTIC OCEAN': [25.0, -45.0],
  'PACIFIC OCEAN': [0.0, -150.0], 'INDIAN OCEAN': [-10.0, 70.0],
  'CEYLON': [7.0, 80.0], 'BURMA': [16.8, 96.2], 'SICILY': [37.5, 14.0],
  'CRETE': [35.2, 24.9], 'MALTA': [35.9, 14.5], 'CORSICA': [42.0, 9.0],
  'SARDINIA': [40.1, 9.1], 'ADRIATIC SEA': [43.0, 15.0],
  'BRITISH ISLES': [50.7, -1.1], 'WALES': [51.6, -5.1], 'GREENLAND': [64.2, -51.7],
  'BRITISH WEST INDIES': [17.0, -62.0], 'WEST INDIES': [17.0, -62.0],
  'DUTCH ANTILLES': [12.2, -68.9], 'VIRGIN ISLANDS': [18.3, -64.9],
  'TURKS & CAICOS': [21.8, -72.2], 'CAYMAN ISLANDS': [19.3, -81.3],
  'ARUBA': [12.5, -70.0], 'GRENADA': [12.1, -61.7],
  'ST. MARTIN': [18.1, -63.1], 'ST. LUCIA': [14.0, -61.0],
  'ANTIGUA': [17.1, -61.8], 'GUADELOUPE': [16.3, -61.6],
  'MARTINIQUE': [14.6, -61.0], 'DOMINICA': [15.4, -61.4],
  'KIRIBATI': [1.9, -157.5], 'TUVALU': [-8.5, 179.2],
  'MICRONESIA': [6.9, 158.2], 'AMERICAN SAMOA': [-14.3, -170.7],
  'FRENCH POLYNESIA': [-17.7, -149.4], 'COOK ISLANDS': [-21.2, -159.8],
  'NORFOLK ISLAND': [-29.0, 168.0], 'LORD HOWE ISLAND': [-31.6, 159.1],
  'NORTH ATLANTIC OCEAN': [35.0, -45.0], 'SOUTH ATLANTIC OCEAN': [-20.0, -20.0],
  'NORTH PACIFIC OCEAN': [25.0, -150.0], 'SOUTH PACIFIC OCEAN': [-20.0, -150.0],
  'BETWEEN USA & EUROPE': [40.0, -30.0], 'MID-ATLANTIC OCEAN': [20.0, -35.0],
  'CENTRAL PACIFIC': [5.0, -170.0], 'WESTERN PACIFIC': [5.0, 140.0],
  'TASMAN SEA': [-38.0, 160.0], 'CAPE VERDE ISLANDS': [15.0, -23.6],
  'EL SALVADOR': [13.5, -89.2], 'EQUATORIAL GUINEA': [3.7, 8.8],
  'GUINEA': [9.5, -13.7], 'LIBERIA': [6.3, -10.8], 'IVORY COAST': [5.3, -4.0],
  'CONGO': [-4.3, 11.9], 'BENIN': [6.4, 2.4], 'TOGO': [6.1, 1.2],
  'GAMBIA': [13.5, -16.6], 'GUINEA-BISSAU': [11.9, -15.6],
  'MAURITANIA': [18.1, -16.0], 'WESTERN SAHARA': [24.2, -13.0],
  'SOUTH CHINA SEA': [12.0, 113.0], 'PERSIAN GULF': [26.0, 52.0],
  'ARABIAN SEA': [15.0, 65.0], 'BAY OF BENGAL': [15.0, 87.0],
  'JAVA SEA': [-5.0, 110.0], 'CORAL SEA': [-18.0, 155.0],
  'ARAFURA SEA': [-9.0, 135.0], 'TIMOR SEA': [-11.0, 128.0],
  'BANDA SEA': [-5.0, 128.0], 'CELEBES SEA': [4.0, 122.0],
  'SULU SEA': [8.0, 120.0], 'GULF OF ADEN': [12.0, 47.0],
  'GULF OF OMAN': [24.0, 58.0], 'GULF OF MEXICO': [25.0, -90.0],
  'EAST CHINA SEA': [28.0, 125.0], 'DIEGO GARCIA': [-7.3, 72.4],
  'RODRIGUES': [-19.7, 63.4], 'CHAGOS ARCHIPELAGO': [-6.0, 71.3],
  'MAYOTTE': [-12.8, 45.2], 'ZANZIBAR': [-6.2, 39.2], 'PEMBA': [-5.0, 39.8],
  'BETWEEN USA & BERMUDA': [33.0, -70.0],
  'JORDAN': [29.5, 35.0], 'MONTENEGRO': [42.3, 18.8],
  'ALBANIA': [41.3, 19.8], 'GEORGIA': [41.6, 41.6],
  'UKRAINE': [46.5, 33.0], 'ROMANIA': [44.2, 28.7],
  'BULGARIA': [42.7, 27.7], 'CYPRUS': [34.7, 33.0],
  'SYRIA': [35.5, 35.8], 'IRAQ': [30.5, 47.8],
  'KUWAIT': [29.3, 48.0], 'BAHRAIN': [26.0, 50.5],
  'QATAR': [25.3, 51.2], 'CURACAO': [12.2, -69.0],
  'ST. KITTS': [17.3, -62.7], 'ST. VINCENT': [13.2, -61.2],
  'BONAIRE': [12.2, -68.3],
  'NORTH CAROLINA': [34.2, -77.8], 'SOUTH CAROLINA': [32.8, -79.9],
};

const US_AREA_COORDS: Record<string, [number, number]> = {
  'Florida': [27.8, -80.4], 'California': [33.8, -118.5], 'Hawaii': [21.3, -157.8],
  'South Carolina': [32.8, -79.9], 'North Carolina': [34.2, -77.8],
  'Texas': [27.8, -97.1], 'New York': [40.6, -73.8], 'New Jersey': [39.4, -74.2],
  'Oregon': [44.6, -124.1], 'Massachusetts': [41.7, -70.1],
  'Virginia': [37.0, -76.0], 'Georgia': [31.1, -81.4], 'Alabama': [30.3, -87.7],
  'Mississippi': [30.4, -89.1], 'Louisiana': [29.3, -89.9],
  'Connecticut': [41.2, -72.9], 'Rhode Island': [41.5, -71.4],
  'Maine': [43.7, -70.3], 'Maryland': [38.3, -76.5], 'Delaware': [38.7, -75.1],
  'Washington': [47.9, -124.6], 'Alaska': [58.3, -134.4],
};

const AU_AREA_COORDS: Record<string, [number, number]> = {
  'New South Wales': [-33.8, 151.3], 'Queensland': [-27.5, 153.0],
  'Western Australia': [-31.9, 115.9], 'South Australia': [-35.0, 138.5],
  'Victoria': [-38.1, 145.0], 'Tasmania': [-42.9, 147.3],
  'Northern Territory': [-12.5, 130.8],
};

const ZA_AREA_COORDS: Record<string, [number, number]> = {
  'KwaZulu-Natal': [-29.9, 31.0], 'Eastern Cape': [-33.8, 25.9],
  'Western Cape': [-34.1, 18.5],
};

const SPECIFIC_LOCATIONS: Record<string, [number, number]> = {
  'New Smyrna Beach': [29.03, -80.93], 'Daytona Beach': [29.21, -81.02],
  'Cocoa Beach': [28.32, -80.61], 'Melbourne Beach': [28.07, -80.56],
  'Jupiter': [26.93, -80.09], 'Palm Beach': [26.71, -80.04],
  'Fort Lauderdale': [26.12, -80.10], 'Miami Beach': [25.79, -80.13],
  'Key West': [24.56, -81.78], 'Myrtle Beach': [33.69, -78.89],
  'Outer Banks': [35.56, -75.47], 'Hilton Head': [32.22, -80.75],
  'Cape Cod': [41.67, -70.30], 'Montauk': [41.04, -71.86],
  'San Diego': [32.72, -117.16], 'Los Angeles': [33.94, -118.45],
  'Santa Cruz': [36.96, -122.02], 'San Francisco': [37.76, -122.51],
  'Malibu': [34.03, -118.78], 'Huntington Beach': [33.66, -118.00],
  'Bondi Beach': [-33.89, 151.27], 'Byron Bay': [-28.64, 153.62],
  'Gold Coast': [-28.00, 153.43], 'Ballina': [-28.87, 153.57],
  'Newcastle': [-32.93, 151.78], 'Sydney': [-33.87, 151.21],
  'Perth': [-31.95, 115.86], 'Margaret River': [-33.95, 114.98],
  'Esperance': [-33.86, 121.89], 'Adelaide': [-34.93, 138.60],
  'Cairns': [-16.92, 145.77], 'Townsville': [-19.26, 146.82],
  'Durban': [-29.86, 31.03], 'East London': [-33.02, 27.91],
  'Port Elizabeth': [-33.76, 25.67], 'Cape Town': [-33.92, 18.42],
  'Jeffreys Bay': [-33.97, 25.00], 'Muizenberg': [-34.11, 18.47],
  'Fish Hoek': [-34.13, 18.43], 'Gansbaal': [-34.58, 19.35],
  'Recife': [-8.05, -34.87], 'Rio de Janeiro': [-22.97, -43.18],
  'Sharm El Sheikh': [27.92, 34.33], 'Hurghada': [27.26, 33.81],
  'Marsa Alam': [25.07, 34.91], 'Dahab': [28.50, 34.51],
  'Cancun': [21.16, -86.85], 'Nassau': [25.05, -77.35],
  'Reunion Island': [-21.12, 55.53], 'Waikiki': [21.28, -157.83],
  'Galveston': [29.30, -94.79], 'Surf Beach': [-38.5, 145.6],
  'Cottesloe': [-31.99, 115.75], 'Manly': [-33.80, 151.29],
  'Coogee': [-33.92, 151.26], 'Maroubra': [-33.95, 151.25],
  'Cronulla': [-34.06, 151.16], 'Wollongong': [-34.42, 150.89],
  'Port Macquarie': [-31.43, 152.91], 'Coffs Harbour': [-30.30, 153.14],
  'Noosa': [-26.39, 153.09], 'Sunshine Coast': [-26.65, 153.09],
  'Stradbroke Island': [-27.45, 153.44],
  'Amanzimtoti': [-30.05, 30.89], 'Umhlanga': [-29.73, 31.09],
  'Port St Johns': [-31.63, 29.55], 'Plettenberg Bay': [-34.06, 23.37],
  'Mossel Bay': [-34.18, 22.13], 'Hermanus': [-34.42, 19.24],
  'Pensacola': [30.33, -87.28], 'Panama City Beach': [30.18, -85.80],
  'Destin': [30.39, -86.50], 'St. Augustine': [29.90, -81.31],
  'Jacksonville Beach': [30.29, -81.39], 'Fernandina Beach': [30.67, -81.44],
  'Clearwater': [27.96, -82.83], 'Sarasota': [27.34, -82.53],
  'Naples': [26.14, -81.80], 'Sanibel': [26.44, -82.10],
  'Marco Island': [25.94, -81.73], 'Vero Beach': [27.64, -80.37],
  'Stuart': [27.20, -80.25], 'Deerfield Beach': [26.32, -80.10],
  'Delray Beach': [26.46, -80.07], 'Boca Raton': [26.36, -80.08],
  'Pompano Beach': [26.24, -80.10], 'Hollywood Beach': [26.01, -80.12],
  'Virginia Beach': [36.85, -75.98], 'Ocean City': [38.34, -75.08],
  'Wrightsville Beach': [34.21, -77.80], 'Topsail': [34.38, -77.65],
  'Folly Beach': [32.66, -79.94], 'Isle of Palms': [32.79, -79.77],
  'Kiawah Island': [32.61, -80.08], 'Pawleys Island': [33.43, -79.12],
  'Tybee Island': [32.00, -80.85], 'Jekyll Island': [31.06, -81.42],
  'Padre Island': [26.57, -97.30], 'South Padre Island': [26.10, -97.17],
  'Bolinas': [37.91, -122.69], 'Half Moon Bay': [37.46, -122.44],
  'Pacifica': [37.61, -122.49], 'Stinson Beach': [37.90, -122.64],
  'Morro Bay': [35.37, -120.86], 'Pismo Beach': [35.14, -120.64],
  'Santa Barbara': [34.41, -119.69], 'Ventura': [34.27, -119.25],
  'Manhattan Beach': [33.88, -118.41], 'Hermosa Beach': [33.86, -118.40],
  'Newport Beach': [33.62, -117.93], 'Laguna Beach': [33.54, -117.79],
  'San Clemente': [33.43, -117.62], 'Oceanside': [33.20, -117.38],
  'Encinitas': [33.04, -117.29], 'Del Mar': [32.96, -117.27],
  'La Jolla': [32.85, -117.27], 'Imperial Beach': [32.58, -117.13],
  'Oahu': [21.46, -158.19], 'Maui': [20.80, -156.32],
  'Kauai': [22.07, -159.52], 'Big Island': [19.64, -155.99],
  'Ain Sokhna': [29.59, 32.31], 'El Gouna': [27.18, 33.68],
  'Safaga': [26.74, 33.94], 'Ras Mohammed': [27.73, 34.25],
  'Sahl Hasheesh': [27.06, 33.84], 'Makadi Bay': [27.02, 33.90],
};

const COUNTRY_CONTINENT: Record<string, string> = {
  'USA': 'North America', 'CANADA': 'North America', 'MEXICO': 'North America',
  'BAHAMAS': 'North America', 'CUBA': 'North America', 'JAMAICA': 'North America',
  'HAITI': 'North America', 'DOMINICAN REPUBLIC': 'North America',
  'PUERTO RICO': 'North America', 'BERMUDA': 'North America',
  'TRINIDAD & TOBAGO': 'North America', 'BARBADOS': 'North America',
  'COSTA RICA': 'North America', 'PANAMA': 'North America',
  'HONDURAS': 'North America', 'NICARAGUA': 'North America',
  'GUATEMALA': 'North America', 'BELIZE': 'North America', 'EL SALVADOR': 'North America',
  'BRAZIL': 'South America', 'COLOMBIA': 'South America',
  'VENEZUELA': 'South America', 'CHILE': 'South America',
  'ARGENTINA': 'South America', 'PERU': 'South America',
  'ECUADOR': 'South America', 'URUGUAY': 'South America',
  'AUSTRALIA': 'Oceania', 'NEW ZEALAND': 'Oceania', 'FIJI': 'Oceania',
  'PAPUA NEW GUINEA': 'Oceania', 'SAMOA': 'Oceania', 'TONGA': 'Oceania',
  'NEW CALEDONIA': 'Oceania', 'VANUATU': 'Oceania', 'SOLOMON ISLANDS': 'Oceania',
  'MARSHALL ISLANDS': 'Oceania', 'PALAU': 'Oceania', 'GUAM': 'Oceania',
  'KIRIBATI': 'Oceania', 'FRENCH POLYNESIA': 'Oceania', 'AMERICAN SAMOA': 'Oceania',
  'COOK ISLANDS': 'Oceania', 'MICRONESIA': 'Oceania', 'TUVALU': 'Oceania',
  'SOUTH AFRICA': 'Africa', 'MOZAMBIQUE': 'Africa', 'TANZANIA': 'Africa',
  'KENYA': 'Africa', 'MADAGASCAR': 'Africa', 'SENEGAL': 'Africa',
  'SIERRA LEONE': 'Africa', 'GHANA': 'Africa', 'NIGERIA': 'Africa',
  'GABON': 'Africa', 'CAMEROON': 'Africa', 'ANGOLA': 'Africa',
  'NAMIBIA': 'Africa', 'ERITREA': 'Africa', 'DJIBOUTI': 'Africa',
  'SOMALIA': 'Africa', 'COMOROS': 'Africa', 'SUDAN': 'Africa',
  'EGYPT': 'Africa', 'LIBYA': 'Africa', 'TUNISIA': 'Africa',
  'ALGERIA': 'Africa', 'MOROCCO': 'Africa', 'CAPE VERDE': 'Africa',
  'REUNION': 'Africa', 'SEYCHELLES': 'Africa', 'MAURITIUS': 'Africa',
  'LIBERIA': 'Africa', 'IVORY COAST': 'Africa', 'CONGO': 'Africa',
  'EQUATORIAL GUINEA': 'Africa', 'GUINEA': 'Africa', 'ZANZIBAR': 'Africa',
  'JAPAN': 'Asia', 'CHINA': 'Asia', 'INDIA': 'Asia', 'INDONESIA': 'Asia',
  'PHILIPPINES': 'Asia', 'THAILAND': 'Asia', 'MALAYSIA': 'Asia',
  'VIETNAM': 'Asia', 'SRI LANKA': 'Asia', 'PAKISTAN': 'Asia',
  'IRAN': 'Asia', 'OMAN': 'Asia', 'UNITED ARAB EMIRATES': 'Asia',
  'YEMEN': 'Asia', 'SAUDI ARABIA': 'Asia', 'ISRAEL': 'Asia',
  'LEBANON': 'Asia', 'TURKEY': 'Asia', 'SOUTH KOREA': 'Asia',
  'TAIWAN': 'Asia', 'HONG KONG': 'Asia', 'MALDIVES': 'Asia',
  'CEYLON': 'Asia', 'BURMA': 'Asia', 'ANDAMAN ISLANDS': 'Asia',
  'RUSSIA': 'Europe', 'ITALY': 'Europe', 'GREECE': 'Europe', 'CROATIA': 'Europe',
  'SPAIN': 'Europe', 'PORTUGAL': 'Europe', 'FRANCE': 'Europe',
  'UNITED KINGDOM': 'Europe', 'ENGLAND': 'Europe', 'SCOTLAND': 'Europe',
  'IRELAND': 'Europe', 'ICELAND': 'Europe', 'NORWAY': 'Europe',
  'SWEDEN': 'Europe', 'DENMARK': 'Europe', 'GERMANY': 'Europe',
  'NETHERLANDS': 'Europe', 'BELGIUM': 'Europe', 'POLAND': 'Europe',
  'SICILY': 'Europe', 'CRETE': 'Europe', 'MALTA': 'Europe',
  'CORSICA': 'Europe', 'SARDINIA': 'Europe', 'AZORES': 'Europe',
  'CANARY ISLANDS': 'Europe', 'GREENLAND': 'North America',
  'BRITISH WEST INDIES': 'North America', 'WEST INDIES': 'North America',
  'VIRGIN ISLANDS': 'North America', 'TURKS & CAICOS': 'North America',
  'CAYMAN ISLANDS': 'North America', 'ARUBA': 'North America',
  'GRENADA': 'North America', 'JORDAN': 'Asia', 'CYPRUS': 'Europe',
  'MONTENEGRO': 'Europe', 'ALBANIA': 'Europe',
};

const COUNTRY_OCEAN: Record<string, string> = {
  'USA': 'Atlantic', 'BAHAMAS': 'Atlantic', 'CUBA': 'Atlantic',
  'JAMAICA': 'Atlantic', 'BERMUDA': 'Atlantic', 'BRAZIL': 'Atlantic',
  'URUGUAY': 'Atlantic', 'ARGENTINA': 'Atlantic', 'VENEZUELA': 'Atlantic',
  'SOUTH AFRICA': 'Indian', 'MOZAMBIQUE': 'Indian', 'TANZANIA': 'Indian',
  'KENYA': 'Indian', 'MADAGASCAR': 'Indian', 'REUNION': 'Indian',
  'SEYCHELLES': 'Indian', 'MAURITIUS': 'Indian', 'MALDIVES': 'Indian',
  'INDIA': 'Indian', 'SRI LANKA': 'Indian', 'CEYLON': 'Indian',
  'AUSTRALIA': 'Pacific', 'NEW ZEALAND': 'Pacific', 'FIJI': 'Pacific',
  'PAPUA NEW GUINEA': 'Pacific', 'JAPAN': 'Pacific', 'PHILIPPINES': 'Pacific',
  'CHINA': 'Pacific', 'TAIWAN': 'Pacific', 'SOUTH KOREA': 'Pacific',
  'MEXICO': 'Pacific', 'CHILE': 'Pacific', 'PERU': 'Pacific', 'ECUADOR': 'Pacific',
  'INDONESIA': 'Pacific', 'COSTA RICA': 'Pacific', 'PANAMA': 'Pacific',
  'COLOMBIA': 'Pacific', 'CANADA': 'Atlantic',
  'EGYPT': 'Red Sea', 'SUDAN': 'Red Sea', 'JORDAN': 'Red Sea',
  'ITALY': 'Mediterranean', 'GREECE': 'Mediterranean', 'CROATIA': 'Mediterranean',
  'SPAIN': 'Mediterranean', 'FRANCE': 'Mediterranean', 'TURKEY': 'Mediterranean',
  'ISRAEL': 'Mediterranean', 'LIBYA': 'Mediterranean', 'TUNISIA': 'Mediterranean',
  'CYPRUS': 'Mediterranean', 'MONTENEGRO': 'Mediterranean', 'ALBANIA': 'Mediterranean',
  'PORTUGAL': 'Atlantic', 'UNITED KINGDOM': 'Atlantic', 'ENGLAND': 'Atlantic',
  'SCOTLAND': 'Atlantic', 'IRELAND': 'Atlantic', 'NORWAY': 'Atlantic',
  'SENEGAL': 'Atlantic', 'GHANA': 'Atlantic', 'NIGERIA': 'Atlantic',
  'NAMIBIA': 'Atlantic', 'ANGOLA': 'Atlantic', 'MOROCCO': 'Atlantic',
  'CAPE VERDE': 'Atlantic', 'IRAN': 'Indian', 'OMAN': 'Indian',
  'PAKISTAN': 'Indian', 'THAILAND': 'Indian', 'MALAYSIA': 'Indian',
  'HAWAII': 'Pacific', 'VIETNAM': 'Pacific', 'HONG KONG': 'Pacific',
  'HONDURAS': 'Atlantic', 'NICARAGUA': 'Atlantic', 'BELIZE': 'Atlantic',
  'UNITED ARAB EMIRATES': 'Indian', 'SAUDI ARABIA': 'Red Sea',
  'YEMEN': 'Red Sea',
};

// ---- Helper functions ----

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function applyCoastalJitter(base: [number, number], id: string, jitterAmount: number, maxDrift: number): [number, number] {
  const j = hashString(id);
  const rawLat = base[0] + (((j & 0xFF) / 255) - 0.5) * jitterAmount;
  const rawLng = base[1] + ((((j >> 8) & 0xFF) / 255) - 0.5) * jitterAmount;
  const lat = Math.max(base[0] - maxDrift, Math.min(base[0] + maxDrift, rawLat));
  const lng = Math.max(base[1] - maxDrift, Math.min(base[1] + maxDrift, rawLng));
  return [lat, lng];
}

function getCoords(country: string, area: string, location: string, id: string): [number, number] | null {
  const cu = (country || '').toUpperCase().trim();
  const ac = (area || '').trim();
  const lc = (location || '').trim();

  for (const [key, coords] of Object.entries(SPECIFIC_LOCATIONS)) {
    if (lc.toLowerCase().includes(key.toLowerCase()) || ac.toLowerCase().includes(key.toLowerCase())) {
      return applyCoastalJitter(coords, id, 0.05, 0.3);
    }
  }

  if (cu === 'USA') {
    for (const [st, coords] of Object.entries(US_AREA_COORDS)) {
      if (ac.toLowerCase().includes(st.toLowerCase())) {
        return applyCoastalJitter(coords, id, 0.3, 0.5);
      }
    }
  }
  if (cu === 'AUSTRALIA') {
    for (const [st, coords] of Object.entries(AU_AREA_COORDS)) {
      if (ac.toLowerCase().includes(st.toLowerCase())) {
        return applyCoastalJitter(coords, id, 0.3, 0.5);
      }
    }
  }
  if (cu === 'SOUTH AFRICA') {
    for (const [rg, coords] of Object.entries(ZA_AREA_COORDS)) {
      if (ac.toLowerCase().includes(rg.toLowerCase())) {
        return applyCoastalJitter(coords, id, 0.2, 0.3);
      }
    }
  }

  const cc = COUNTRY_COORDS[cu];
  if (cc) {
    return applyCoastalJitter(cc, id, 0.5, 0.8);
  }
  return null;
}

function getContinent(country: string): string {
  return COUNTRY_CONTINENT[(country || '').toUpperCase().trim()] || 'Unknown';
}

function getOcean(country: string, area: string): string {
  const cu = (country || '').toUpperCase().trim();
  if (cu === 'USA' && area) {
    const pacStates = ['California', 'Oregon', 'Washington', 'Hawaii', 'Alaska'];
    if (pacStates.some(s => area.includes(s))) return 'Pacific';
    const gulfStates = ['Texas', 'Louisiana', 'Mississippi', 'Alabama'];
    if (gulfStates.some(s => area.includes(s))) return 'Gulf of Mexico';
  }
  if (cu === 'AUSTRALIA' && area) {
    if (area.includes('Western Australia') || area.includes('South Australia')) return 'Indian';
  }
  return COUNTRY_OCEAN[cu] || 'Unknown';
}

function normalizeSpecies(raw: string): string {
  if (!raw || raw.trim() === '' || raw === 'Invalid') return 'Unknown';

  // Strip all quote variants (ASCII + Unicode curly), question marks, normalize whitespace
  const s = raw.trim()
    .replace(/[\u0022\u0027\u2018\u2019\u201C\u201D\u0060\u00AB\u00BB"'']+/g, '')
    .replace(/\?+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!s) return 'Unknown';

  // --- Unconfirmed / not stated / no shark ---
  if (/not (confirmed|cofirmed|confirmes|stated|stgated|staed|specified)/i.test(s)) return 'Unconfirmed';
  if (/involvement.*(unconfirmed|doubtful|prior to death|probable)/i.test(s)) return 'Unconfirmed';
  if (/questionable|no shark|invalid|not a shark|unidentified|undetermined/i.test(s)) return 'Unconfirmed';
  if (/caused by.*(eel|barracuda|stingray|dolphin)/i.test(s)) return 'Unconfirmed';
  if (/not caused by/i.test(s)) return 'Unconfirmed';
  if (/^not\s/i.test(s)) return 'Unconfirmed';
  if (/doubtful.*incident/i.test(s) || /does not ring true/i.test(s)) return 'Unconfirmed';
  if (/teeth?\s*(recovered|fragment)/i.test(s) || /tooth.*fragment/i.test(s)) return 'Unknown';
  if (/fragments?\s*recovered/i.test(s)) return 'Unknown';
  if (/several sharks|attacked by.*sharks|number of sharks/i.test(s)) return 'Unknown';
  if (/most likely.*shark/i.test(s) || /said to be/i.test(s)) return 'Unknown';
  if (/^a\s+small\s+shark/i.test(s)) return 'Unknown';

  // --- Size-only descriptions → Unknown ---
  // Matches: "4' shark", "1.8 m [6'] shark", "2 m shark", "6 ft shark", "small shark", etc.
  if (/^\+?\d/.test(s) && /shark/i.test(s) && !/shark\s*(species|type)/i.test(s)) {
    // It's a size + "shark" with no species name — check if a real species is embedded
    const lower = s.toLowerCase();
    if (/white|tiger|bull|mako|nurse|blue|hammer|lemon|reef|whaler|wobbegong|blacktip|spinner/i.test(lower)) {
      // Fall through to species matching below
    } else {
      return 'Unknown';
    }
  }
  if (/^(a\s+)?(very\s+)?(small|large|big|huge|juvenile|baby|young|little|long|thin)\s+(shark|brown|grey|gray)/i.test(s)) return 'Unknown';
  if (/^a\s+(school|pack|number|group)\s+of\s+shark/i.test(s)) return 'Unknown';
  if (/^\d+\s*shark/i.test(s) && !/shark\w/i.test(s)) return 'Unknown'; // "3 sharks"
  if (/^shark\s+(pup|caught|had)/i.test(s)) return 'Unknown';
  if (/^described as/i.test(s)) return 'Unknown';
  if (/^(suspected|thought to involve)\s+/i.test(s) && !/white|tiger|bull|mako|zambesi|whaler/i.test(s)) return 'Unconfirmed';

  // --- Known species (with typo tolerance) ---
  // White shark: catches "Wfite", "While", "Whte", "White xhark", "Wfite shark", "gws", "blue pointer"
  if (/w[hf]?[ifl][lt]e?\s*[sx]?h?[ax]rk/i.test(s) || /great\s*white/i.test(s) || /carcharodon/i.test(s) || /\bgws\b/i.test(s) || /blue pointer/i.test(s)) return 'White shark';
  // Tiger shark
  if (/tiger/i.test(s) || /galeocerdo/i.test(s) || /galapagos/i.test(s)) return 'Tiger shark';
  // Bull shark: catches "Zambesi", "zambezi", "Bu.ll", "c. leucas"
  if (/bu[.l]*ll/i.test(s) || /zambez/i.test(s) || /zambesi/i.test(s) || /carcharhinus leucas/i.test(s) || /c\.\s*leucas/i.test(s)) return 'Bull shark';
  // Blacktip: catches "black tipped", "blacktip", "c. limbatus", "c. maculipinnis"
  if (/black\s*tip/i.test(s) || /c\.\s*(limbatus|maculp?ipinnis)/i.test(s)) return 'Blacktip shark';
  if (/hammerhead/i.test(s) || /sphyrna/i.test(s)) return 'Hammerhead shark';
  // Mako: catches "blue whaler (galeolamna)"
  if (/mako/i.test(s) || /isurus/i.test(s) || /blue whaler/i.test(s) || /galeolamna/i.test(s)) return 'Mako shark';
  if (/nurse shark/i.test(s) || /ginglymostoma/i.test(s)) return 'Nurse shark';
  if (/blue shark/i.test(s) || /prionace/i.test(s) || /blue nose/i.test(s)) return 'Blue shark';
  if (/wobbegong/i.test(s) || /carpet shark/i.test(s)) return 'Wobbegong';
  if (/lemon/i.test(s) || /negaprion/i.test(s)) return 'Lemon shark';
  if (/spinner/i.test(s)) return 'Spinner shark';
  if (/reef shark/i.test(s)) return 'Reef shark';
  // Bronze whaler: catches "Broze", "whaler" (but not "blue whaler" which is mako)
  if (/bron?ze?\s*whaler/i.test(s) || /copper shark/i.test(s)) return 'Bronze whaler';
  if (/whaler/i.test(s) && !/blue/i.test(s)) return 'Bronze whaler';
  // Sand tiger / raggedtooth / sand shark / sandshark / sandbar
  if (/raggedtooth/i.test(s) || /sand\s*tiger/i.test(s) || /grey nurse/i.test(s) || /sand\s*bar/i.test(s)) return 'Sand tiger shark';
  if (/\bsand\s*shark/i.test(s)) return 'Sand tiger shark';
  if (/porbeagle/i.test(s)) return 'Porbeagle';
  if (/cookiecutter/i.test(s) || /cookie.cutter/i.test(s)) return 'Cookiecutter shark';
  // Sevengill: catches "7-gill", "seven-gill", "seven gill", "7 gill"
  if (/seven.?gill/i.test(s) || /7.?gill/i.test(s)) return 'Sevengill shark';
  if (/broadnose/i.test(s) || /cow shark/i.test(s)) return 'Sevengill shark';
  if (/thresher/i.test(s)) return 'Thresher shark';
  if (/oceanic\s*white\s*tip/i.test(s) || /white\s*tip/i.test(s)) return 'Oceanic whitetip';
  if (/whale shark/i.test(s)) return 'Whale shark';
  if (/basking/i.test(s)) return 'Basking shark';
  if (/angel shark/i.test(s)) return 'Angel shark';
  if (/dogfish/i.test(s) || /dog shark/i.test(s) || /spurdog/i.test(s)) return 'Dogfish';
  if (/dusky/i.test(s)) return 'Dusky shark';
  if (/salmon shark/i.test(s)) return 'Salmon shark';
  if (/epaulette/i.test(s)) return 'Epaulette shark';
  if (/goblin/i.test(s)) return 'Goblin shark';
  if (/soupfin/i.test(s) || /tope/i.test(s)) return 'Soupfin shark';
  if (/leopard/i.test(s)) return 'Leopard shark';
  if (/catshark/i.test(s)) return 'Catshark';
  if (/silvertip/i.test(s)) return 'Silvertip shark';
  if (/grey\s*(shark|colored)|gray\s*shark|grey-colored/i.test(s)) return 'Unknown';
  if (/brown.*(shark|colored)/i.test(s)) return 'Unknown';
  if (/slim.*shark/i.test(s)) return 'Unknown';

  // --- Catch-all: if it's just a size description we missed, or too vague ---
  // Anything that's mostly numbers/measurements with "shark"
  if (/^[\d.,\s'"\[\]()mft\-to+]+\s*(shark|lb|kg)/i.test(s)) return 'Unknown';
  // Anything with "thought to involve" or "suspected" + a species
  if (/thought to involve.*zambesi/i.test(s)) return 'Bull shark';
  if (/suspected.*gws/i.test(s) || /suspected.*white/i.test(s)) return 'White shark';

  // If nothing matched and it looks like a real species name (short, no numbers)
  if (s.length < 40 && !/\d/.test(s)) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  return 'Unknown';
}

function normalizeActivity(raw: string): string {
  if (!raw || raw.trim() === '') return 'Unknown';
  const s = raw.toLowerCase().trim();
  if (/surf/i.test(s)) return 'Surfing';
  if (/swim|bath|wading|standing|treading|floating|playing/i.test(s)) return 'Swimming';
  if (/div|snorkel|scuba|spearfish|free.?div|skin.?div/i.test(s)) return 'Diving';
  if (/fish|angl|net|trawl|crab|lobster|shrimp|oyster|clam/i.test(s)) return 'Fishing';
  if (/kayak|canoe|paddle|boat|sail|row|yacht|raft/i.test(s)) return 'Boating';
  if (/body.?board|boogie/i.test(s)) return 'Bodyboarding';
  if (/kite|windsurf|wakeboard|water.?ski|jet/i.test(s)) return 'Water sports';
  if (/disaster|shipwreck|sunk|torpedoed|overboard|plane|air/i.test(s)) return 'Sea disaster';
  return 'Other';
}

// ---- Data processing ----

interface FullAttack extends SharkAttack {
  area: string;
  location: string;
  name: string;
  sex: string;
  age: string;
  injury: string;
  time: string;
}

export interface FilterOptions {
  countries: string[];
  continents: string[];
  oceans: string[];
  species: string[];
  activities: string[];
  types: string[];
  yearRange: [number, number];
}

interface DataCache {
  mapData: SharkAttack[];
  detailMap: Record<string, AttackDetail>;
  stats: StatsData;
  filterOptions: FilterOptions;
  processedAt: Date;
}

function computeStats(attacks: FullAttack[]): StatsData {
  const fatal = attacks.filter(a => a.fatal).length;

  // By decade
  const decadeMap = new Map<string, { count: number; fatal: number }>();
  for (const a of attacks) {
    const decade = `${Math.floor(a.year / 10) * 10}s`;
    const existing = decadeMap.get(decade) || { count: 0, fatal: 0 };
    existing.count++;
    if (a.fatal) existing.fatal++;
    decadeMap.set(decade, existing);
  }
  const byDecade = Array.from(decadeMap.entries())
    .map(([decade, data]) => ({ decade, ...data }))
    .sort((a, b) => a.decade.localeCompare(b.decade));

  // Generic top-N counter
  function topN(key: keyof FullAttack, n: number) {
    const map = new Map<string, number>();
    for (const a of attacks) {
      const val = String(a[key] || 'Unknown');
      map.set(val, (map.get(val) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, n);
  }

  // By month
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthMap = new Map<number, number>();
  for (const a of attacks) {
    if (a.date) {
      const parts = a.date.split(/[-/]/);
      let month = -1;
      for (const p of parts) {
        const n = parseInt(p);
        if (n >= 1 && n <= 12 && p.length <= 2) { month = n - 1; break; }
      }
      if (month >= 0) {
        monthMap.set(month, (monthMap.get(month) || 0) + 1);
      }
    }
  }
  const byMonth = monthNames.map((name, i) => ({ name, count: monthMap.get(i) || 0 }));

  return {
    total: attacks.length,
    fatal,
    nonFatal: attacks.length - fatal,
    countriesAffected: new Set(attacks.map(a => a.country)).size,
    speciesIdentified: new Set(attacks.filter(a => a.species !== 'Unknown' && a.species !== 'Unconfirmed').map(a => a.species)).size,
    byDecade,
    byCountry: topN('country', 20),
    bySpecies: topN('species', 20),
    byActivity: topN('activity', 15),
    byContinent: topN('continent', 10),
    byOcean: topN('ocean', 10),
    byType: topN('type', 10),
    byMonth,
  };
}

function computeFilterOptions(attacks: FullAttack[]): FilterOptions {
  return {
    countries: [...new Set(attacks.map(a => a.country))].sort(),
    continents: [...new Set(attacks.map(a => a.continent))].filter(c => c !== 'Unknown').sort(),
    oceans: [...new Set(attacks.map(a => a.ocean))].filter(o => o !== 'Unknown').sort(),
    species: [...new Set(attacks.map(a => a.species))].filter(s => s !== 'Unknown').sort(),
    activities: [...new Set(attacks.map(a => a.activity))].filter(a => a !== 'Unknown').sort(),
    types: [...new Set(attacks.map(a => a.type))].filter(t => t !== '' && t !== 'Invalid').sort(),
    yearRange: [
      Math.min(...attacks.map(a => a.year), 1900),
      Math.max(...attacks.map(a => a.year), 2025),
    ],
  };
}

export function processXLS(xlsPath: string): DataCache {
  const wb = XLSX.readFile(xlsPath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const records: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  console.log(`Parsed ${records.length} raw records from XLS`);

  const attacks: FullAttack[] = [];
  const seen = new Set<string>();

  for (const r of records) {
    const country = (r['Country'] || '').trim();
    const area = (r['State'] || r['Area'] || '').trim();
    const location = (r['Location'] || '').trim();
    const yearStr = String(r['Year'] || '');
    const year = parseInt(yearStr) || 0;
    const caseNum = (r['Case Number'] || '').trim();
    const id = caseNum || `gsaf-${attacks.length}`;

    if (!country && !area && !location) continue;
    if (year < 1500 || year > 2026) continue;
    if (caseNum && seen.has(caseNum)) continue;
    if (caseNum) seen.add(caseNum);

    const coords = getCoords(country, area, location, id);
    if (!coords) continue;

    const fatalRaw = (r['Fatal Y/N'] || r['Fatal (Y/N)'] || '').toString().trim();
    const fatal = fatalRaw.toUpperCase().startsWith('Y');

    attacks.push({
      id,
      date: (r['Date'] || '').toString().trim(),
      year,
      type: (r['Type'] || 'Unknown').toString().trim(),
      country: country.charAt(0).toUpperCase() + country.slice(1).toLowerCase(),
      area,
      location,
      activity: normalizeActivity((r['Activity'] || '').toString()),
      name: (r['Name'] || 'Unknown').toString().trim(),
      sex: (r['Sex'] || r['Sex '] || '').toString().trim(),
      age: (r['Age'] || '').toString().trim(),
      injury: (r['Injury'] || '').toString().trim(),
      fatal,
      time: (r['Time'] || '').toString().trim(),
      species: normalizeSpecies((r['Species '] || r['Species'] || '').toString()),
      lat: Math.round(coords[0] * 1000) / 1000,
      lng: Math.round(coords[1] * 1000) / 1000,
      continent: getContinent(country),
      ocean: getOcean(country, area),
    });
  }

  attacks.sort((a, b) => b.year - a.year);

  // Build map data (12 core fields only)
  const mapData: SharkAttack[] = attacks.map(a => ({
    id: a.id, lat: a.lat, lng: a.lng, fatal: a.fatal,
    country: a.country, species: a.species, year: a.year,
    continent: a.continent, ocean: a.ocean, activity: a.activity,
    type: a.type, date: a.date,
  }));

  // Build detail map
  const detailMap: Record<string, AttackDetail> = {};
  for (const a of attacks) {
    detailMap[a.id] = {
      area: a.area, location: a.location, name: a.name,
      sex: a.sex, age: a.age, injury: a.injury, time: a.time,
    };
  }

  const stats = computeStats(attacks);
  const filterOptions = computeFilterOptions(attacks);

  console.log(`Processed ${attacks.length} attacks (${stats.fatal} fatal, ${stats.countriesAffected} countries)`);

  return { mapData, detailMap, stats, filterOptions, processedAt: new Date() };
}

// ---- In-memory cache + file watcher ----

let cache: DataCache | null = null;
let watcher: FSWatcher | null = null;

export function getCache(): DataCache {
  if (!cache) throw new Error('Data not initialized. Call initData() first.');
  return cache;
}

export function initData(xlsPath: string): void {
  cache = processXLS(xlsPath);

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  watcher = watch(xlsPath, () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      console.log('XLS file changed, re-processing...');
      try {
        cache = processXLS(xlsPath);
        console.log(`Re-processed at ${cache.processedAt.toISOString()}`);
      } catch (err) {
        console.error('Failed to re-process XLS:', err);
      }
    }, 1000);
  });
}

export function stopWatcher(): void {
  if (watcher) {
    watcher.close();
    watcher = null;
  }
}
