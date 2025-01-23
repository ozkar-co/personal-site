import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './styles/main.scss'
import { Header } from './components/Header/Header'
import { Hero } from './components/Hero/Hero'
import { Skills } from './components/Skills/Skills'
import { Social } from './components/Social/Social'
import { Footer } from './components/Footer/Footer'
import { CV } from './components/CV/CV'

function App() {
  const handleCVClick = () => {
    // Aquí puedes agregar la lógica para descargar o mostrar tu CV
    console.log('CV clicked')
  }

  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/cv" element={<CV />} />
          <Route path="/" element={
            <main>
              <Hero onCVClick={handleCVClick} />
              <Skills />
              <Social />
            </main>
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
