import { writeFileSync } from 'fs';

// Your book titles in Hebrew
const books = [
  'כשרות המטבח',
  'פסח',
  'שבת',
'פורים',
'חנוכה',
'סדר היום',
  // Add more book titles
];

const baseUrl = 'https://bealaha-beagada.com/';
const currentDate = new Date().toISOString().split('T')[0];

// Generate sitemap content
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  ${books.map(book => `
  <url>
    <loc>${baseUrl}/reading/${encodeURIComponent(book)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  `).join('')}
</urlset>`;

// Write to file
writeFileSync('public/sitemap.xml', sitemap);