import './Projects.scss';

interface Project {
  title: string;
  description: string;
  link: string;
}

const projects: Project[] = [
  {
    title: 'Proyecto 1',
    description: 'Descripción del Proyecto 1.',
    link: 'https://ejemplo1.com',
  },
  {
    title: 'Proyecto 2',
    description: 'Descripción del Proyecto 2.',
    link: 'https://ejemplo2.com',
  },
  {
    title: 'Proyecto 3',
    description: 'Descripción del Proyecto 3.',
    link: 'https://ejemplo3.com',
  },
  // Agrega más proyectos según sea necesario
];

export const Projects = () => {
  return (
    <div className="projects">
      <div className="projects-container">
        <h1>Mis Proyectos</h1>
        {projects.map((project, index) => (
          <div key={index} className="project-item">
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <a href={project.link} target="_blank" rel="noopener noreferrer">Ver Proyecto</a>
          </div>
        ))}
      </div>
    </div>
  );
};