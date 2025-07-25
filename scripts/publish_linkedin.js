// scripts/publish_linkedin.js
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const matter = require('gray-matter');

// Configura tus credenciales
const LINKEDIN_ACCESS_TOKEN = 'TU_ACCESS_TOKEN'; // Reemplaza por tu token real
const ORGANIZATION_ID = 'TU_ORG_ID'; // O tu URN personal: 'urn:li:person:xxxx'
const SITE_URL = 'https://hgaruna.org/articulos/';

const articlesDir = path.resolve(__dirname, '../src/content/articulos');
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
if (!files.length) {
  console.log('No hay artículos para publicar.');
  process.exit(0);
}
const latestFile = files.sort((a, b) => fs.statSync(path.join(articlesDir, b)).mtime - fs.statSync(path.join(articlesDir, a)).mtime)[0];
const { data, content } = matter(fs.readFileSync(path.join(articlesDir, latestFile), 'utf-8'));

const postText = `${data.title}\n\n${data.summary || content.split('\n')[0].slice(0, 200) + '...'}\n\nLee más: ${SITE_URL}${latestFile.replace('.md', '')}`;

async function publishToLinkedIn() {
  try {
    const res = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      {
        author: `urn:li:organization:${ORGANIZATION_ID}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text: postText },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
      },
      {
        headers: {
          'Authorization': `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
          'X-Restli-Protocol-Version': '2.0.0',
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Publicado en LinkedIn:', res.data);
  } catch (err) {
    console.error('Error publicando en LinkedIn:', err.response?.data || err.message);
  }
}

publishToLinkedIn();
