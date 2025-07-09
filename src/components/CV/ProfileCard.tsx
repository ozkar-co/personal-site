import { ReactNode } from 'react';
import './ProfileCard.scss';

interface ProfileCardProps {
  title: string;
  icon: string;
  content: string;
  highlights: string[];
  alignRight?: boolean;
}

export const ProfileCard = ({ 
  title, 
  icon, 
  content, 
  highlights, 
  alignRight = false 
}: ProfileCardProps) => {
  return (
    <div className={`profile-card ${alignRight ? 'align-right' : 'align-left'}`}>
      <div className="profile-card-header">
        <div className="profile-icon">{icon}</div>
        <h3 className="profile-title">{title}</h3>
      </div>
      <div className="profile-card-content">
        <p className="profile-description">{content}</p>
        <div className="profile-highlights">
          <div className="highlights-grid">
            {highlights.map((highlight, index) => (
              <div key={index} className="highlight-item">
                {highlight}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 