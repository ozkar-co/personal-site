import { useState } from 'react';
import { BlogEntry } from './BlogEntry';
import { entries } from './entries';
import './Blog.scss';

export const Blog = () => {
  const [selectedEntry, setSelectedEntry] = useState(entries[0]);

  return (
    <section className="blog">
      <div className="blog-container">
        <div className="blog-sidebar">
          <h2>BLOG</h2>
          <ul className="blog-entries-list">
            {entries.map((entry) => (
              <li 
                key={entry.id}
                className={`blog-entry-item ${selectedEntry.id === entry.id ? 'active' : ''}`}
                onClick={() => setSelectedEntry(entry)}
              >
                <h3>{entry.title}</h3>
                <span className="entry-date">{entry.date}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="blog-content">
          <BlogEntry entry={selectedEntry} />
        </div>
      </div>
    </section>
  );
}; 