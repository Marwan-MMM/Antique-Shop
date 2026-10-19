#!/usr/bin/env node
/* ============================================================================
   Antique Khan — migrate-images.mjs
   ONE-TIME helper: uploads the product photos that used to live inside the
   old Next.js project into Supabase Storage, so every image URL stored in
   the database resolves correctly.

   What it uploads (paths inside the OLD project folder):
     public/images/seed/*.jpg  →  product-images/seed/<name>.jpg
     uploads/*                 →  product-images/uploads/<name>

   Usage (run from the project root, on a machine you trust — the service
   key is NEVER written to disk or sent anywhere except Supabase):

     SUPABASE_SERVICE_ROLE_KEY="eyJ...your-service-key..." node migrate-images.mjs

   The service-role key is found in: Supabase Dashboard → Project Settings →
   API → service_role (secret). Do not commit it, do not put it in config.js.
============================================================================ */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const CONFIG_URL = 'https://vvwrexpwdmhvjsyyhnxn.supabase.co'; // keep in sync with config.js
const BUCKET = 'product-images';

const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SERVICE_KEY) {
  console.error(
    '\nMissing SUPABASE_SERVICE_ROLE_KEY environment variable.\n' +
    'Run:  SUPABASE_SERVICE_ROLE_KEY="eyJ..." node migrate-images.mjs\n'
  );
  process.exit(1);
}

const OLD_ROOT = process.argv[2] || '.'; // path to the old project folder
const sources = [
  { local: join(OLD_ROOT, 'public', 'images', 'seed'), remote: 'seed' },
  { local: join(OLD_ROOT, 'uploads'), remote: 'uploads' },
];

const MIME = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif',
};

let uploaded = 0;
let skipped = 0;
let failed = 0;

for (const src of sources) {
  let names;
  try {
    names = await readdir(src.local);
  } catch {
    console.log(`(skipping ${src.local} — folder not found)`);
    continue;
  }
  for (const name of names) {
    const ext = name.slice(name.lastIndexOf('.')).toLowerCase();
    if (!MIME[ext]) continue;
    const remotePath = `${src.remote}/${name}`;
    const url = `${CONFIG_URL}/storage/v1/object/${BUCKET}/${remotePath}`;
    try {
      const body = await readFile(join(src.local, name));
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SERVICE_KEY}`,
          apikey: SERVICE_KEY,
          'Content-Type': MIME[ext],
          'x-upsert': 'true',
        },
        body: body,
      });
      if (res.ok) {
        uploaded++;
        console.log(`✓ ${remotePath}`);
      } else if (res.status === 409) {
        skipped++;
        console.log(`• ${remotePath} (already exists)`);
      } else {
        failed++;
        console.error(`✗ ${remotePath} → HTTP ${res.status}: ${await res.text()}`);
      }
    } catch (err) {
      failed++;
      console.error(`✗ ${remotePath} → ${err.message}`);
    }
  }
}

console.log(`\nDone — uploaded: ${uploaded}, already present: ${skipped}, failed: ${failed}`);
if (failed > 0) process.exit(2);
