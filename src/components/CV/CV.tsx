import './CV.scss';
import { CVCard } from './CVCard';

export const CV = () => {
  return (
    <div className="cv">
      <h1>Curriculum Vitae</h1>
      
      <CVCard
        title="Experiencia Laboral"
        content={[
          "Desarrollador Senior en TechCorp (2020-presente)",
          "Desarrollador Full Stack en WebSolutions (2018-2020)",
          "Desarrollador Frontend en DigitalAgency (2016-2018)"
        ]}
        alignRight={false}
      />

      <CVCard
        title="Educación"
        content={[
          "Maestría en Ciencias de la Computación - Universidad Tech (2016)",
          "Licenciatura en Ingeniería de Software - Universidad Tech (2014)"
        ]}
        alignRight={true}
      />

      <CVCard
        title="Sobre Mí"
        content="Desarrollador apasionado con más de 6 años de experiencia en desarrollo web. Especializado en tecnologías frontend modernas y arquitecturas escalables."
        alignRight={false}
      />
    </div>
  );
} 