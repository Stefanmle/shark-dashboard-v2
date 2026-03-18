import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { processXLS } from '../server/data.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const cache = processXLS(path.join(ROOT, 'data/GSAF5.xls'));

const apiDir = path.join(ROOT, 'dist', 'api');
mkdirSync(apiDir, { recursive: true });

writeFileSync(path.join(apiDir, 'attacks.json'), JSON.stringify(cache.mapData));
writeFileSync(path.join(apiDir, 'stats.json'), JSON.stringify(cache.stats));
writeFileSync(path.join(apiDir, 'filters.json'), JSON.stringify(cache.filterOptions));
writeFileSync(path.join(apiDir, 'details.json'), JSON.stringify(cache.detailMap));

console.log(`Generated static API: ${cache.mapData.length} attacks, ${Object.keys(cache.detailMap).length} details (4 files)`);
