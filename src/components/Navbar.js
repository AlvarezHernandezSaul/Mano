import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; 
import '../Styles/Navbar.css';
import Logo from '../images/manolingua_logo_w.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = useCallback((event) => {
    // Cerrar el menú si se hace clic fuera de él
    if (!event.target.closest('.navbar-menu') && menuOpen) {
      setMenuOpen(false);
    }
  }, [menuOpen]);

  useEffect(() => {
    document.addEventListener('click', closeMenu);
    return () => {
      document.removeEventListener('click', closeMenu);
    };
  }, [closeMenu]);

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <Link to="/"> {/* Link para redirigir al Inicio al hacer clic en el logo */}
          <img src={Logo} alt="Manolingua Logo" className="logo" />
        </Link>
      </div>
      <nav className="navbar-menu">
        <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link></li>
          <li><Link to="/Impacto" onClick={() => setMenuOpen(false)}>Impacto Social</Link></li>
          <li><Link to="/Recursos" onClick={() => setMenuOpen(false)}>Recursos de Aprendizaje</Link></li>
        </ul>
        <button className="menu-toggle" onClick={toggleMenu}>
          <span className={`menu-icon ${menuOpen ? 'open' : ''}`}></span>
        </button>
      </nav>
      {/* Menú móvil */}
      <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
        <ul>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link></li>
          <li><Link to="/Impacto" onClick={() => setMenuOpen(false)}>Impacto Social</Link></li>
          <li><Link to="/Recursos" onClick={() => setMenuOpen(false)}>Recursos de Aprendizaje</Link></li>
        </ul>
      </div>
      {/* Fondo semi-transparente */}
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>}
    </header>
  );
};

export default Navbar;
