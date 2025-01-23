import profileImage from '../../assets/profile.jpg'
import { useNavigate } from 'react-router-dom'
import './Hero.scss'

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section id="hero" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-title">
            <h1>INGENIERO Y CONJURADOR DE ALGORITMOS</h1>
          </div>
          <div className="hero-inner">
            <div className="hero-text">
              <p>
                Soy Oz, ingeniero de sistemas, explorador de ideas y soñador de mundos. Soy Director de Tecnología en Forja de Código, con más de una década de experiencia en desarrollo FullStack y tecnologías open-source,
                me apasiona construir sistemas eficientes, escalar arquitecturas y explorar la inteligencia artificial. Pero más allá del código, soy un viajero en busca de historias, un amante de la naturaleza y un entusiasta de la fantasía.
                Entre líneas de programación y caminos desconocidos, encuentro inspiración para crear, innovar y compartir mi conocimiento con quienes también buscan forjar su propio destino.
              </p>
              <button className="cta-button" onClick={() => navigate('/cv')}>
                Ver mi Curriculum Vitae
              </button>
            </div>
            <div className="hero-image">
              <img src={profileImage} alt="Perfil" className="profile-image" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 