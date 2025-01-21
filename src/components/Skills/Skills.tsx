import './Skills.scss'

export const Skills = () => {
  return (
    <section id="skills" className="skills">
      <h2>WHAT I CAN OFFER<br />TO YOU</h2>
      <div className="skills-grid">
        <div className="skill-card">
          <h3>LANGUAGES</h3>
          <ul>
            <li>Python</li>
            <li>Node.js</li>
            <li>TypeScript</li>
            <li>Lua</li>
            <li>PHP</li>
          </ul>
        </div>
        <div className="skill-card">
          <h3>TECHNOLOGIES</h3>
          <ul>
            <li>Docker</li>
            <li>PostgreSQL</li>
            <li>MongoDB</li>
            <li>AWS</li>
            <li>Linux</li>
          </ul>
        </div>
        <div className="skill-card">
          <h3>OTHER EXPERTISE</h3>
          <ul>
            <li>Software Design</li>
            <li>API Development</li>
            <li>Agile & Scrum</li>
            <li>Open-Source Projects</li>
            <li>Technical Writing</li>
          </ul>
        </div>
      </div>
    </section>
  )
} 