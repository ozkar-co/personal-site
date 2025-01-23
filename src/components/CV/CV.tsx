import './CV.scss';
import { CVCard } from './CVCard';
import { ExperienceCard } from './ExperienceCard';
import { SkillCard } from './SkillCard';
import { 
  SiNodedotjs, SiJavascript, SiTypescript, 
  SiReact, SiMongodb, SiPostgresql, 
  SiMysql, SiGooglecloud, SiLinux,
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
        title="Forja de Código"
        position="CTO"
        organization="Forja de Código"
        location="Pereira, Colombia"
        period="Dic 2024 - Presente"
        achievements={[
          "Tomar decisiones sobre arquitectura, tecnologías, escalabilidad e innovación tecnológica de la startup",
          "Liderar y gestionar el equipo técnico, asegurando la calidad del código y la eficiencia del desarrollo",
          "Contribuir directamente en el desarrollo de código crítico o en momentos de alta demanda"
        ]}
      />

      <ExperienceCard
        alignRight
        title="BTi Lab"
        position="Desarrollador Backend"
        organization="BTi Lab"
        location="Remoto, Colombia"
        period="Feb 2023 – Ago 2023"
        achievements={[
          "Desarrollo de funcionalidades y sistemas de análisis de datos utilizando Python, Node.js, MongoDB y AWS",
          "Contribución en un producto de IA para optimizar publicaciones en redes sociales",
          "Expansión de experiencia técnica en la transición de Node.js a Python"
        ]}
      />

      <ExperienceCard
        title="DevSavant"
        position="Desarrollador Backend"
        organization="DevSavant"
        location="Remoto, Colombia"
        period="Feb 2022 – Ene 2023"
        achievements={[
          "Desarrollo de una herramienta de comunicación de usuarios, integrando múltiples proveedores de servicios",
          "Rediseño y mejora de un sistema de gestión de entregas, mejorando la escalabilidad",
          "Uso de Go, JavaScript, Node.js, Python, PHP y arquitectura de microservicios para soluciones robustas"
        ]}
      />

      <ExperienceCard
        alignRight
        title="S4N"
        position="Desarrollador Backend"
        organization="S4N"
        location="Remoto, Colombia"
        period="Ago 2019 – Dic 2021"
        achievements={[
          "Desarrollo de una herramienta en TypeScript para la carga automática y extracción de información de currículums",
          "Mejora de la estabilidad del sistema en un entorno de alta disponibilidad, asegurando 100% de cobertura en pruebas",
          "Automatización de procesos del equipo mediante la implementación de un bot de Slack para encuestas"
        ]}
      />

      <ExperienceCard
        title="Digital Product School"
        position="Ingeniero de Software"
        organization="Digital Product School by UnternehmerTUM"
        location="Múnich, Alemania"
        period="May 2019 – Jul 2019"
        achievements={[
          "Construcción de un sistema de reporte de retrasos de trenes utilizando Google Cloud y Firebase",
          "Implementación de características de gamificación para mejorar la interacción del usuario",
          "Configuración de contenedores Docker para el despliegue de proyectos"
        ]}
      />

      <ExperienceCard
        alignRight
        title="Konecta Software Factory"
        position="Analista Desarrollador"
        organization="Konecta Software Factory"
        location="Medellín, Colombia"
        period="Sep 2018 – Abr 2019"
        achievements={[
          "Refactorización de código legado y resolución de problemas en proyectos con PHP, SQL y JavaScript",
          "Gestión de una migración de base de datos para un cliente",
          "Creación y supervisión de pruebas técnicas para nuevos analistas"
        ]}
      />

      <ExperienceCard
        title="Tecnología Digital 7"
        position="Desarrollador Backend"
        organization="Tecnología Digital 7"
        location="Pereira, Colombia"
        period="Sep 2018 – Abr 2019"
        achievements={[
          "Desarrollo de un sistema web para el seguimiento del rendimiento de desarrolladores",
          "Diseño de interfaces para un sistema de Blockchain orientado a objetos",
          "Creación de una billetera de Bitcoin utilizando Node.js"
        ]}
      />

      <ExperienceCard
        alignRight
        title="Universidad Tecnológica de Pereira"
        position="Asistente de Desarrollo de Software"
        organization="Universidad Tecnológica de Pereira"
        location="Pereira, Colombia"
        period="Mar 2015 – Dic 2016"
        achievements={[
          "Mantenimiento y actualización de sitios web universitarios con PHP y Laravel",
          "Diseño de un sistema de georreferenciación con PHP Laravel para planificar rutas accesibles en el campus",
          "Desarrollo de un motor de búsqueda para reglamentos estudiantiles y creación de una base de datos de referencias bibliográficas"
        ]}
      />

      <h1>Educación</h1>
      <ExperienceCard
        title="Universidad Tecnológica de Pereira"
        position="Ingeniería de Sistemas y Computación"
        organization="Universidad Tecnológica de Pereira"
        location="Pereira, Colombia"
        period="2012-2017"
        achievements={[
          "Graduado con distinción",
          "Participación en semillero de investigación en Inteligencia Artificial",
          "Desarrollo de proyectos de software libre",
          "Monitor académico en programación y estructuras de datos"
        ]}
      />
    </div>
  );
} 