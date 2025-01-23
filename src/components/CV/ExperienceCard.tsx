import { useState } from 'react';
import { CVCard } from './CVCard';
import './ExperienceCard.scss';

interface ExperienceCardProps {
  title: string;
  position: string;
  organization: string;
  location: string;
  period: string;
  achievements: string[];
  alignRight?: boolean;
}

export const ExperienceCard = ({
  title,
  position,
  organization,
  location,
  period,
  achievements,
  alignRight = false
}: ExperienceCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const mainContent = (
    <div className="experience-card-main" onClick={toggleExpand}>
      <div className="experience-card-header">
        <h3 className="position">{position}</h3>
      </div>
      <div className="experience-card-subheader">
        <span className="location">{location}</span>
        <span className="period">{period}</span>
      </div>
      <div className={`expand-arrow ${isExpanded ? 'expanded' : ''}`}>
        ▼
      </div>
    </div>
  );

  const detailsContent = (
    <div className={`experience-card-details ${isExpanded ? 'expanded' : ''}`}>
      <ul>
        {achievements.map((achievement, index) => (
          <li key={index}>{achievement}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <CVCard
      title={title}
      content={
        <div className="experience-card-content">
          {mainContent}
          {detailsContent}
        </div>
      }
      alignRight={alignRight}
    />
  );
}; 