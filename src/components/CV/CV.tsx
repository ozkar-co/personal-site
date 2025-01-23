import './CV.scss';
import { CVCard } from './CVCard';
import { ExperienceCard } from './ExperienceCard';
import { SkillCard } from './SkillCard';
import { 
  SiNodedotjs, SiJavascript, SiTypescript, 
  SiReact, SiMongodb, SiPostgresql, 
  SiMysql, SiGooglecloud,  SiLinux,
  SiDocker, SiLaravel, SiDjango,
} from 'react-icons/si';

export const CV = () => {
  return (
    <div className="cv">
      <h1>Curriculum Vitae</h1>
      <CVCard
        title="Sobre Mí"
        content="Soy Oscar Eduardo Bernal Sánchez, ingeniero de sistemas y CTO en Forja de Código. Con más de 8 años de experiencia en desarrollo FullStack, me especializo en arquitectura de software, escalabilidad y tecnología en la nube. Apasionado por la innovación, la inteligencia artificial y la construcción de soluciones eficientes."
      />
      
      <h1>Habilidades Técnicas</h1>
      
      <SkillCard
        alignRight
        title="Desarrollo Backend"
        skills={[
          { name: "Node.js", experience: "5 años", icon: SiNodedotjs },
          { name: "Laravel", experience: "3 años", icon: SiLaravel },
          { name: "Django", experience: "1 año", icon: SiDjango }
        ]}
      />

      <SkillCard
        title="Desarrollo Frontend"
        skills={[
          { name: "JavaScript", experience: "6 años", icon: SiJavascript },
          { name: "TypeScript", experience: "2 años", icon: SiTypescript },
          { name: "React", experience: "1 año", icon: SiReact }
        ]}
      />

      <SkillCard
        alignRight
        title="Bases de Datos"
        skills={[
          { name: "MongoDB", experience: "5 años", icon: SiMongodb },
          { name: "PostgreSQL", experience: "3 años", icon: SiPostgresql },
          { name: "MySQL", experience: "1 año", icon: SiMysql }
        ]}
      />

      <SkillCard
        title="DevOps"
        skills={[
          { name: "Linux", experience: "10 años", icon: SiLinux },
          { name: "Cloud", experience: "5 años", icon: SiGooglecloud },
          { name: "Docker", experience: "4 años", icon: SiDocker }
        ]}
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