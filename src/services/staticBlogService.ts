import { BlogEntryType } from '../components/Blog/types';
import { blogService } from './blogService';

// Interface for the static blog entry format
interface StaticBlogEntry {
  slug: string;
  title: string;
  date: string;
  abstract: string;
  content: string;
  tags: string[];
}

class StaticBlogService {
  private entries: BlogEntryType[] | null = null;
  private entriesIndex: StaticBlogEntry[] | null = null;
  private lastPreloadDate: string | null = null;

  // Load blog entries from static JSON files
  async loadEntries(): Promise<void> {
    try {
      // Load the index file first
      const indexResponse = await fetch('/blog-entries/index.json');
      if (!indexResponse.ok) {
        throw new Error(`Failed to load blog index: ${indexResponse.status}`);
      }
      
      const indexData = await indexResponse.json();
      
      // Handle both old format (array) and new format (object with metadata)
      if (Array.isArray(indexData)) {
        this.entriesIndex = indexData;
      } else {
        this.entriesIndex = indexData.entries || [];
      }
      
      // Load individual entries
      this.entries = await Promise.all(
        this.entriesIndex!.map(async (entry) => {
          const entryResponse = await fetch(`/blog-entries/${entry.slug}.json`);
          if (!entryResponse.ok) {
            throw new Error(`Failed to load blog entry ${entry.slug}: ${entryResponse.status}`);
          }
          
          const fullEntry = await entryResponse.json();
          return this.mapStaticEntryToBlogEntry(fullEntry);
        })
      );
      
      // Sort by date (newest first)
      this.entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      // Store the date of the newest preloaded entry
      if (this.entries.length > 0) {
        this.lastPreloadDate = this.entries[0].date;
      }
      
    } catch (error) {
      console.error('Error loading static blog entries:', error);
      throw error;
    }
  }

  // Get only static blog entries (no API call)
  async getStaticEntries(): Promise<BlogEntryType[]> {
    if (!this.entries) {
      await this.loadEntries();
    }
    return this.entries || [];
  }

  // Get all blog entries (static + API)
  async getBlogEntries(): Promise<BlogEntryType[]> {
    if (!this.entries) {
      await this.loadEntries();
    }

    // Start with static entries
    const allEntries = [...(this.entries || [])];
    
    // Try to fetch newer entries from API
    try {
      const apiEntries = await blogService.getBlogEntries();
      
      // Filter out entries that are already in static files
      const staticSlugs = new Set(allEntries.map(entry => entry.id));
      const newApiEntries = apiEntries.filter(entry => !staticSlugs.has(entry.id));
      
      if (newApiEntries.length > 0) {
        console.log(`🆕 Found ${newApiEntries.length} new entries from API`);
        allEntries.push(...newApiEntries);
        
        // Re-sort by date (newest first)
        allEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
      
    } catch (error) {
      console.warn('⚠️ Could not fetch new entries from API, using only static entries:', error);
    }
    
    return allEntries;
  }

  // Get a specific blog entry by slug
  async getBlogEntry(slug: string): Promise<BlogEntryType | null> {
    // First check static entries
    if (!this.entries) {
      await this.loadEntries();
    }
    
    const staticEntry = this.entries?.find(entry => entry.id === slug);
    if (staticEntry) {
      return staticEntry;
    }
    
    // If not found in static entries, try API
    try {
      const apiEntries = await blogService.getBlogEntries();
      return apiEntries.find(entry => entry.id === slug) || null;
    } catch (error) {
      console.warn('⚠️ Could not fetch entry from API:', error);
      return null;
    }
  }

  // Get blog entries index (for sitemap generation)
  async getBlogEntriesIndex(): Promise<StaticBlogEntry[]> {
    if (!this.entriesIndex) {
      await this.loadEntries();
    }
    return this.entriesIndex || [];
  }

  // Get preload metadata
  async getPreloadMetadata(): Promise<{ preloadDate: string; totalEntries: number } | null> {
    try {
      const response = await fetch('/blog-entries/index.json');
      if (!response.ok) return null;
      
      const data = await response.json();
      if (Array.isArray(data)) return null;
      
      return {
        preloadDate: data.preloadDate,
        totalEntries: data.totalEntries
      };
    } catch {
      return null;
    }
  }

  // Get the date of the newest preloaded entry
  getLastPreloadDate(): string | null {
    return this.lastPreloadDate;
  }

  // Map static entry format to BlogEntryType
  private mapStaticEntryToBlogEntry(staticEntry: any): BlogEntryType {
    return {
      id: staticEntry.slug,
      title: staticEntry.title,
      date: staticEntry.date,
      content: staticEntry.content,
      abstract: staticEntry.abstract,
      tags: staticEntry.tags || [],
    };
  }

  // Check if static files are available
  async isStaticModeAvailable(): Promise<boolean> {
    try {
      const response = await fetch('/blog-entries/index.json');
      return response.ok;
    } catch {
      return false;
    }
  }

  // Get entries that are newer than the preload date
  async getNewerEntries(): Promise<BlogEntryType[]> {
    if (!this.lastPreloadDate) {
      return [];
    }

    try {
      const apiEntries = await blogService.getBlogEntries();
      return apiEntries.filter(entry => 
        new Date(entry.date) > new Date(this.lastPreloadDate!)
      );
    } catch (error) {
      console.warn('⚠️ Could not fetch newer entries from API:', error);
      return [];
    }
  }
}

// Export singleton instance
export const staticBlogService = new StaticBlogService(); 