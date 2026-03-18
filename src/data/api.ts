import { SharkAttack, AttackDetail } from '../types';

export async function fetchAllAttacks(
  onProgress?: (loaded: number, total: number) => void
): Promise<SharkAttack[]> {
  const res = await fetch('/api/attacks');
  if (!res.ok) throw new Error(`Failed to load data: ${res.status}`);

  const contentLength = res.headers.get('Content-Length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;

  if (!res.body || !total || !onProgress) {
    const data = await res.json();
    onProgress?.(1, 1);
    return data as SharkAttack[];
  }

  // Stream with progress
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;
    onProgress(loaded, total);
  }

  const blob = new Blob(chunks as BlobPart[]);
  const text = await blob.text();
  return JSON.parse(text) as SharkAttack[];
}

let detailCache: Record<string, AttackDetail> | null = null;

export async function fetchAttackDetail(id: string): Promise<AttackDetail | null> {
  if (!detailCache) {
    const res = await fetch('/api/details');
    if (!res.ok) throw new Error(`Failed to load details: ${res.status}`);
    detailCache = await res.json();
  }
  return detailCache![id] ?? null;
}
