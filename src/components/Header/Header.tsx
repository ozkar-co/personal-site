import { useState } from 'react'

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    onMenuToggle?.();
  }

  return (
    <header className="header">
      <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
        <a href="#home">HOME</a>
        <a href="#cv">CV</a>
      </nav>
      <button 
        className="menu-toggle"
        onClick={handleMenuToggle}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  )
} 