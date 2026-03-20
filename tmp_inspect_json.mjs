/**
 * Directus JSON Inspector
 * Fetches the post recently saved by the user to see how EditorJS normalizes the data.
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

const TARGET_TITLE = 'PORTAL PROJECT: Sixth Anniversary';

async function main() {
  console.log(`Searching for: "${TARGET_TITLE}"`);
  
  try {
    const url = `${DIRECTUS_URL}/items/posts?filter[title][_eq]=${encodeURIComponent(TARGET_TITLE)}&fields=id,title,content`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${DIRECTUS_TOKEN}` }
    });
    
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to fetch: ${response.status} - ${errText}`);
    }

    const { data } = await response.json();
    const post = data[0];

    if (!post || !post.content) {
      console.log('Post not found or empty!');
      return;
    }

    const content = post.content;
    console.log('Version:', content.version);
    console.log('First Block Keys:', Object.keys(content.blocks[0]));
    console.log('First Block ID:', content.blocks[0].id);
    console.log('First Block Type:', content.blocks[0].type);

    // Also fetch one other post for comparison
    const otherUrl = `${DIRECTUS_URL}/items/posts?limit=1&offset=1&fields=id,title,content`;
    const otherResponse = await fetch(otherUrl, {
      headers: { Authorization: `Bearer ${DIRECTUS_TOKEN}` }
    });
    const { data: otherData } = await otherResponse.json();
    if (otherData[0]) {
      console.log('\n--- COMPARISON POST JSON (Synthetic) ---');
      console.log(JSON.stringify(otherData[0].content, null, 2));
      console.log('----------------------------------------');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
