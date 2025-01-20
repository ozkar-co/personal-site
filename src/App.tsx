import { useState } from 'react'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import './App.css'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleCVClick = () => {
    // Aquí puedes agregar la lógica para descargar o mostrar tu CV
    console.log('CV clicked')
  }

  return (
    <div className="app">
      <header className="header">
        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="#home">HOME</a>
          <a href="#cv">CV</a>
        </nav>
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      <main>
        <section id="hero" className="hero">
          <div className="hero-content">
            <h1>SOFTWARE<br />ENGINEER & TECH<br />GEEK</h1>
            <p>
              I'm a passionate system engineer with over a decade of experience in backend development, 
              Python, Node.js, and open-source technologies. I love building efficient systems, exploring
              AI, and sharing my knowledge through projects and writing.
            </p>
            <button className="cta-button" onClick={handleCVClick}>
              CHECK MY CV
            </button>
          </div>
        </section>

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

        <section id="social" className="social">
          <h2>CONNECT WITH ME<br />SOCIAL MEDIA</h2>
          <div className="social-links">
            <a href="https://github.com/oscoobs" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub size={32} />
            </a>
            <a href="https://linkedin.com/in/oscoobs" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin size={32} />
            </a>
            <a href="https://twitter.com/oscoobs" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter size={32} />
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Copyright © Oscoobs {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
