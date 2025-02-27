import './Projects.scss';

export const Projects = () => {
  return (
    <div className="projects">
      <div className="projects-container">
        <h1>Mis Proyectos</h1>
        <div className="company-description">
          <p>
            La lista completa de mis proyectos puedes encontrarla en el sitio web de mi empresa:
          </p>
          <a 
            href="https://forjadecodigo.com/portafolio" 
            target="_blank" 
            rel="noopener noreferrer"
            className="company-link-main"
          >
            La Forja de Código
          </a>
          <p className="company-slogan">
            Donde la imaginación se transforma en software
          </p>
        </div>
      </div>
    </div>
  );
};