/**
 * Directus Cleanup Script: Normalize EditorJS JSON (Zero-Dependency)
 * This version reads the EXISTING 'content' field and strips the 'time' key 
 * to resolve the "unsaved changes" prompt in Directus.
 * 
 * USE THIS IF YOU ALREADY DELETED THE 'body' FIELD.
 */

import fs from 'fs';

// 1. Manual .env parsing
const envPaths = ['./.env', './apps/web/.nuxt/.env'];
let DIRECTUS_URL = '';
let DIRECTUS_TOKEN = '';

for (const envPath of envPaths) {
  try {
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      for (const line of lines) {
        if (line.includes('DIRECTUS_URL=')) {
          DIRECTUS_URL = line.split('=')[1].trim().replace(/['"]/g, '');
        } else if (line.includes('NUXT_PUBLIC_DIRECTUS_URL=')) {
          DIRECTUS_URL = line.split('=')[1].trim().replace(/['"]/g, '');
        }
        if (line.includes('DIRECTUS_ADMIN_TOKEN=')) {
          DIRECTUS_TOKEN = line.split('=')[1].trim().replace(/['"]/g, '');
        }
      }
    }
  } catch (e) {}
}

if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
  console.error('Error: DIRECTUS_URL or DIRECTUS_ADMIN_TOKEN missing from .env');
  process.exit(1);
}

async function checkIdentity() {
  const url = `${DIRECTUS_URL}/users/me`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${DIRECTUS_TOKEN}` }
  });
  if (!response.ok) {
    const err = await response.text();
    console.error(`Token check failed: ${response.status} ${response.statusText}`);
    return false;
  }
  const { data } = await response.json();
  console.log(`Authenticated as: ${data.first_name} ${data.last_name} (${data.email})`);
  return true;
}

function generateId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function cleanupCollection(collectionName) {
  console.log(`\n--- Starting CLEANUP for: ${collectionName} ---`);
  
  try {
    // Fetch items that HAVE content
    const url = `${DIRECTUS_URL}/items/${collectionName}?fields=id,content,title&limit=2000`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${DIRECTUS_TOKEN}` }
    });
    
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to fetch ${collectionName}: ${response.status} - ${errText}`);
    }

    const { data: items } = await response.json();
    console.log(`Processing up to 2000 items...`);

    for (const item of items) {
      if (!item.content) continue;

      let blocksData = item.content;
      
      // If content is a stringified JSON, parse it
      if (typeof blocksData === 'string') {
        try {
          blocksData = JSON.parse(blocksData);
        } catch (e) {
          continue; // Not JSON
        }
      }

      let needsUpdate = false;

      // 1. Remove the 'time' field if present
      if (blocksData.time) {
        delete blocksData.time;
        needsUpdate = true;
      }

      // 2. Add IDs to blocks if missing
      if (blocksData.blocks && Array.isArray(blocksData.blocks)) {
        for (const block of blocksData.blocks) {
          if (!block.id) {
            block.id = generateId();
            needsUpdate = true;
          }
        }
      }

      // 3. Normalize version
      if (blocksData.version !== '2.25.0') {
        blocksData.version = '2.25.0';
        needsUpdate = true;
      }

      if (needsUpdate) {
        console.log(`Normalizing [${item.id}]: ${item.title}...`);

        // Update the item
        const patchUrl = `${DIRECTUS_URL}/items/${collectionName}/${item.id}`;
        const patchResponse = await fetch(patchUrl, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content: blocksData })
        });

        if (!patchResponse.ok) {
            const errData = await patchResponse.text();
            console.error(`Failed to update ${item.id}: ${errData}`);
        }
      }
    }
    
    console.log(`Cleanup complete for: ${collectionName}!`);
  } catch (error) {
    console.error(`Error cleaning ${collectionName}:`, error.message);
  }
}

async function main() {
  const isOk = await checkIdentity();
  if (!isOk) return;
  
  await cleanupCollection('posts');
  await cleanupCollection('pages');
}

main();
