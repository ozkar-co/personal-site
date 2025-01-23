import { CVCard } from './CVCard';
import './SkillCard.scss';
import { IconType } from 'react-icons';

interface Skill {
  name: string;
  experience: string;
  icon: IconType;
}

interface SkillCardProps {
  title: string;
  skills: Skill[];
  alignRight?: boolean;
}

export const SkillCard = ({ title, skills, alignRight = false }: SkillCardProps) => {
  return (
    <CVCard
      title={title}
      alignRight={alignRight}
      content={
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div key={index} className="skill-item">
              <div className="skill-icon">
                <skill.icon />
              </div>
              <div className="skill-info">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-experience">{skill.experience}</span>
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
}; 