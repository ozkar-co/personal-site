import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'

export const Social = () => {
  return (
    <section id="social" className="social">
      <h2>CONNECT WITH ME<br />SOCIAL MEDIA</h2>
      <div className="social-links">
        <a href="https://github.com/ozcodx" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FaGithub size={32} />
        </a>
        <a href="https://linkedin.com/in/ozcodx" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FaLinkedin size={32} />
        </a>
        <a href="https://twitter.com/ozcodx" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
          <FaTwitter size={32} />
        </a>
      </div>
    </section>
  )
} 