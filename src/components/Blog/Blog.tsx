import { useSearchParams, useNavigate } from 'react-router-dom';
import { BlogEntry } from './BlogEntry';
import { entries } from './entries';
import './Blog.scss';

export const Blog = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const entryId = searchParams.get('id');
  
  // Encontrar la entrada actual o usar la primera como fallback
  const currentEntry = entries.find(e => e.id === entryId) || entries[0];

  const handleEntrySelect = (entry: typeof entries[0]) => {
    navigate(`/blog?id=${entry.id}`);
  };

  return (
    <section className="blog">
      <div className="blog-container">
        <div className="blog-sidebar">
          <h2>BLOG</h2>
          <ul className="blog-entries-list">
            {entries.map((entry) => (
              <li 
                key={entry.id}
                className={`blog-entry-item ${currentEntry.id === entry.id ? 'active' : ''}`}
                onClick={() => handleEntrySelect(entry)}
              >
                <h3>{entry.title}</h3>
                <span className="entry-date">{entry.date}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="blog-content">
          <BlogEntry entry={currentEntry} />
        </div>
      </div>
    </section>
  );
}; 