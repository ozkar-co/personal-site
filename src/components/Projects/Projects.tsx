import './Projects.scss';
import { projects, Project } from '../../data/projects';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faReact, faJs, faSass, faGithub, faGoogle, faPaypal } from '@fortawesome/free-brands-svg-icons';
import { faMobileScreen, faDatabase, faGears, faFire, faCode, faMagnifyingGlass, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

// Add icons to library
library.add(
  faReact, faJs, faSass, faGithub, faGoogle, faPaypal,
  faMobileScreen, faDatabase, faGears, faFire, faCode, faMagnifyingGlass, faArrowsRotate
);

const getIcon = (iconName: string) => {
  const iconMap: Record<string, any> = {
    'fa-brands fa-react': faReact,
    'fa-brands fa-js': faJs,
    'fa-brands fa-sass': faSass,
    'fa-brands fa-github': faGithub,
    'fa-brands fa-google': faGoogle,
    'fa-brands fa-paypal': faPaypal,
    'fa-solid fa-mobile-screen': faMobileScreen,
    'fa-solid fa-database': faDatabase,
    'fa-solid fa-gears': faGears,
    'fa-solid fa-fire': faFire,
    'fa-solid fa-code': faCode,
    'fa-solid fa-magnifying-glass': faMagnifyingGlass,
    'fa-solid fa-arrows-rotate': faArrowsRotate
  };
  return iconMap[iconName];
};

export const Projects = () => {
  return (
    <div className="projects">
      <div className="projects-container">
        <h1>Mis Proyectos</h1>
        <div className="projects-grid">
          {Object.values(projects).map((project: Project) => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                <img src={`/assets/${project.imagen}`} alt={project.titulo} />
              </div>
              <div className="project-content">
                <div className="project-card-title">
                  <h2>{project.titulo}</h2>
                </div>
                <p className="project-description">{project.descripcion}</p>
                <div className="project-technologies">
                  <div className="tech-icons">
                    {project.tecnologias.map((tech, index: number) => (
                      <span key={index} className="tech-icon" title={tech.name}>
                        <FontAwesomeIcon icon={getIcon(tech.icon)} className="tech-icon-icon" />
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="project-features">
                  <ul>
                    {project.caracteristicas.map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  Visitar Proyecto
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};