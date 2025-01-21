import introImage from '../../assets/intro.png'
import './Hero.scss'

interface HeroProps {
  onCVClick: () => void;
}

export const Hero = ({ onCVClick }: HeroProps) => {
  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <img src={introImage} alt="Profile" className="profile-image" />
        <h1>SOFTWARE<br />ENGINEER & TECH<br />GEEK</h1>
        <p>
          I'm a passionate system engineer with over a decade of experience in backend development, 
          Python, Node.js, and open-source technologies. I love building efficient systems, exploring
          AI, and sharing my knowledge through projects and writing.
        </p>
        <button className="cta-button" onClick={onCVClick}>
          CHECK MY CV
        </button>
      </div>
    </section>
  )
} 