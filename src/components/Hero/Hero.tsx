import introImage from '../../assets/intro.jpeg'
import { useNavigate } from 'react-router-dom'
import './Hero.scss'

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section id="hero" className="hero">
      <div className="hero-background">
        <img src={introImage} alt="Banner" loading="lazy" />
      </div>
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-title">
            <h1>SOFTWARE ENGINEER & TECH GEEK</h1>
          </div>
          <div className="hero-text">
            <p>
              I'm Oscar, a passionate system engineer with over a decade of experience in backend development, 
              Python, Node.js, and open-source technologies. I love building efficient systems, exploring
              AI, and sharing my knowledge through projects and writing.
            </p>
            <button className="cta-button" onClick={() => navigate('/cv')}>
              CHECK MY CV
            </button>
          </div>
        </div>
      </div>
    </section>
  )
} 