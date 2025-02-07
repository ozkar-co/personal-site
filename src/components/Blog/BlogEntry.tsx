import { BlogEntryType } from './types.ts';
import './BlogEntry.scss';

interface BlogEntryProps {
  entry: BlogEntryType;
}

export const BlogEntry = ({ entry }: BlogEntryProps) => {
  return (
    <article className="blog-entry">
      <header>
        <h1>{entry.title}</h1>
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
    </article>
  );
}; 