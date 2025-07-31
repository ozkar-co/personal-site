#!/usr/bin/env node

/**
 * Blog Entries Preload Script
 * 
 * This script preloads blog entries from the API at build time
 * and saves them as static JSON files for Wayback Machine preservation.
 * 
 * Usage: npm run preload-blog
 * 
 * The script will:
 * 1. Fetch all blog entries from the API
 * 2. Save them as static JSON files in public/blog-entries/
 * 3. Generate individual HTML files for each blog entry
 * 4. Update sitemap.xml with blog entry URLs
 */

const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE_URL = 'https://forja-api.onrender.com';
const BLOG_ENTRIES_DIR = path.join(__dirname, '../public/blog-entries');
const BLOG_HTML_DIR = path.join(__dirname, '../public/blog-pages');

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(BLOG_ENTRIES_DIR)) {
    fs.mkdirSync(BLOG_ENTRIES_DIR, { recursive: true });
  }
  if (!fs.existsSync(BLOG_HTML_DIR)) {
    fs.mkdirSync(BLOG_HTML_DIR, { recursive: true });
  }
}

// Fetch blog entries from API
async function fetchBlogEntries() {
  try {
    console.log('📡 Fetching blog entries from API...');
    const response = await fetch(`${API_BASE_URL}/ozkar/blog`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blog entries: ${response.status}`);
    }
    
    const entries = await response.json();
    console.log(`✅ Fetched ${entries.length} blog entries`);
    return entries;
  } catch (error) {
    console.error('❌ Error fetching blog entries:', error);
    throw error;
  }
}

// Save blog entries as JSON files
function saveBlogEntriesAsJSON(entries) {
  console.log('💾 Saving blog entries as JSON files...');
  
  const entriesIndex = [];
  
  entries.forEach(entry => {
    // Save individual entry
    const entryFile = path.join(BLOG_ENTRIES_DIR, `${entry.slug}.json`);
    fs.writeFileSync(entryFile, JSON.stringify(entry, null, 2));
    
    // Add to index
    entriesIndex.push({
      slug: entry.slug,
      title: entry.title,
      date: entry.date,
      abstract: entry.abstract,
      tags: entry.tags
    });
  });
  
  // Save index file with metadata
  const indexData = {
    entries: entriesIndex,
    preloadDate: new Date().toISOString(),
    totalEntries: entriesIndex.length
  };
  const indexFile = path.join(BLOG_ENTRIES_DIR, 'index.json');
  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2));
  
  console.log(`✅ Saved ${entries.length} blog entries as JSON files`);
  return entriesIndex;
}

// Generate HTML files for each blog entry
function generateBlogHTMLFiles(entries) {
  console.log('🌐 Generating HTML files for blog entries...');
  
  entries.forEach(entry => {
    const htmlContent = generateBlogEntryHTML(entry);
    const htmlFile = path.join(BLOG_HTML_DIR, `${entry.slug}.html`);
    fs.writeFileSync(htmlFile, htmlContent);
  });
  
  console.log(`✅ Generated ${entries.length} HTML files for blog entries`);
}

// Generate HTML content for a blog entry
function generateBlogEntryHTML(entry) {
  const date = new Date(entry.date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${entry.title} - Ozkar.co Blog</title>
    <meta name="description" content="${entry.abstract}">
    <meta name="keywords" content="${entry.tags.join(', ')}">
    <meta name="author" content="Ozkar">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="${entry.title}">
    <meta property="og:description" content="${entry.abstract}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://ozkar.co/blog/${entry.slug}">
    <meta property="article:published_time" content="${entry.date}">
    <meta property="article:author" content="Ozkar">
    <link rel="canonical" href="https://ozkar.co/blog/${entry.slug}">
    <style>
        body {
            font-family: 'Courier New', monospace;
            background-color: #0a0a0a;
            color: #00ff00;
            margin: 0;
            padding: 2rem;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: rgba(26, 26, 26, 0.9);
            padding: 2rem;
            border-radius: 15px;
            border: 2px solid rgba(0, 255, 0, 0.3);
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.2);
        }
        h1 {
            color: #00ff00;
            text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
            margin-bottom: 1rem;
        }
        .meta {
            color: #888;
            font-size: 0.9rem;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid rgba(0, 255, 0, 0.3);
        }
        .content {
            margin-bottom: 2rem;
        }
        .tags {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(0, 255, 0, 0.3);
        }
        .tag {
            display: inline-block;
            background-color: rgba(0, 255, 0, 0.1);
            color: #00ff00;
            padding: 0.3rem 0.8rem;
            border-radius: 15px;
            margin: 0.2rem;
            border: 1px solid rgba(0, 255, 0, 0.3);
        }
        .back-link {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(0, 255, 0, 0.3);
        }
        .back-link a {
            color: #00ff00;
            text-decoration: none;
        }
        .back-link a:hover {
            text-shadow: 0 0 5px rgba(0, 255, 0, 0.8);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${entry.title}</h1>
        <div class="meta">
            <strong>Fecha:</strong> ${date}<br>
            <strong>Autor:</strong> Ozkar
        </div>
        <div class="content">
            ${entry.content}
        </div>
        <div class="tags">
            <strong>Etiquetas:</strong><br>
            ${entry.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="back-link">
            <a href="https://ozkar.co/blog">← Volver al blog</a>
        </div>
    </div>
</body>
</html>`;
}

// Update sitemap.xml with blog entries
function updateSitemap(entries) {
  console.log('🗺️ Updating sitemap.xml...');
  
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  const currentDate = new Date().toISOString().split('T')[0];
  
  let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ozkar.co/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://ozkar.co/cv</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://ozkar.co/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://ozkar.co/projects</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://ozkar.co/wizz</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://ozkar.co/time</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
  
  // Add blog entries to sitemap
  entries.forEach(entry => {
    const entryDate = new Date(entry.date).toISOString().split('T')[0];
    sitemapContent += `
  <url>
    <loc>https://ozkar.co/blog/${entry.slug}</loc>
    <lastmod>${entryDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });
  
  sitemapContent += `
</urlset>`;
  
  fs.writeFileSync(sitemapPath, sitemapContent);
  console.log(`✅ Updated sitemap.xml with ${entries.length} blog entries`);
}

// Main function
async function preloadBlogEntries() {
  console.log('🚀 Starting blog entries preload...');
  console.log('');
  
  try {
    // 1. Ensure directories exist
    ensureDirectories();
    
    // 2. Fetch blog entries from API
    const entries = await fetchBlogEntries();
    
    // 3. Save as JSON files
    const entriesIndex = saveBlogEntriesAsJSON(entries);
    
    // 4. Generate HTML files
    generateBlogHTMLFiles(entries);
    
    // 5. Update sitemap
    updateSitemap(entries);
    
    console.log('');
    console.log('🎉 Blog entries preload completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${entries.length} blog entries processed`);
    console.log(`   - JSON files saved to: ${BLOG_ENTRIES_DIR}`);
    console.log(`   - HTML files saved to: ${BLOG_HTML_DIR}`);
    console.log(`   - Sitemap updated with blog entry URLs`);
    
  } catch (error) {
    console.error('💥 Blog entries preload failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  preloadBlogEntries();
}

module.exports = { preloadBlogEntries }; 