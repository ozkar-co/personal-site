PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE entries (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  abstract TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  published_on TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE tags (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE entry_tags (
  entry_id INTEGER NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (entry_id, tag_id)
);
CREATE TABLE chunks (
  id INTEGER PRIMARY KEY,
  entry_id INTEGER NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  ordinal INTEGER NOT NULL,
  text TEXT NOT NULL,
  text_hash TEXT NOT NULL,
  vector BLOB,
  model TEXT,
  UNIQUE (entry_id, ordinal)
);
CREATE TABLE embed_jobs (
  id INTEGER PRIMARY KEY,
  entry_id INTEGER NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL
);
CREATE TABLE quotes (
  id INTEGER PRIMARY KEY,
  text TEXT NOT NULL
);
INSERT INTO quotes VALUES(1,'Aprendo de los errores de quienes siguen mis consejos.');
INSERT INTO quotes VALUES(2,'Tu secreto está a salvo conmigo, porque no estaba prestando atención.');
INSERT INTO quotes VALUES(3,'Buen argumento, sin embargo, no te estaba escuchando.');
INSERT INTO quotes VALUES(4,'Tengo suficiente aguante para tres minutos de conversación, luego empiezo a recibir daño físico.');
INSERT INTO quotes VALUES(5,'Tú lo llamas "antecedentes penales", yo lo llamo "la historia de mi aventura".');
INSERT INTO quotes VALUES(6,'Nunca daré más detalles, porque no tengo ni idea de lo que acabo de decir.');
INSERT INTO quotes VALUES(7,'Tengo derecho a guardar silencio, pero no la habilidad.');
INSERT INTO quotes VALUES(8,'No sufro de locura, disfruto cada minuto de ella.');
INSERT INTO quotes VALUES(9,'Ser inteligente nunca me ha impedido ser un completo idiota.');
INSERT INTO quotes VALUES(10,'Me fue revelado en forma de un pensamiento intrusivo.');
INSERT INTO quotes VALUES(11,'Todo lo que quiero hacer es imprudente, inmoral o directamente ilegal.');
INSERT INTO quotes VALUES(12,'No estoy discutiendo, estoy explicando por qué tengo razón y tú estás equivocado.');
INSERT INTO quotes VALUES(13,'Pronto desapareceré.');
INSERT INTO quotes VALUES(14,'Puede que me quede sin maná, pero no sin opciones.');
INSERT INTO quotes VALUES(15,'Piden mi sabiduría, pero no tengo ni idea de lo que estoy haciendo.');
INSERT INTO quotes VALUES(16,'Sí, estoy trabajando en mis errores; el próximo será enorme.');
INSERT INTO quotes VALUES(17,'Soy consciente de las consecuencias, pero no me importa.');
INSERT INTO quotes VALUES(18,'Esta es una mala situación, pero estoy aquí para empeorarla.');
INSERT INTO quotes VALUES(19,'El hecho de que aún no haya muerto es prueba sólida de que soy el personaje principal.');
INSERT INTO quotes VALUES(20,'Escuché lo que dijiste, simplemente elegí ignorarte.');
INSERT INTO quotes VALUES(21,'Vivir en el engaño es lo que me impulsa por la vida.');
INSERT INTO quotes VALUES(22,'Estoy a punto de hacer algo muy impulsivo, prepárense.');
INSERT INTO quotes VALUES(23,'Me piden soluciones y todo lo que tengo es una bola de fuego.');
INSERT INTO quotes VALUES(24,'Las cosas buenas llevan tiempo, por eso siempre llego tarde.');
INSERT INTO quotes VALUES(25,'Soy capaz de tomar buenas decisiones, pero soy mejor tomando las malas.');
INSERT INTO quotes VALUES(26,'Estoy construido de forma diferente, incorrectamente, creo.');
INSERT INTO quotes VALUES(27,'Aprendo mucho de mis errores, así que decidí cometer más para aprender más.');
INSERT INTO quotes VALUES(28,'No todas tus decisiones vitales tienen que ser inteligentes; algunas pueden ser puramente para valor cinematográfico.');
INSERT INTO quotes VALUES(29,'No me preguntes qué hice hoy, no lo sé.');
INSERT INTO quotes VALUES(30,'Claro que hablo solo, necesito una opinión experta.');
INSERT INTO quotes VALUES(31,'Todo lo que has oído sobre mí es mentira; en realidad, soy un millón de veces peor.');
INSERT INTO quotes VALUES(32,'Un día me callaré, pero no hoy.');
INSERT INTO quotes VALUES(33,'Disculpen por ser malvado y vil, volverá a suceder.');
INSERT INTO quotes VALUES(34,'Nunca sabrás mi próximo movimiento, ni yo tampoco.');
INSERT INTO quotes VALUES(35,'Ser estúpido nunca me ha impedido ser un genio absoluto.');
INSERT INTO quotes VALUES(36,'Voy a causar problemas a propósito.');
INSERT INTO quotes VALUES(37,'Sí, soy creativo; creo nuevos problemas todos los días.');
INSERT INTO quotes VALUES(38,'El riesgo que tomé fue calculado, pero... soy malo en matemáticas.');
INSERT INTO quotes VALUES(39,'Espero que les resulte tan gracioso como a mí mismo.');
INSERT INTO quotes VALUES(40,'No estoy oyendo voces, estoy escuchando mi sabiduría interior.');
INSERT INTO quotes VALUES(41,'No estoy aquí para hacer amigos; estoy aquí para hacer bolas de fuego y enemigos.');
INSERT INTO quotes VALUES(42,'Tú vives en una sociedad; yo vivo en la prisión de mi propia mente.');
INSERT INTO quotes VALUES(43,'Tu no estás exento de las consecuencias de mis acciones.');
INSERT INTO quotes VALUES(44,'Piensa dos veces; yo ni siquiera pensé una.');
INSERT INTO quotes VALUES(45,'Espero no ser solo caprichoso y extraño para ustedes, sino también vagamente amenazante.');
INSERT INTO quotes VALUES(46,'Tengo 99 problemas y yo los causé todos.');
INSERT INTO quotes VALUES(47,'Al menos, lo que sea que esté mal conmigo es realmente gracioso.');
INSERT INTO quotes VALUES(48,'En mi defensa, me dejaron sin supervisión.');
INSERT INTO quotes VALUES(49,'No anunciaré mi descenso a la locura, pero habrá señales.');
INSERT INTO quotes VALUES(50,'Quiero ser estúpidamente rico; ya soy estúpido, así que estoy a mitad de camino.');
INSERT INTO quotes VALUES(51,'No quiero una solución, solo quiero quejarme.');
INSERT INTO quotes VALUES(52,'Sigue mis consejos; yo no los voy a usar.');
INSERT INTO quotes VALUES(53,'Perdón por llegar tarde, no quería venir.');
INSERT INTO quotes VALUES(54,'Rechazo tu realidad y la sustituyo con la mía.');
INSERT INTO quotes VALUES(55,'A estas alturas no tengo excusa, simplemente soy un vago.');
INSERT INTO quotes VALUES(56,'Tienes un buen argumento, desafortunadamente mis hechizos son mejores que los tuyos.');
INSERT INTO quotes VALUES(57,'La terapia no es suficiente; necesito lanzar bolas de fuego a la gente mala.');
INSERT INTO quotes VALUES(58,'No hagas de tu falta de asombro mi problema.');
INSERT INTO quotes VALUES(59,'Mis únicos pensamientos son intrusivos.');
INSERT INTO quotes VALUES(60,'La realidad es una opinión, una con la que discrepo.');
INSERT INTO quotes VALUES(61,'Cuando la gente me odia sin razón, me gustaría darles algunas razones.');
INSERT INTO quotes VALUES(62,'No tengo cristales mágicos en mi inventario.');
INSERT INTO quotes VALUES(63,'Las maquinaciones internas de mi mente son un enigma, en especial para mi.');
INSERT INTO quotes VALUES(64,'Rechaza la conformidad, abraza la hechicería.');
INSERT INTO quotes VALUES(65,'Sí, confía en mi sabiduría, nunca me he equivocado en nada, nunca.');
INSERT INTO quotes VALUES(66,'¿Adónde vas? Me estoy volviendo loco.');
INSERT INTO quotes VALUES(67,'Soy estúpido y estoy orgulloso de ello.');
INSERT INTO quotes VALUES(68,'Puede que parezca que estoy escuchando, pero en mi cabeza estoy pensando en una nueva obsesión que me distrae de la realidad.');
INSERT INTO quotes VALUES(69,'Me estoy volviendo loco; ¡todos tiren iniciativa!');
INSERT INTO quotes VALUES(70,'Sí, fue mi culpa, y sí, lo haré de nuevo.');
INSERT INTO quotes VALUES(71,'El caos que creé apenas ha comenzado.');
INSERT INTO quotes VALUES(72,'No me importa cuán pequeña sea la habitación, dije: "bola de fuego!".');
INSERT INTO quotes VALUES(73,'Has estado viendo mi psique romperse en tiempo real.');
INSERT INTO quotes VALUES(74,'No estoy tratando de tener razón, solo estoy tratando de llevarte la contraria.');
INSERT INTO quotes VALUES(75,'Oh, parece que mi portal está aquí, ya no es mi problema.');
INSERT INTO quotes VALUES(76,'Espero no ser una persona, sino un concepto.');
INSERT INTO quotes VALUES(77,'Estoy aquí para esparcir alegría y buena voluntad.');
INSERT INTO quotes VALUES(78,'Mis enemigos y yo tenemos algo en común: ambos me odiamos.');
INSERT INTO quotes VALUES(79,'No voy a enfrentar mis problemas, solo me quedaré de pie y observaré mientras el mundo se desmorona.');
INSERT INTO quotes VALUES(80,'Ya no creo en la realidad objetiva.');
INSERT INTO quotes VALUES(81,'No necesito un descanso prolongado, necesito un largo descanso de la responsabilidad.');
INSERT INTO quotes VALUES(82,'No estoy perdido, solo estoy tomando la ruta escénica hacia la confusión total.');
INSERT INTO quotes VALUES(83,'Podría usar mis hechizos de forma responsable, ¿pero dónde está la diversión en eso?');
INSERT INTO quotes VALUES(84,'No confío en mí mismo con objetos mágicos, y tú tampoco deberías.');
INSERT INTO quotes VALUES(85,'Tengo muchos planes, todos igualmente terribles e igualmente emocionantes.');
INSERT INTO quotes VALUES(86,'Cuando el DM dice "¿Estás seguro?", ya es demasiado tarde.');
INSERT INTO quotes VALUES(87,'No perdí el control de la situación; simplemente se lo regalé al universo.');
INSERT INTO quotes VALUES(88,'La magia no es el problema aquí, lo soy yo.');
INSERT INTO quotes VALUES(89,'No soy responsable de las consecuencias de mi magia, solo de la vibra.');
INSERT INTO quotes VALUES(90,'No necesito un plan; tengo una confianza insana y una varita.');
INSERT INTO quotes VALUES(91,'El universo dijo "No lo hagas", y yo dije "Mírame".');
INSERT INTO quotes VALUES(92,'No necesito suerte; tengo un desprecio imprudente por los resultados.');
INSERT INTO quotes VALUES(93,'Mi magia no es ni buena ni mala, simplemente es muy inconveniente para todos los involucrados.');
INSERT INTO quotes VALUES(94,'Siempre eres la persona más inteligente de la habitación cuando estás solo.');
INSERT INTO quotes VALUES(95,'Eso suena a un problema para mi yo del futuro.');
INSERT INTO quotes VALUES(96,'No estoy sobrepensando demasiado, estoy prediciendo el futuro.');
INSERT INTO quotes VALUES(97,'Mi bola de cristal predijo que dirías eso; Pero no predijo que me importaría.');
INSERT INTO quotes VALUES(98,'La suerte es para los que no tienen un libro de hechizos peligrosos a mano.');
INSERT INTO quotes VALUES(99,'Dicen que la paciencia es una virtud. Claramente, no han visto mis conjuros de invocación.');
INSERT INTO quotes VALUES(100,'No tengo problemas de ira; tengo problemas de "intolerancia a la estupidez ajena".');
INSERT INTO quotes VALUES(101,'Si no entiendes mis decisiones, es porque tu mente no está lo suficientemente... desordenada.');
INSERT INTO quotes VALUES(102,'El secreto de mi poder es que nunca sé lo que va a pasar, y eso me mantiene alerta.');
INSERT INTO quotes VALUES(103,'Mi sentido común se fue de vacaciones hace siglos. Y no lo extraño.');
INSERT INTO quotes VALUES(104,'A veces, mi magia es tan impredecible como mi horario de sueño.');
INSERT INTO quotes VALUES(105,'No estoy evitando la responsabilidad, la estoy reubicando en una dimensión alternativa.');
INSERT INTO quotes VALUES(106,'¿Por qué conformarse con la realidad cuando puedo conjurar la mia propia?');
INSERT INTO quotes VALUES(107,'Dicen que hay que aprender de los errores. Yo prefiero inventar nuevos.');
INSERT INTO quotes VALUES(108,'No es arrogancia si realmente tienes la razón.');
INSERT INTO quotes VALUES(109,'La diplomacia es para los que no tienen "Toque Gélido" al alcance de la mano.');
INSERT INTO quotes VALUES(110,'No estoy sordo, simplemente mi cerebro tiene un filtro para las tonterías.');
INSERT INTO quotes VALUES(111,'El futuro es incierto, pero mi capacidad para meter la pata es una constante.');
INSERT INTO quotes VALUES(112,'No me subestimes. Mi cerebro tiene un plan, aunque yo no lo conozca del todo.');
INSERT INTO quotes VALUES(113,'No me he perdido, simplemente estoy cultivando el anhelo. Mi regreso será un evento digno de leyendas.');
INSERT INTO quotes VALUES(114,'La intriga es el condimento de la existencia. Por eso, de vez en cuando, desaparezco sin dejar rastro...');
INSERT INTO quotes VALUES(115,'Sé que me extrañan, pero me pierdo solo para aumentar la intriga.');
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  ordinal INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  image TEXT NOT NULL,
  technologies TEXT NOT NULL,
  features TEXT NOT NULL
);
INSERT INTO projects VALUES('FollowTracker_Social',0,'FollowTracker - Gestor de Redes Sociales','Aplicación minimalista con interfaz gráfica escrita en Python para llevar un registro personal de interacciones en redes sociales. Permite registrar a quién sigues, si te dieron follow back, o si dejaste de seguir a alguien. Ideal para creadores de contenido, community managers o usuarios interesados en gestionar de forma consciente sus conexiones. Incluye buscador avanzado, historial cronológico y estadísticas detalladas.','https://github.com/ozkar-co/followTracker','proyecto9.png','["Python", "Tkinter", "YAML", "GUI", "Data Tracking"]','["Interfaz gráfica minimalista y fácil de usar", "Registro de interacciones con botones intuitivos", "Buscador avanzado con filtros por estado", "Historial cronológico de eventos por cuenta", "Enlaces directos a perfiles de redes sociales", "Estadísticas detalladas de relaciones", "Almacenamiento local en formato YAML", "Ordenamiento por columnas (seguido, follow back, etc.)"]');
INSERT INTO projects VALUES('FabriCalc_3D_Printing',1,'FabriCalc - Calculadora de Costos 3D','FabriCalc es una herramienta de código abierto para calcular el costo real de una impresión 3D, considerando materiales, tiempo, electricidad, depreciación de máquina, envío y ganancia. Diseñada para makers, desarrolladores y emprendedores que desean estimar precios de forma técnica y ajustada a su realidad.','https://github.com/ozkar-co/fabricalc','proyecto8.png','["Python", "GUI", "JSON", "3D Printing", "Cost Analysis"]','["Cálculo detallado de costos: Material, tiempo, electricidad y depreciación", "Configuración editable desde archivo externo (config.json)", "Interfaz gráfica intuitiva en Python", "Soporte para múltiples tipos de materiales (PLA, PETG, etc.)", "Cálculo de costos de envío (local y nacional)", "Margen de ganancia configurable", "Estimación de tiempo de postprocesado", "Pensado para uso personal o en talleres"]');
INSERT INTO projects VALUES('EMM4aX9bN2cP5qR8tY1z',2,'Emma - Chatbot IA local','Emma es una interfaz de chat en Python diseñada para interactuar con Ollama, específicamente optimizada para el modelo gemma3:1b. Esta interfaz proporciona una manera eficiente de administrar interacciones con Ollama, contextos de conversación, memoria de chat, configuraciones personalizadas, personalidades para el asistente e historial de conversaciones. Incluye múltiples personalidades predefinidas y un sistema de memoria avanzado para conversaciones más coherentes.','https://github.com/ozkar-co/Emma','proyecto7.png','["Python", "Ollama", "AI/ML", "CLI", "YAML"]','["Interfaz de línea de comandos intuitiva y amigable", "Múltiples personalidades predefinidas (Técnica, Creativa, Concisa, etc.)", "Sistema de memoria a largo plazo con búsqueda contextual", "Gestión completa de conversaciones y historial", "Configuración flexible de parámetros del modelo", "Soporte para diferentes modelos de Ollama", "Comandos especiales integrados para gestión avanzada"]');
INSERT INTO projects VALUES('ASH7wK3mN9xP2qR5tY8z',3,'Ashwake','Ashwake es un juego de supervivencia RPG sandbox ambientado en las desoladas secuelas de una era olvidada. En un mundo donde Velrot, una corrupción desconocida e insidiosa, ha retorcido la tierra y la vida misma, despiertas solo como una Unidad Amnesis, un recipiente biomecánico sin memoria ni pasado. Sin guía, ciudades o otros seres conscientes, tu camino es tuyo. Explora, sobrevive y descubre la verdad enterrada bajo ruinas y tiempo.','https://github.com/ozkar-co/ashwake','proyecto6.png','["Lua", "Luanti Engine", "Voxel", "Game Development"]','["Supervivencia impulsada por exploración en mundo abierto", "Sistema de progresión alquímica complejo", "Entidades elementales nocturnas corruptas por Velrot", "Recuperación y reconstrucción de artefactos antiguos", "Viaje dimensional a través de portales misteriosos"]');
INSERT INTO projects VALUES('LUjsG4lANB3gyA48GTfg',4,'Juegos Geográficos','MarcoPolo es una aplicación web interactiva que ofrece juegos educativos sobre geografía mundial. Inspirada en el famoso explorador Marco Polo, la aplicación permite a los usuarios poner a prueba y mejorar sus conocimientos geográficos a través de dos modalidades de juego diferentes: adivinar países en un mapa interactivo y reconocer banderas de países. Diseñada como una Progressive Web App (PWA), MarcoPolo puede instalarse en dispositivos móviles y funcionar sin conexión a internet.','https://m-polo.web.app/','proyecto5.png','["React", "TypeScript", "Progresive Web App", "FireStore", "ServiceWorkers"]','["Juego de adivinanza de países en un globo terráqueo 3D", "Juego de reconocimiento de banderas nacionales", "Sistema de puntuaciones con clasificación", "Diseño adaptable a todo tipo de dispositivos", "Funcionalidad sin conexión a internet", "Instalable como aplicación en dispositivos móviles"]');
INSERT INTO projects VALUES('oBZWTHk3gazBr6acjjbj',5,'Forja de Código','Sitio web corporativo de Forja de Código, empresa especializada en desarrollo de software y soluciones digitales personalizadas. La plataforma presenta servicios de desarrollo web, aplicaciones móviles, sistemas empresariales y consultoría tecnológica. Incluye portafolio de proyectos, testimonios de clientes y formulario de contacto integrado para facilitar la comunicación con potenciales clientes.','https://forjadecodigo.com/','proyecto4.png','["React", "Firebase", "PropTypes", "SEO", "Responsive Design"]','["Diseño moderno y profesional para empresa de tecnología", "Integración con Firebase para gestión de datos en tiempo real", "Diseño responsive optimizado para todos los dispositivos", "Formulario de contacto integrado para captación de leads", "SEO optimizado para mejorar visibilidad en motores de búsqueda", "Portafolio de proyectos y testimonios de clientes", "Sección de servicios detallada con casos de uso"]');
INSERT INTO projects VALUES('LDvyVx88cnzmp1bZgtvO',6,'Finanzas Personales','Aplicación web personal para gestión completa de finanzas personales con autenticación segura mediante Google Auth. Permite registrar ingresos y gastos con categorías dinámicas, generar gráficos y reportes detallados, y exportar datos a Excel. Los datos financieros están cifrados en MongoDB y se gestionan a través de una API REST personalizada para máxima seguridad. Incluye análisis históricos, tendencias de gastos y herramientas de visualización.','https://oz-cuentas.web.app/about','proyecto1.jpg','["React", "Google Auth", "MongoDB", "REST API", "Data Encryption", "Charts"]','["Diseño web responsive y moderno", "Autenticación segura con Google Auth", "API REST personalizada para gestión de datos", "Datos cifrados en MongoDB para máxima seguridad", "Generación de gráficos y reportes detallados", "Exportación de datos a Excel", "Categorías creadas dinámicamente", "Análisis histórico y tendencias de gastos", "Herramientas de visualización financiera"]');
INSERT INTO projects VALUES('bwuUZZEcpubwsIYY6N6x',7,'Servidor Privado de Ragnarok Online','Sitio web construido para un servidor privado de Ragnarok Online que ofrece una experiencia de juego renovada y balanceada. El servidor funciona en el episodio 14.3 con rates ajustados (5x/5x/10x) para una progresión fluida, sin presión competitiva y diseñado para jugar solo o en pequeños grupos. Incluye NPCs personalizados, misiones únicas y una economía autosuficiente que no depende del comercio masivo. El sitio web integra información del servidor con funcionalidades de búsqueda avanzada y datos reales del videojuego.','https://oz-ragnarok.web.app/','proyecto2.jpg','["React", "Firestore", "FullSearch", "Paypal", "Game Server"]','["Diseño responsivo y moderno", "Sistema de búsquedas avanzadas", "Integración con datos reales del videojuego", "Servidor Renewal con mecánicas balanceadas", "Experiencia autosuficiente sin dependencia del mercado", "Rates ajustados para progresión fluida (5x/5x/10x)", "NPCs personalizados y misiones únicas"]');
CREATE TABLE cv_blocks (
  id INTEGER PRIMARY KEY,
  kind TEXT NOT NULL,
  ordinal INTEGER NOT NULL,
  title TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  organization TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  period TEXT NOT NULL DEFAULT '',
  items TEXT NOT NULL DEFAULT '[]'
);
INSERT INTO cv_blocks VALUES(1,'about',0,'Desarrollador Senior','💻','Más de 8 años diseñando e implementando soluciones de software escalables, con enfoque en backend, arquitectura, rendimiento y tecnología en la nube. Me apasiona crear sistemas eficientes y robustos, resolver problemas complejos y mantenerme actualizado en nuevas herramientas, especialmente en inteligencia artificial aplicada.','','','','["Arquitectura de software escalable", "Desarrollo FullStack con tecnologías modernas", "Optimización de rendimiento y seguridad", "Integración de APIs y microservicios", "Desarrollo de soluciones cloud-native"]');
INSERT INTO cv_blocks VALUES(2,'about',1,'CTO & Líder Técnico','🚀','Co-fundador y CTO de Forja de Código, donde lidero la visión tecnológica de la startup. Trazamos estrategias escalables, priorizamos calidad y buenas prácticas, e impulsamos la innovación constante. Coordino equipos multidisciplinarios y acompaño técnicamente en proyectos clave.','','','','["Liderazgo de equipos técnicos", "Estrategia tecnológica y arquitectura", "Gestión de proyectos y recursos", "Innovación y adopción de nuevas tecnologías", "Toma de decisiones técnicas estratégicas"]');
INSERT INTO cv_blocks VALUES(3,'about',2,'Docente & Mentor','🎓','He compartido conocimiento desde mis años como estudiante, dictando talleres, conferencias y mentorías. Tengo experiencia formando desarrolladores, liderando grupos académicos, y creando contenido técnico. Actualmente complemento mi carrera docente con estudios formales en educación universitaria, incluyendo un diplomado en docencia para la educación superior.','','','','["Mentoring y formación de desarrolladores", "Desarrollo de contenido educativo", "Capacitación técnica en empresas", "Conferencias científicas y divulgación", "Organización de talleres y actividades de formación"]');
INSERT INTO cv_blocks VALUES(4,'skill',0,'Desarrollo Backend','','','','','','[{"name": "Node.js", "experience": "5 años"}, {"name": "Laravel", "experience": "3 años"}, {"name": "Python", "experience": "1 año"}, {"name": "Go", "experience": "1 año"}, {"name": "PHP", "experience": "3 años"}]');
INSERT INTO cv_blocks VALUES(5,'skill',1,'Desarrollo Frontend','','','','','','[{"name": "JavaScript", "experience": "6 años"}, {"name": "TypeScript", "experience": "2 años"}, {"name": "React", "experience": "1 año"}, {"name": "HTML/CSS", "experience": "8 años"}, {"name": "Sass/SCSS", "experience": "3 años"}]');
INSERT INTO cv_blocks VALUES(6,'skill',2,'Bases de Datos','','','','','','[{"name": "MongoDB", "experience": "5 años"}, {"name": "PostgreSQL", "experience": "3 años"}, {"name": "MySQL", "experience": "1 año"}, {"name": "Snowflake", "experience": "6 años"}, {"name": "Redis", "experience": "2 años"}]');
INSERT INTO cv_blocks VALUES(7,'skill',3,'DevOps','','','','','','[{"name": "Linux", "experience": "10 años"}, {"name": "Google Cloud", "experience": "5 años"}, {"name": "Docker", "experience": "4 años"}, {"name": "AWS", "experience": "3 años"}, {"name": "Firebase", "experience": "2 años"}]');
INSERT INTO cv_blocks VALUES(8,'skill',4,'Habilidades Pedagógicas','','','','','','[{"name": "Diseño de experiencias educativas", "experience": "3 años"}, {"name": "Aprendizaje activo", "experience": "5 años"}, {"name": "Mentoría y facilitación", "experience": "2 años"}, {"name": "Comunicación efectiva", "experience": "8 años"}, {"name": "Capacitación técnica", "experience": "2 años"}]');
INSERT INTO cv_blocks VALUES(9,'skill',5,'Habilidades Blandas','','','','','','[{"name": "Liderazgo y coordinación", "experience": "3 años"}, {"name": "Escucha activa", "experience": "8 años"}, {"name": "Pensamiento analítico", "experience": "10 años"}, {"name": "Adaptabilidad intercultural", "experience": "5 años"}, {"name": "Resolución de conflictos", "experience": "6 años"}]');
INSERT INTO cv_blocks VALUES(10,'experience',0,'Co-Founder & CTO','','','Forja de Código','Pereira, Colombia','Ene 2025 - Presente','["Tomar decisiones sobre arquitectura, tecnologías, escalabilidad e innovación tecnológica de la startup", "Liderar y gestionar el equipo técnico, asegurando la calidad del código y la eficiencia del desarrollo", "Contribuir directamente en el desarrollo de código crítico o en momentos de alta demanda"]');
INSERT INTO cv_blocks VALUES(11,'experience',1,'Desarrollador Backend','','','BTi Lab','Remoto, Colombia','Feb 2023 – Ago 2023','["Desarrollo de funcionalidades y sistemas de análisis de datos utilizando Python, Node.js, MongoDB y AWS", "Contribución en un producto de IA para optimizar publicaciones en redes sociales", "Expansión de experiencia técnica en la transición de Node.js a Python"]');
INSERT INTO cv_blocks VALUES(12,'experience',2,'Desarrollador Backend','','','DevSavant','Remoto, Colombia','Feb 2022 – Ene 2023','["Desarrollo de una herramienta de comunicación de usuarios, integrando múltiples proveedores de servicios", "Rediseño y mejora de un sistema de gestión de entregas, mejorando la escalabilidad", "Uso de Go, JavaScript, Node.js, Python, PHP y arquitectura de microservicios para soluciones robustas"]');
INSERT INTO cv_blocks VALUES(13,'experience',3,'Desarrollador Backend','','','Seven4N','Remoto, Colombia','Ago 2019 – Dic 2021','["Implementación de Snowflake y Kafka para manejar el crecimiento exponencial de la plataforma, reduciendo los tiempos de procesamiento de datos en un 30%.", "Integración de Locust en nuestro flujo de trabajo, incrementando la cobertura de pruebas de un 48% a un 85%, permitiendonos prevenir fallas críticas.", "Liderazgo en la automatización de procesos del equipo mediante la implementación de un bot de Slack para monitorear el estado de las tareas, mejorando la eficiencia operativa en un 25%."]');
INSERT INTO cv_blocks VALUES(14,'experience',4,'Ingeniero de Software','','','Münchner Verkehrsgesellschaft mbH','Múnich, Alemania','May 2019 – Jul 2019','["Construcción de un sistema de reporte de retrasos de trenes utilizando Google Cloud y Firebase", "Implementación de características de gamificación para mejorar la interacción del usuario", "Configuración de contenedores Docker para el despliegue de proyectos"]');
INSERT INTO cv_blocks VALUES(15,'experience',5,'Analista Desarrollador','','','Konecta Software Factory','Medellín, Colombia','Sep 2018 – Abr 2019','["Refactorización de código legacy y resolución de problemas en proyectos con PHP, SQL y JavaScript", "Gestión de una migración de base de datos para un cliente, asegurando la integridad y seguridad de los datos con una efectividad del 99%", "Creación y supervisión de pruebas técnicas para nuevos analistas, asi como la capacitación de los mismos"]');
INSERT INTO cv_blocks VALUES(16,'experience',6,'Desarrollador Backend','','','Tecnología Digital 7','Pereira, Colombia','Ene 2018 – Ago 2019','["Desarrollo de un sistema web para el seguimiento del rendimiento de desarrolladores", "Diseño de interfaces para un sistema de Blockchain orientado a objetos", "Creación de una billetera de Bitcoin utilizando Node.js"]');
INSERT INTO cv_blocks VALUES(17,'experience',7,'Asistente de Desarrollo de Software','','','Universidad Tecnológica de Pereira','Pereira, Colombia','Feb 2015 – Dic 2017','["Mantenimiento y actualización de sitios web universitarios con PHP y Laravel", "Diseño de un sistema de georreferenciación con PHP Laravel para planificar rutas accesibles en el campus", "Desarrollo de un motor de búsqueda para reglamentos estudiantiles y creación de una base de datos de referencias bibliográficas"]');
INSERT INTO cv_blocks VALUES(18,'experience',8,'Guía Educativo y Divulgador Científico','','','Jardín Botánico - Universidad Tecnológica de Pereira','Pereira, Colombia','Feb 2013 – Dic 2014','["Desarrollo de capacidades pedagógicas mediante la orientación de grupos diversos a través del jardín botánico", "Adaptación del contenido educativo según el perfil del grupo (estudiantes, turistas, investigadores)", "Investigación continua y actualización de conocimientos sobre flora, fauna y curiosidades científicas", "Fortalecimiento de habilidades de comunicación efectiva, manejo de grupos y transmisión de conocimiento", "Experiencia pionera en divulgación científica que sentó las bases de mi vocación docente"]');
INSERT INTO cv_blocks VALUES(19,'education',0,'Diplomado en Docencia Universitaria','','','Pontificia Universidad Javeriana','Colombia (Virtual)','Mayo 2025 – Julio 2025','["Mejoré mi perfil en el ámbito de la enseñanza y el aprendizaje en educación superior mediante un enfoque pedagógico sólido", "Aumenté el interés, la motivación y el desempeño de estudiantes en cursos universitarios", "Desarrollé pensamiento analítico e innovador aplicado a contextos educativos", "Diseñé experiencias de aprendizaje significativas y adaptadas al contexto actual", "Fortalecí habilidades de enseñanza con estrategias de aprendizaje activo", "Impulsé mi liderazgo e influencia social desde la docencia"]');
INSERT INTO cv_blocks VALUES(20,'education',1,'Beca en Ingeniería de Software','','','Digital Product School (DPS) by UnternehmerTUM','Múnich, Alemania','May 2019 - Jul 2019','["Programa intensivo de tres meses enfocado en el desarrollo de productos digitales en un entorno multidisciplinario", "Aplicación de metodologías ágiles como Scrum y Design Thinking", "Aplicación de la metodología Lean para la validación rápida de ideas y desarrollo de productos con enfoque en la eficiencia"]');
INSERT INTO cv_blocks VALUES(21,'education',2,'Internet History, Technology, and Security','','','University of Michigan','Estados Unidos (Virtual)','Julio 2020','["Comprensión profunda de las cuestiones tecnológicas importantes que enfrenta la sociedad actual", "Desarrollo de habilidades en TCP/IP, protocolos de red, arquitectura de red y redes informáticas", "Conocimientos avanzados en seguridad de red, cifrado y aplicaciones web", "Comprensión de cómo Internet y la web son espacios para la innovación tecnológica", "Fortalecimiento de competencias en servidores web y desarrollo de aplicaciones web"]');
INSERT INTO cv_blocks VALUES(22,'education',3,'Ingeniería de Sistemas y Computación','','','Universidad Tecnológica de Pereira','Pereira, Colombia','Agosto 2018','["Ciclo completo del desarrollo de software, análisis, diseño, desarrollo, despliegue y mantenimiento", "Liderazgo de equipos multidisciplinarios para crear soluciones tecnológicas adaptadas a organizaciones", "Diseño de modelos inteligentes para optimizar procesos y mejorar la eficiencia", "Investigación en tecnologías y compromiso con el aprendizaje continuo"]');
INSERT INTO cv_blocks VALUES(23,'education',4,'Curso CCNA Discovery','','','Cisco Networking Academy','Pereira, Colombia','2008 – 2009','["Curso completo de redes con una duración de 400 horas", "Fundamentos de redes, direccionamiento IP, protocolos y topologías"]');
INSERT INTO cv_blocks VALUES(24,'extra',0,'Voluntariado','','','Domus Galilea Monastery','HaGalil, Israel','Sep 2023 – Sep 2024','["Mejora de habilidades de comunicación e interculturales sirviendo a peregrinos de todo el mundo.", "Desarrollo de habilidades técnicas en mantenimiento de computadoras, carpintería y servicio de atención.", "Adaptabilidad, perseverancia y resolución de problemas a través de diversas tareas y experiencias de voluntariado."]');
INSERT INTO cv_blocks VALUES(25,'extra',1,'Profesor voluntario de español','','','Digital Product School - UnternehmerTUM','Múnich, Alemania','Jun 2019','["Creé e impartí un curso básico de español como iniciativa espontánea surgida del interés de compañeros internacionales", "La experiencia nació en un contexto de intercambio cultural, donde identifiqué la oportunidad de compartir mi lengua nativa", "Diseñé clases dinámicas en inglés, superando la barrera del idioma mediante estrategias de comunicación intuitiva", "Fomenté la curiosidad y motivación de los estudiantes, quienes solicitaron continuar el curso de forma entusiasta", "Esta experiencia fortaleció mis habilidades pedagógicas y demostró mi iniciativa y vocación docente, incluso fuera de mi campo técnico"]');
INSERT INTO cv_blocks VALUES(26,'extra',2,'Dungeon Master (Director de juego)','','','Diversas comunidades de juegos de rol','Presencial, Colombia, Israel','2016 – Actualidad','["Diseño y dirección de campañas de rol narrativo en mundos de fantasía e historia alternativa", "Desarrollo de habilidades blandas como liderazgo, escucha activa, comunicación asertiva y resolución de conflictos", "Fomento del trabajo en equipo, la empatía y la toma de decisiones colaborativas", "Adaptación de estilos de dirección según los jugadores, gestionando dinámicas grupales diversas", "Uso del juego como herramienta pedagógica y de motivación, lo cual ha enriquecido mi enfoque como docente"]');
INSERT INTO cv_blocks VALUES(27,'extra',3,'Contribuidor Open-Source','','','Exile (Videojuego Open-Source)','Remoto, Colombia','Sep 2021, Jun 2022','["Contribución al desarrollo de Exile, un juego de supervivencia en la naturaleza construido en el motor Minetest", "Adición de nuevos objetos y mecánicas para mejorar la experiencia de juego", "Asistencia con la traducción al español, expandiendo la accesibilidad del juego a un público más amplio", "Mejora de la documentación del juego, asegurando instrucciones más claras y una mejor usabilidad general"]');
INSERT INTO cv_blocks VALUES(28,'extra',4,'Conferencista','','','Banco de la República - Grupo de Investigación ALFA ORIÓN','Pereira, Colombia','Nov 2014','["Conferencia: ''Astronomía, un largo camino que comenzó con una mirada al cielo''", "Ciclo de charlas ''Descubriendo el universo'', organizado por el Banco de la República y el grupo ALFA ORIÓN", "Duración: 2 horas. Público general e instituciones educativas"]');
INSERT INTO cv_blocks VALUES(29,'extra',5,'Coordinador de Grupo de Astronomía','','','Universidad Tecnológica de Pereira - Grupo ORIÓN','Pereira, Colombia','Feb 2012 – Sep 2015','["Organización y orientación de reuniones, charlas y eventos de divulgación científica", "Gestión de salidas de campo y visitas educativas a colegios y museos", "Desarrollo de contenido y actividades de astronomía para diferentes públicos"]');
COMMIT;
