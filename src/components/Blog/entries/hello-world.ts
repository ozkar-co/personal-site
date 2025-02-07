import { BlogEntryType } from '../types';

const helloWorld: BlogEntryType = {
  id: 'hello-world',
  title: '¡Hola Mundo!',
  date: '2024-03-19',
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
    <h3>¿Qué encontrarás aquí?</h3>
    <ul>
      <li>Ideas, planes y pensamientos</li>
      <li>Experiencias en proyectos</li>
      <li>Mejores prácticas de desarrollo</li>
      <li>Reflexiones sobre la industria tech</li>
    </ul>
    <p>
      ¡Mantente atento para más contenido interesante!
    </p>
  `,
  tags: ['bienvenida', 'blog', 'desarrollo', 'tecnología']
};

export default helloWorld; 