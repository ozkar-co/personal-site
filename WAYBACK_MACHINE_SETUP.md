# Wayback Machine Setup

This document explains how to configure the site for proper preservation by the Internet Archive's Wayback Machine.

## Problem

The original site uses dynamic loading of blog entries from an API, which means:
- Wayback Machine only captures the loading state, not the actual content
- Blog entries are not preserved in archives
- Search engines can't index individual blog posts

## Solution

We've implemented a hybrid system that combines static preloading with live API updates:

1. **Preloads blog entries at build time** from the API
2. **Generates static JSON files** for each blog entry
3. **Creates individual HTML pages** for each blog post
4. **Updates the sitemap** with all blog entry URLs
5. **Automatically fetches newer content** from the API that wasn't preloaded
6. **Falls back to API** if static files aren't available

## How to Use

### 1. Preload Blog Entries

Before building for production, run:

```bash
npm run preload-blog
```

This will:
- Fetch all blog entries from the API
- Save them as JSON files in `public/blog-entries/`
- Generate HTML files in `public/blog-pages/`
- Update `sitemap.xml` with blog entry URLs

### 2. Build with Blog Preload

For production builds that include blog entries:

```bash
npm run build-with-blog
```

This runs the preload script followed by the build process.

### 3. Deploy

Deploy normally - the static files will be included in the build.

## File Structure

After running the preload script, you'll have:

```
public/
├── blog-entries/
│   ├── index.json          # Index of all blog entries
│   ├── entry-1.json        # Individual blog entry
│   ├── entry-2.json        # Individual blog entry
│   └── ...
├── blog-pages/
│   ├── entry-1.html        # Static HTML for blog entry
│   ├── entry-2.html        # Static HTML for blog entry
│   └── ...
└── sitemap.xml             # Updated with blog entry URLs
```

## How It Works

### Hybrid Blog Service

The `staticBlogService.ts` provides a hybrid approach:

1. **Loads prebuilt content** from static JSON files
2. **Queries the API** for newer content not in preload
3. **Combines both sources** into a single list
4. **Falls back to API** if static files don't exist

### Blog Component

The Blog component automatically:
1. **Loads prebuilt content** first (fast)
2. **Fetches newer content** from API (if any)
3. **Merges and sorts** all content by date
4. **Provides seamless experience** with latest content

## Benefits

### For Wayback Machine
- ✅ **Complete blog content** is preserved
- ✅ **Individual blog pages** are archived
- ✅ **All URLs** are discoverable via sitemap

### For SEO
- ✅ **Search engines** can index individual posts
- ✅ **Meta tags** are properly set
- ✅ **Canonical URLs** are defined

### For Performance
- ✅ **Fast initial loading** from static files
- ✅ **Automatic updates** from API for new content
- ✅ **Reduced API calls** (only for newer content)
- ✅ **Better caching** by CDNs
- ✅ **Always up-to-date** content

## Configuration

### robots.txt
Updated to allow crawling of:
- `/blog-entries/` - JSON files
- `/blog-pages/` - HTML files
- Special rules for `ia_archiver` (Wayback Machine)

### sitemap.xml
Automatically updated with:
- All main pages
- All individual blog entry URLs
- Proper priorities and change frequencies

## Maintenance

### Adding New Blog Posts
1. Create the post via the admin interface
2. Run `npm run preload-blog` to update static files
3. Deploy with `npm run build-with-blog`

### Updating Existing Posts
1. Edit the post via the admin interface
2. Run `npm run preload-blog` to update static files
3. Deploy with `npm run build-with-blog`

## Troubleshooting

### Static Files Not Loading
- Check that `npm run preload-blog` was run
- Verify files exist in `public/blog-entries/`
- Check browser console for fetch errors

### API Fallback Not Working
- Verify API is accessible
- Check network connectivity
- Review API response format

### Build Errors
- Ensure all dependencies are installed
- Check that API is accessible during build
- Verify file permissions for writing to public/

## Notes

- Static files are generated at build time, not runtime
- The system gracefully falls back to API if static files aren't available
- Blog entries are sorted by date (newest first)
- All HTML files include proper meta tags for SEO
- The sitemap is automatically updated with current dates 