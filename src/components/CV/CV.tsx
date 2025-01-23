import './CV.scss';
import { CVCard } from './CVCard';
import { ExperienceCard } from './ExperienceCard';

export const CV = () => {
  return (
    <div className="cv">
      <h1>Curriculum Vitae</h1>
      <CVCard
        title="Sobre Mí"
        content="Desarrollador apasionado con más de 6 años de experiencia en desarrollo web. Especializado en tecnologías frontend modernas y arquitecturas escalables."
      />
      <h1>Experiencia Laboral</h1>
      <ExperienceCard
        alignRight
        position="Desarrollador Senior"
        organization="TechCorp"
        location="Madrid, España"
        period="2020-presente"
        achievements={[
          "Liderazgo técnico en proyectos de desarrollo full-stack",
          "Implementación de arquitecturas escalables en la nube",
          "Mentoring de desarrolladores junior",
          "Optimización de rendimiento y seguridad de aplicaciones"
        ]}
      />

      <ExperienceCard
        position="Desarrollador Full Stack"
        organization="WebSolutions"
        location="Barcelona, España"
        period="2018-2020"
        achievements={[
          "Desarrollo de aplicaciones web con React y Node.js",
          "Diseño e implementación de APIs RESTful",
          "Integración de sistemas de pago y autenticación",
          "Mantenimiento y mejora de bases de datos"
        ]}
      />

      <ExperienceCard
        alignRight
        position="Desarrollador Frontend"
        organization="DigitalAgency"
        location="Valencia, España"
        period="2016-2018"
        achievements={[
          "Desarrollo de interfaces de usuario responsivas",
          "Implementación de diseños usando HTML5, CSS3 y JavaScript",
          "Optimización de rendimiento frontend",
          "Integración con APIs de terceros"
        ]}
      />
      <h1>Educación</h1>
      <ExperienceCard
        position="Maestría en Ciencias de la Computación"
        organization="Universidad Tech"
        location="Madrid, España"
        period="2014-2016"
        achievements={[
          "Especialización en Inteligencia Artificial y Machine Learning",
          "Proyecto de tesis sobre optimización de redes neuronales",
          "Participación en proyectos de investigación",
          "Premio a la mejor tesis del año"
        ]}
      />
      <ExperienceCard
        alignRight
        position="Ingeniería de Software"
        organization="Universidad Tech"
        location="Madrid, España"
        period="2010-2014"
        achievements={[
          "Graduado con honores - Promedio 9.2/10",
          "Líder del equipo de programación competitiva",
          "Desarrollo de proyectos open source",
          "Participación en hackathons y competencias de programación"
        ]}
      />

    </div>
  );
} 