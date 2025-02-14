import './Projects.scss';
import placeholderImage from '../../assets/placeholder.png';
import project1 from '../../assets/proy1.png';
import project2 from '../../assets/proy2.png';
import project3 from '../../assets/proy3.png';


interface Project {
  title: string;
  description: string;
  link: string;
  image: string;
}

const projects: Project[] = [

  {
    title: 'Sitio web de Oz',
    description: 'Mi propio sitio web personal, con mi información, mi blog y mis proyectos.',
    link: '/#',
    image: project1,
  },
  {
    title: 'Oz RO',
    description:'Servidor privado de Ragnarok Online',
    link: 'https://oz-ragnarok.web.app/',
    image: project2,
  },
  {
    title: 'Oz Cuentas',
    description: 'Sitio web para la gestion de finanzas personales',
    link: 'https://oz-cuentas.web.app/about',
    image: project3,
  },

];


export const Projects = () => {
  return (
    <div className="projects">
      <div className="projects-container">
        <h1>Mis Proyectos</h1>
        <p>Estos son algunos de mis proyectos, que he realizado en mi tiempo libre.</p>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-item">
              <a 
                href={project.link} 
                rel="noopener noreferrer" 
                className="project-link"
              >
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="project-image" 
                  onError={(e) => { e.currentTarget.src = placeholderImage; }}
                />
                <h2>{project.title}</h2>
                <p>{project.description}</p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};