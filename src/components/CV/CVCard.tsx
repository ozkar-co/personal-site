import { ReactNode } from 'react';
import './CVCard.scss';

interface CVCardProps {
  title: string;
  content: string | string[] | ReactNode;
  alignRight?: boolean;
}

export const CVCard = ({ title, content, alignRight = false }: CVCardProps) => {
  return (
    <div className={`cv-card ${alignRight ? 'align-right' : 'align-left'}`}>
      <div className="cv-card-title">
        <h2>{title}</h2>
      </div>
      <div className="cv-card-content">
        {typeof content === 'string' ? (
          <p>{content}</p>
        ) : Array.isArray(content) ? (
          <ul>
            {content.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          content
        )}
      </div>
    </div>
  );
}; 