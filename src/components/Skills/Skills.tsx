import './Skills.scss'

export const Skills = () => {
  return (
    <section id="skills" className="skills">
      <div className="skills-container">
        <div className="skills-title">
          <h2>MIS HABILIDADES</h2>
        </div>
        <div className="skills-content">
          <div className="skills-grid">
            <div className="skill-card">
              <h3>LENGUAJES</h3>
              <ul>
                <li>Python</li>
                <li>Node.js</li>
                <li>TypeScript</li>
                <li>Lua</li>
                <li>PHP</li>
              </ul>
            </div>
            <div className="skill-card">
              <h3>TECNOLOGÍAS</h3>
              <ul>
                <li>Docker</li>
                <li>PostgreSQL</li>
                <li>MongoDB</li>
                <li>AWS</li>
                <li>Linux</li>
              </ul>
            </div>
            <div className="skill-card">
              <h3>OTRAS EXPERTICIAS</h3>
              <ul>
                <li>Diseño de Software</li>
                <li>Desarrollo de APIs</li>
                <li>Agile & Scrum</li>
                <li>Proyectos Open-Source</li>
                <li>Documentación Técnica</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 