import { useSearchParams, useNavigate } from 'react-router-dom';
import { BlogEntry } from './BlogEntry';
import { BlogEntryType } from './types';
import { blogService } from '../../services/blogService';
import { useState, useEffect, useRef } from 'react';
import { formatShortDateWithoutTimezone } from '../../utils/dateUtils';
import './Blog.scss';

export const Blog = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const entryId = searchParams.get('id');
  const blogContentRef = useRef<HTMLDivElement>(null);

  const [entries, setEntries] = useState<BlogEntryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        setLoading(true);
        setError(null);

        const blogEntries = await blogService.getBlogEntries();
        blogEntries.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setEntries(blogEntries);
      } catch (err) {
        console.error('Error loading blog entries:', err);
        setError(
          'Error al cargar las entradas del blog. Por favor, intenta de nuevo más tarde.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, []);

  // Navigate to the newest entry once the list is ready and no id is in the URL
  useEffect(() => {
    if (!loading && !entryId && entries.length > 0) {
      navigate(`/blog?id=${entries[0].id}`, { replace: true });
    }
  }, [loading, entryId, entries, navigate]);

  // Scroll to content when the selected entry changes
  useEffect(() => {
    if (entryId && blogContentRef.current) {
      const element = blogContentRef.current;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - 100;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, [entryId]);

  const currentEntry = entries.find((e) => e.id === entryId) || entries[0];

  const handleEntrySelect = (entry: BlogEntryType) => {
    navigate(`/blog?id=${entry.id}`);
  };

  if (loading) {
    return (
      <section className="blog">
        <div className="blog-container">
          <div className="blog-loading">
            <h2>BLOG</h2>
            <p>Cargando entradas...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="blog">
        <div className="blog-container">
          <div className="blog-error">
            <h2>BLOG</h2>
            <p className="error-message">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              Reintentar
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (entries.length === 0) {
    return (
      <section className="blog">
        <div className="blog-container">
          <div className="blog-empty">
            <h2>BLOG</h2>
            <p>No hay entradas de blog disponibles.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="blog">
      <div className="blog-container">
        <div className="blog-sidebar">
          <h2>BLOG</h2>
          <ul className="blog-entries-list">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className={`blog-entry-item ${currentEntry?.id === entry.id ? 'active' : ''}`}
                onClick={() => handleEntrySelect(entry)}
              >
                <h3>{entry.title}</h3>
                <span className="entry-date">
                  {formatShortDateWithoutTimezone(entry.date)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="blog-content" ref={blogContentRef}>
          {currentEntry && <BlogEntry entry={currentEntry} />}
        </div>
      </div>
    </section>
  );
};
