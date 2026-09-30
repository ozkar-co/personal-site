import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Blog.scss';

/** El blog público es HTML estático en /blog/. Esta ruta solo redirige. */
export const Blog = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    const target = id ? `/blog/${encodeURIComponent(id)}` : '/blog';
    if (window.location.pathname !== target) {
      window.location.replace(target);
    }
  }, [id]);

  return (
    <section className="blog">
      <div className="blog-container">
        <p>Abriendo el blog…</p>
      </div>
    </section>
  );
};
