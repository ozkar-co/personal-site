import './CV.scss';
import { CVCard } from './CVCard';
import { ExperienceCard } from './ExperienceCard';
import { SkillCard } from './SkillCard';
import { 
  SiNodedotjs, SiJavascript, SiTypescript, 
  SiReact, SiMongodb, SiPostgresql, 
  SiMysql, SiGooglecloud, SiLinux,
  SiDocker, SiLaravel,
  SiPython,
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
        title="Desarrollo Backend"
        alignRight
        skills={[
          { name: "Node.js", experience: "5 años", icon: SiNodedotjs },
          { name: "Laravel", experience: "3 años", icon: SiLaravel },
          { name: "Python", experience: "1 año", icon: SiPython }
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
        title="Bases de Datos"
        alignRight
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
        position="Co-Founder & CTO"
        organization="Forja de Código"
        location="Pereira, Colombia"
        period="Ene 2025 - Presente"
        achievements={[
          "Tomar decisiones sobre arquitectura, tecnologías, escalabilidad e innovación tecnológica de la startup",
          "Liderar y gestionar el equipo técnico, asegurando la calidad del código y la eficiencia del desarrollo",
          "Contribuir directamente en el desarrollo de código crítico o en momentos de alta demanda"
        ]}
      />

      <ExperienceCard
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
        alignRight
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
        position="Desarrollador Backend"
        organization="Seven4N"
        location="Remoto, Colombia"
        period="Ago 2019 – Dic 2021"
        achievements={[
          "Desarrollo de una herramienta en TypeScript para la carga automática y extracción de información de currículums",
          "Mejora de la estabilidad del sistema en un entorno de alta disponibilidad, asegurando 100% de cobertura en pruebas",
          "Automatización de procesos del equipo mediante la implementación de un bot de Slack para encuestas"
        ]}
      />

      <ExperienceCard
        alignRight
        position="Ingeniero de Software"
        organization="Münchner Verkehrsgesellschaft mbH"
        location="Múnich, Alemania"
        period="May 2019 – Jul 2019"
        achievements={[
          "Construcción de un sistema de reporte de retrasos de trenes utilizando Google Cloud y Firebase",
          "Implementación de características de gamificación para mejorar la interacción del usuario",
          "Configuración de contenedores Docker para el despliegue de proyectos"
        ]}
      />

      <ExperienceCard
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
        alignRight
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
        alignRight
        organization="Universidad Tecnológica de Pereira"
        position="Ingeniería de Sistemas y Computación"
        location="Pereira, Colombia"
        period="Agosto 2018"
        achievements={[
          "Ciclo completo del desarrollo de software, análisis, diseño, desarrollo, despliegue y mantenimiento",
          "Liderazgo de equipos multidisciplinarios para crear soluciones tecnológicas adaptadas a organizaciones",
          "Diseño de modelos inteligentes para optimizar procesos y mejorar la eficiencia",
          "Investigación en tecnologías y compromiso con el aprendizaje continuo"
        ]}
      />

      <ExperienceCard
        organization="Digital Product School (DPS) by UnternehmerTUM"
        position="Beca en Ingeniería de Software"
        location="Múnich, Alemania"
        period="May 2019 - Jul 2019"
        achievements={[
          "Programa intensivo de tres meses enfocado en el desarrollo de productos digitales en un entorno multidisciplinario",
          "Aplicación de metodologías ágiles como Scrum y Design Thinking",
          "Aplicación de la metodología Lean para la validación rápida de ideas y desarrollo de productos con enfoque en la eficiencia"
        ]}
      />

      <h1>Extra Curriculares</h1>
      <ExperienceCard
        alignRight
        organization="Domus Galilea Monastery"
        position="Voluntariado"
        location="HaGalil, Israel"
        period="Sep 2023 – Sep 2024"
        achievements={[
          "Mejora de habilidades de comunicación e interculturales sirviendo a peregrinos de todo el mundo.",
          "Desarrollo de habilidades técnicas en mantenimiento de computadoras, carpintería y servicio de atención.",
          "Adaptabilidad, perseverancia y resolución de problemas a través de diversas tareas y experiencias de voluntariado."
        ]}
      />

      <ExperienceCard
        organization="Exile (Videogame)"
        position="Contribuidor Open-Source"
        location="Remoto, Colombia"
        period="Sep 2021, Jun 2022"
        achievements={[
          "Contribución al desarrollo de Exile, un juego de supervivencia en la naturaleza construido en el motor Minetest",
          "Adición de un nuevos objetos y mecánicas para mejorar la experiencia de juego",
          "Asistencia con la traducción al español, expandiendo la accesibilidad del juego a un público más amplio",
          "Mejora de la documentación del juego, asegurando instrucciones más claras y una mejor usabilidad general"
        ]}
      />
    </div>
  );
} 