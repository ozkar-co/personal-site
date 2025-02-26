import { BlogEntryType } from '../types';

const helloWorld: BlogEntryType = {
  id: 'hello-world',
  title: '¡Hola Mundo!',
  date: '2025-02-07',
  abstract: `
    <p>
      Primer post de mi blog personal donde explico <b>qué contenido</b> encontrarás aquí. Este espacio está dedicado a compartir <b>experiencias técnicas</b>, <b>conocimientos</b>, <b>reflexiones personales</b> y <b>mi camino de aprendizaje</b> tanto técnico como humano. Cada entrada incluye un resumen generado por IA accesible mediante el botón TL;DR.
    </p>
  `,
  content: `
    <h2>Bienvenidos a mi Blog</h2>
    <p>
      ¡Hola a todos! Este es el primer post de mi blog personal donde compartiré mis experiencias,
      conocimientos y pensamientos sobre desarrollo de software, tecnología y otros temas interesantes.
    </p>
    <p>
      Como desarrollador, siempre he creído en la importancia de compartir conocimiento y experiencias
      con la comunidad. Este espacio servirá como una plataforma para hacer exactamente eso.
    </p>
    <p>
      Pero este blog va más allá de lo técnico. También compartiré reflexiones más profundas sobre la vida, 
      mis pasiones, miedos y aspiraciones. Creo firmemente que el desarrollo profesional y personal van de la mano, 
      y que nuestras experiencias como seres humanos enriquecen nuestra perspectiva como profesionales. 
      Este espacio será un reflejo de ese viaje integral.
    </p>
    <h3>¿Qué encontrarás aquí?</h3>
    <ul>
      <li>Ideas, planes y pensamientos</li>
      <li>Experiencias en proyectos</li>
      <li>Mejores prácticas de desarrollo</li>
      <li>Reflexiones sobre la industria tech</li>
      <li>Reflexiones personales y filosóficas</li>
      <li>Mi camino de crecimiento personal</li>
    </ul>
    <h3>Sobre el botón TL;DR</h3>
    <p>
      Cada entrada de este blog incluirá un botón "TL;DR" (Too Long; Didn't Read) junto al título. 
      Este botón, que ya forma parte de la historia de internet, te permitirá acceder a un resumen 
      generado por IA del contenido completo. Es perfecto para cuando quieras tener una idea rápida 
      de lo que trata un artículo antes de decidir si leerlo por completo.
    </p>
    <p>
      ¡Mantente atento para más contenido interesante!
    </p>
  `,
  tags: [
    'BlogPersonal',
    'Desarrollo',
    'Tecnología',
    'HolaMundo',
    'ExperienciasTech',
    'MejoresPrácticas',
    'IndustriaTech',
    'CompartirConocimiento',
    'ReflexionesPersonales',
    'CrecimientoPersonal'
  ]
};

export default helloWorld; 