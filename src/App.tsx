import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import './styles/main.scss'
import { Header } from './components/Header/Header'
import { Hero } from './components/Hero/Hero'
import { Skills } from './components/Skills/Skills'
import { Social } from './components/Social/Social'
import { Footer } from './components/Footer/Footer'
import { CV } from './components/CV/CV'
import { MatrixBackground } from './components/MatrixBackground/MatrixBackground'
import { Blog } from './components/Blog/Blog'
import { Projects } from './components/Projects/Projects'
import { Wizz } from './components/Wizz/Wizz'
import { Time } from './components/Time/Time'
import { OzkarTime } from './components/OzkarTime/OzkarTime'
import { Admin } from './components/Admin/Admin'
import { Services } from './components/Services/Services'

// Componente para determinar el tipo de fondo según la ruta
const AppContent = () => {
  const location = useLocation();
  
  // Determinar el grupo de símbolos según la ruta
  const getSymbolGroup = () => {
    if (location.pathname === '/wizz') {
      return 'vikingRunes';
    }
    return 'binary'; // Por defecto para todas las demás rutas
  };

  return (
    <div className="app">
      <MatrixBackground symbolGroup={getSymbolGroup()} />
      <Header />
      <Routes>
        <Route path="/cv" element={<CV />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/wizz" element={<Wizz />} />
        <Route path="/time" element={<Time />} />
        <Route path="/ozkartime" element={<OzkarTime />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={
          <main>
            <Hero />
            <Skills />
            <Services />
            <Social />
          </main>
        } />
      </Routes>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
