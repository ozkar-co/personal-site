import { BlogEntryType } from './types.ts';
import './BlogEntry.scss';
import { useState, useRef, useEffect } from 'react';

interface BlogEntryProps {
  entry: BlogEntryType;
}

export const BlogEntry = ({ entry }: BlogEntryProps) => {
  const [showAbstract, setShowAbstract] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const toggleAbstract = () => {
    setShowAbstract(!showAbstract);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setShowAbstract(false);
    }
  };

  useEffect(() => {
    if (showAbstract) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAbstract]);

  return (
    <article className="blog-entry">
      <header>
        <div className="title-container">
          <h1>{entry.title}</h1>
          <button 
            className="tldr-button" 
            onClick={toggleAbstract}
            aria-label="Ver resumen"
          >
            TL;DR
          </button>
        </div>
        <time dateTime={entry.date}>{entry.date}</time>
      </header>
      <div className="blog-entry-content" dangerouslySetInnerHTML={{ __html: entry.content }} />
      <footer>
        <div className="tags">
          {entry.tags.map((tag) => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      </footer>

      {showAbstract && (
        <div className="abstract-modal">
          <div className="abstract-content" ref={modalRef}>
            <button 
              className="close-button" 
              onClick={toggleAbstract}
              aria-label="Cerrar resumen"
            >
              &times;
            </button>
            <h2>Resumen generado por IA</h2>
            <div dangerouslySetInnerHTML={{ __html: entry.abstract }} />
          </div>
        </div>
      )}
    </article>
  );
}; 