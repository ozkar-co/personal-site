import { useState, useEffect } from 'react';
import './CV.scss';
import { CVCard } from './CVCard';
import { ExperienceCard } from './ExperienceCard';
import { SkillCard } from './SkillCard';
import { ProfileCard } from './ProfileCard';
import { 
  SiNodedotjs, SiJavascript, SiTypescript, 
  SiReact, SiMongodb, SiPostgresql, 
  SiMysql, SiGooglecloud, SiLinux,
  SiDocker, SiLaravel,
  SiPython,
} from 'react-icons/si';
import { loadCVData, CVData, SkillSection, Experience, Education, Extracurricular } from '../../services/cvService';

type TabType = 'about' | 'skills' | 'experience' | 'education' | 'extracurricular';

export const CV = () => {
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);

  // Mapa de iconos
  const iconMap = {
    SiNodedotjs,
    SiJavascript,
    SiTypescript,
    SiReact,
    SiMongodb,
    SiPostgresql,
    SiMysql,
    SiGooglecloud,
    SiLinux,
    SiDocker,
    SiLaravel,
    SiPython,
  };

  useEffect(() => {
    try {
      const data = loadCVData();
      setCvData(data);
    } catch (error) {
      console.error('Error loading CV data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const tabs = [
    { id: 'about', label: 'Sobre Mí', icon: '👤' },
    { id: 'skills', label: 'Habilidades', icon: '⚡' },
    { id: 'experience', label: 'Experiencia', icon: '💼' },
    { id: 'education', label: 'Educación', icon: '🎓' },
    { id: 'extracurricular', label: 'Extra', icon: '🌟' },
  ];

  const renderTabContent = () => {
    if (loading || !cvData) {
      return (
        <div className="tab-content">
          <div className="loading">Cargando CV...</div>
        </div>
      );
    }

    switch (activeTab) {
      case 'about':
        return (
          <div className="tab-content">
            <div className="profiles-section">
              {cvData.about.profiles.map((profile, index) => (
                <ProfileCard
                  key={index}
                  title={profile.title}
                  icon={profile.icon}
                  content={profile.content}
                  highlights={profile.highlights}
                  alignRight={index % 2 === 1}
                />
              ))}
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="tab-content">
            <div className="skills-section">
              {cvData.skills.map((skillSection: SkillSection, index: number) => (
                <SkillCard
                  key={index}
                  title={skillSection.title}
                  alignRight={skillSection.alignRight}
                  skills={skillSection.skills.map(skill => ({
                    ...skill,
                    icon: iconMap[skill.icon as keyof typeof iconMap]
                  }))}
                />
              ))}
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="tab-content">
            <div className="experience-section">
              {cvData.experience.map((exp: Experience, index: number) => (
                <ExperienceCard
                  key={index}
                  alignRight={exp.alignRight}
                  position={exp.position}
                  organization={exp.organization}
                  location={exp.location}
                  period={exp.period}
                  achievements={exp.achievements}
                />
              ))}
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="tab-content">
            <div className="education-section">
              {cvData.education.map((edu: Education, index: number) => (
                <ExperienceCard
                  key={index}
                  alignRight={edu.alignRight}
                  organization={edu.organization}
                  position={edu.position}
                  location={edu.location}
                  period={edu.period}
                  achievements={edu.achievements}
                />
              ))}
            </div>
          </div>
        );

      case 'extracurricular':
        return (
          <div className="tab-content">
            <div className="extracurricular-section">
              {cvData.extracurricular.map((extra: Extracurricular, index: number) => (
                <ExperienceCard
                  key={index}
                  alignRight={extra.alignRight}
                  organization={extra.organization}
                  position={extra.position}
                  location={extra.location}
                  period={extra.period}
                  achievements={extra.achievements}
                />
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="cv">
      <h1>Curriculum Vitae</h1>
      
      <div className="cv-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`cv-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as TabType)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="cv-content">
        {renderTabContent()}
      </div>
    </div>
  );
} 