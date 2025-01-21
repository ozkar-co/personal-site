import './styles/main.scss'
import { Header } from './components/Header/Header'
import { Hero } from './components/Hero/Hero'
import { Skills } from './components/Skills/Skills'
import { Social } from './components/Social/Social'

function App() {
  const handleCVClick = () => {
    // Aquí puedes agregar la lógica para descargar o mostrar tu CV
    console.log('CV clicked')
  }

  return (
    <div className="app">
      <Header />
      <main>
        <Hero onCVClick={handleCVClick} />
        <Skills />
        <Social />
      </main>
      <footer className="footer">
        <p>Copyright © OzCodx {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
