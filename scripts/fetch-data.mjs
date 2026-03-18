#!/usr/bin/env node
// Fetches all shark attack data from OpenDataSoft API and saves as JSON

const API_BASE = 'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/global-shark-attack/records';
const PAGE_SIZE = 100;
const OUTPUT_FILE = './src/data/attacks.json';

import { writeFileSync } from 'fs';

async function fetchAll() {
  const records = [];
  let offset = 0;
  let total = 0;

  // First request
  console.log('Fetching shark attack data from OpenDataSoft...');
  const firstRes = await fetch(`${API_BASE}?limit=${PAGE_SIZE}&offset=0`);
  const firstData = await firstRes.json();
  total = firstData.total_count || 0;
  records.push(...(firstData.results || []));
  offset += PAGE_SIZE;
  console.log(`  Total records: ${total}`);
  console.log(`  Fetched: ${records.length}/${total}`);

  // Fetch remaining in batches of 5
  while (offset < total) {
    const batchUrls = [];
    for (let i = 0; i < 5 && offset < total; i++) {
      batchUrls.push(`${API_BASE}?limit=${PAGE_SIZE}&offset=${offset}`);
      offset += PAGE_SIZE;
    }

    const responses = await Promise.all(batchUrls.map(url => fetch(url)));
    const datas = await Promise.all(responses.map(r => r.json()));

    for (const data of datas) {
      records.push(...(data.results || []));
    }

    console.log(`  Fetched: ${records.length}/${total}`);
  }

  console.log(`\nTotal records fetched: ${records.length}`);

  // Save raw records
  writeFileSync(OUTPUT_FILE, JSON.stringify(records, null, 0));
  const sizeMB = (Buffer.byteLength(JSON.stringify(records)) / 1024 / 1024).toFixed(2);
  console.log(`Saved to ${OUTPUT_FILE} (${sizeMB} MB)`);
}

fetchAll().catch(err => {
  console.error('Failed to fetch data:', err);
  process.exit(1);
});
