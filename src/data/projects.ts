export interface Project {
  id: string;
  titulo: string;
  descripcion: string;
  tecnologias: Array<{
    name: string;
    icon: string;
  }>;
  caracteristicas: string[];
  imagen: string;
  url: string;
  fecha: string;
}

// NOTA: Los proyectos se deben agregar en orden cronológico, de más reciente a más antiguo.
// NOTA: si se añaden iconos nuevos, se debe agregar en el archivo src/components/Projects/Projects.tsx

export const projects: Record<string, Project> = {
  "FollowTracker_Social": {
    "id": "FollowTracker_Social",
    "titulo": "FollowTracker - Gestor de Redes Sociales",
    "descripcion": "Aplicación minimalista con interfaz gráfica escrita en Python para llevar un registro personal de interacciones en redes sociales. Permite registrar a quién sigues, si te dieron follow back, o si dejaste de seguir a alguien. Ideal para creadores de contenido, community managers o usuarios interesados en gestionar de forma consciente sus conexiones. Incluye buscador avanzado, historial cronológico y estadísticas detalladas.",
    "tecnologias": [
      { "name": "Python", "icon": "fa-brands fa-python" },
      { "name": "Tkinter", "icon": "fa-solid fa-desktop" },
      { "name": "YAML", "icon": "fa-solid fa-file-code" },
      { "name": "GUI", "icon": "fa-solid fa-window-maximize" },
      { "name": "Data Tracking", "icon": "fa-solid fa-chart-bar" }
    ],
    "caracteristicas": [
      "Interfaz gráfica minimalista y fácil de usar",
      "Registro de interacciones con botones intuitivos",
      "Buscador avanzado con filtros por estado",
      "Historial cronológico de eventos por cuenta",
      "Enlaces directos a perfiles de redes sociales",
      "Estadísticas detalladas de relaciones",
      "Almacenamiento local en formato YAML",
      "Ordenamiento por columnas (seguido, follow back, etc.)"
    ],
    "imagen": "proyecto9.png",
    "url": "https://github.com/ozkar-co/followTracker",
    "fecha": "2025-01-25T05:00:00.000Z"
  },
  "FabriCalc_3D_Printing": {
    "id": "FabriCalc_3D_Printing",
    "titulo": "FabriCalc - Calculadora de Costos 3D",
    "descripcion": "FabriCalc es una herramienta de código abierto para calcular el costo real de una impresión 3D, considerando materiales, tiempo, electricidad, depreciación de máquina, envío y ganancia. Diseñada para makers, desarrolladores y emprendedores que desean estimar precios de forma técnica y ajustada a su realidad.",
    "tecnologias": [
      { "name": "Python", "icon": "fa-brands fa-python" },
      { "name": "GUI", "icon": "fa-solid fa-desktop" },
      { "name": "JSON", "icon": "fa-solid fa-file-code" },
      { "name": "3D Printing", "icon": "fa-solid fa-cube" },
      { "name": "Cost Analysis", "icon": "fa-solid fa-calculator" }
    ],
    "caracteristicas": [
      "Cálculo detallado de costos: Material, tiempo, electricidad y depreciación",
      "Configuración editable desde archivo externo (config.json)",
      "Interfaz gráfica intuitiva en Python",
      "Soporte para múltiples tipos de materiales (PLA, PETG, etc.)",
      "Cálculo de costos de envío (local y nacional)",
      "Margen de ganancia configurable",
      "Estimación de tiempo de postprocesado",
      "Pensado para uso personal o en talleres"
    ],
    "imagen": "proyecto8.png",
    "url": "https://github.com/ozkar-co/fabricalc",
    "fecha": "2025-01-20T05:00:00.000Z"
  },
  "EMM4aX9bN2cP5qR8tY1z": {
    "id": "EMM4aX9bN2cP5qR8tY1z",
    "titulo": "Emma - Chatbot IA local",
    "descripcion": "Emma es una interfaz de chat en Python diseñada para interactuar con Ollama, específicamente optimizada para el modelo gemma3:1b. Esta interfaz proporciona una manera eficiente de administrar interacciones con Ollama, contextos de conversación, memoria de chat, configuraciones personalizadas, personalidades para el asistente e historial de conversaciones. Incluye múltiples personalidades predefinidas y un sistema de memoria avanzado para conversaciones más coherentes.",
    "tecnologias": [
      { "name": "Python", "icon": "fa-brands fa-python" },
      { "name": "Ollama", "icon": "fa-solid fa-robot" },
      { "name": "AI/ML", "icon": "fa-solid fa-brain" },
      { "name": "CLI", "icon": "fa-solid fa-terminal" },
      { "name": "YAML", "icon": "fa-solid fa-file-code" }
    ],
    "caracteristicas": [
      "Interfaz de línea de comandos intuitiva y amigable",
      "Múltiples personalidades predefinidas (Técnica, Creativa, Concisa, etc.)",
      "Sistema de memoria a largo plazo con búsqueda contextual",
      "Gestión completa de conversaciones y historial",
      "Configuración flexible de parámetros del modelo",
      "Soporte para diferentes modelos de Ollama",
      "Comandos especiales integrados para gestión avanzada"
    ],
    "imagen": "proyecto7.png",
    "url": "https://github.com/ozkar-co/Emma",
    "fecha": "2025-01-10T05:00:00.000Z"
  },
  "ASH7wK3mN9xP2qR5tY8z": {
    "id": "ASH7wK3mN9xP2qR5tY8z",
    "titulo": "Ashwake",
    "descripcion": "Ashwake es un juego de supervivencia RPG sandbox ambientado en las desoladas secuelas de una era olvidada. En un mundo donde Velrot, una corrupción desconocida e insidiosa, ha retorcido la tierra y la vida misma, despiertas solo como una Unidad Amnesis, un recipiente biomecánico sin memoria ni pasado. Sin guía, ciudades o otros seres conscientes, tu camino es tuyo. Explora, sobrevive y descubre la verdad enterrada bajo ruinas y tiempo.",
    "tecnologias": [
      { "name": "Lua", "icon": "fa-solid fa-code" },
      { "name": "Luanti Engine", "icon": "fa-solid fa-gamepad" },
      { "name": "Voxel", "icon": "fa-solid fa-cube" },
      { "name": "Game Development", "icon": "fa-solid fa-puzzle-piece" }
    ],
    "caracteristicas": [
      "Supervivencia impulsada por exploración en mundo abierto",
      "Sistema de progresión alquímica complejo",
      "Entidades elementales nocturnas corruptas por Velrot",
      "Recuperación y reconstrucción de artefactos antiguos",
      "Viaje dimensional a través de portales misteriosos"
    ],
    "imagen": "proyecto6.png",
    "url": "https://github.com/ozkar-co/ashwake",
    "fecha": "2025-01-15T05:00:00.000Z"
  },
  "LUjsG4lANB3gyA48GTfg": {
    "id": "LUjsG4lANB3gyA48GTfg",
    "titulo": "Juegos Geográficos",
    "descripcion": "MarcoPolo es una aplicación web interactiva que ofrece juegos educativos sobre geografía mundial. Inspirada en el famoso explorador Marco Polo, la aplicación permite a los usuarios poner a prueba y mejorar sus conocimientos geográficos a través de dos modalidades de juego diferentes: adivinar países en un mapa interactivo y reconocer banderas de países. Diseñada como una Progressive Web App (PWA), MarcoPolo puede instalarse en dispositivos móviles y funcionar sin conexión a internet.",
    "tecnologias": [
      { "name": "React", "icon": "fa-brands fa-react" },
      { "name": "TypeScript", "icon": "fa-brands fa-js" },
      { "name": "Progresive Web App", "icon": "fa-solid fa-mobile-screen" },
      { "name": "FireStore", "icon": "fa-solid fa-database" },
      { "name": "ServiceWorkers", "icon": "fa-solid fa-gears" }
    ],
    "caracteristicas": [
      "Juego de adivinanza de países en un globo terráqueo 3D",
      "Juego de reconocimiento de banderas nacionales",
      "Sistema de puntuaciones con clasificación",
      "Diseño adaptable a todo tipo de dispositivos",
      "Funcionalidad sin conexión a internet",
      "Instalable como aplicación en dispositivos móviles"
    ],
    "imagen": "proyecto5.png",
    "url": "https://m-polo.web.app/",
    "fecha": "2025-02-26T05:00:00.460Z"
  },
  "oBZWTHk3gazBr6acjjbj": {
    "id": "oBZWTHk3gazBr6acjjbj",
    "titulo": "Forja de Código",
    "descripcion": "Sitio web corporativo de Forja de Código, empresa especializada en desarrollo de software y soluciones digitales personalizadas. La plataforma presenta servicios de desarrollo web, aplicaciones móviles, sistemas empresariales y consultoría tecnológica. Incluye portafolio de proyectos, testimonios de clientes y formulario de contacto integrado para facilitar la comunicación con potenciales clientes.",
    "tecnologias": [
      { "name": "React", "icon": "fa-brands fa-react" },
      { "name": "Firebase", "icon": "fa-solid fa-fire" },
      { "name": "PropTypes", "icon": "fa-solid fa-code" },
      { "name": "SEO", "icon": "fa-solid fa-search" },
      { "name": "Responsive Design", "icon": "fa-solid fa-mobile-screen" }
    ],
    "caracteristicas": [
      "Diseño moderno y profesional para empresa de tecnología",
      "Integración con Firebase para gestión de datos en tiempo real",
      "Diseño responsive optimizado para todos los dispositivos",
      "Formulario de contacto integrado para captación de leads",
      "SEO optimizado para mejorar visibilidad en motores de búsqueda",
      "Portafolio de proyectos y testimonios de clientes",
      "Sección de servicios detallada con casos de uso"
    ],
    "imagen": "proyecto4.png",
    "url": "https://forjadecodigo.com/",
    "fecha": "2025-02-24T05:00:00.720Z"
  },
  "LDvyVx88cnzmp1bZgtvO": {
    "id": "LDvyVx88cnzmp1bZgtvO",
    "titulo": "Finanzas Personales",
    "descripcion": "Aplicación web personal para gestión completa de finanzas personales con autenticación segura mediante Google Auth. Permite registrar ingresos y gastos con categorías dinámicas, generar gráficos y reportes detallados, y exportar datos a Excel. Los datos financieros están cifrados en MongoDB y se gestionan a través de una API REST personalizada para máxima seguridad. Incluye análisis históricos, tendencias de gastos y herramientas de visualización.",
    "tecnologias": [
      { "name": "React", "icon": "fa-brands fa-react" },
      { "name": "Google Auth", "icon": "fa-brands fa-google" },
      { "name": "MongoDB", "icon": "fa-solid fa-database" },
      { "name": "REST API", "icon": "fa-solid fa-server" },
      { "name": "Data Encryption", "icon": "fa-solid fa-lock" },
      { "name": "Charts", "icon": "fa-solid fa-chart-line" }
    ],
    "caracteristicas": [
      "Diseño web responsive y moderno",
      "Autenticación segura con Google Auth",
      "API REST personalizada para gestión de datos",
      "Datos cifrados en MongoDB para máxima seguridad",
      "Generación de gráficos y reportes detallados",
      "Exportación de datos a Excel",
      "Categorías creadas dinámicamente",
      "Análisis histórico y tendencias de gastos",
      "Herramientas de visualización financiera"
    ],
    "imagen": "proyecto1.jpg",
    "url": "https://oz-cuentas.web.app/about",
    "fecha": "2025-02-13T05:00:00.577Z"
  },
  "bwuUZZEcpubwsIYY6N6x": {
    "id": "bwuUZZEcpubwsIYY6N6x",
    "titulo": "Servidor Privado de Ragnarok Online",
    "descripcion": "Sitio web construido para un servidor privado de Ragnarok Online que ofrece una experiencia de juego renovada y balanceada. El servidor funciona en el episodio 14.3 con rates ajustados (5x/5x/10x) para una progresión fluida, sin presión competitiva y diseñado para jugar solo o en pequeños grupos. Incluye NPCs personalizados, misiones únicas y una economía autosuficiente que no depende del comercio masivo. El sitio web integra información del servidor con funcionalidades de búsqueda avanzada y datos reales del videojuego.",
    "tecnologias": [
      { "name": "React", "icon": "fa-brands fa-react" },
      { "name": "Firestore", "icon": "fa-solid fa-database" },
      { "name": "FullSearch", "icon": "fa-solid fa-magnifying-glass" },
      { "name": "Paypal", "icon": "fa-brands fa-paypal" },
      { "name": "Game Server", "icon": "fa-solid fa-server" }
    ],
    "caracteristicas": [
      "Diseño responsivo y moderno",
      "Sistema de búsquedas avanzadas",
      "Integración con datos reales del videojuego",
      "Servidor Renewal con mecánicas balanceadas",
      "Experiencia autosuficiente sin dependencia del mercado",
      "Rates ajustados para progresión fluida (5x/5x/10x)",
      "NPCs personalizados y misiones únicas"
    ],
    "imagen": "proyecto2.jpg",
    "url": "https://oz-ragnarok.web.app/",
    "fecha": "2025-01-23T05:00:00.332Z"
  }
}; 