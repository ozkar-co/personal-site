import yaml from 'js-yaml';
import cvData from '../data/cv.yaml?raw';

// Tipos para los datos del CV
export interface Skill {
  name: string;
  experience: string;
  icon: string;
}

export interface SkillSection {
  title: string;
  alignRight: boolean;
  skills: Skill[];
}

export interface Experience {
  alignRight: boolean;
  position: string;
  organization: string;
  location: string;
  period: string;
  achievements: string[];
}

export interface Education {
  alignRight: boolean;
  organization: string;
  position: string;
  location: string;
  period: string;
  achievements: string[];
}

export interface Extracurricular {
  alignRight: boolean;
  organization: string;
  position: string;
  location: string;
  period: string;
  achievements: string[];
}

export interface About {
  title: string;
  content: string;
}

export interface CVData {
  about: About;
  skills: SkillSection[];
  experience: Experience[];
  education: Education[];
  extracurricular: Extracurricular[];
}

// Mapa de iconos para convertir strings a componentes
export const iconMap: Record<string, any> = {
  SiNodedotjs: () => import('react-icons/si').then(m => m.SiNodedotjs),
  SiJavascript: () => import('react-icons/si').then(m => m.SiJavascript),
  SiTypescript: () => import('react-icons/si').then(m => m.SiTypescript),
  SiReact: () => import('react-icons/si').then(m => m.SiReact),
  SiMongodb: () => import('react-icons/si').then(m => m.SiMongodb),
  SiPostgresql: () => import('react-icons/si').then(m => m.SiPostgresql),
  SiMysql: () => import('react-icons/si').then(m => m.SiMysql),
  SiGooglecloud: () => import('react-icons/si').then(m => m.SiGooglecloud),
  SiLinux: () => import('react-icons/si').then(m => m.SiLinux),
  SiDocker: () => import('react-icons/si').then(m => m.SiDocker),
  SiLaravel: () => import('react-icons/si').then(m => m.SiLaravel),
  SiPython: () => import('react-icons/si').then(m => m.SiPython),
};

// Función para cargar los datos del CV
export const loadCVData = (): CVData => {
  try {
    const data = yaml.load(cvData) as CVData;
    return data;
  } catch (error) {
    console.error('Error loading CV data:', error);
    throw new Error('Failed to load CV data');
  }
};

// Función para obtener un icono por nombre
export const getIcon = (iconName: string) => {
  return iconMap[iconName];
}; 