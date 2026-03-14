import { faBars, faTimes, faHexagonNodes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="header-container">
            <div className="logo-container">
                <Link to="/" className="logo-link">
                    <FontAwesomeIcon icon={faHexagonNodes} className="logo-icon" />
                    <span className="logo-text">DevArts</span>
                </Link>
            </div>

            <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
                <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
            </button>

            <nav className={`nav-container ${isMenuOpen ? 'nav-open' : ''}`}>
                <ul className="nav-list">
                    <li className="nav-item">
                        <Link to="/home" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/news" className="nav-link" onClick={() => setIsMenuOpen(false)}>News</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/gallery" className="nav-link" onClick={() => setIsMenuOpen(false)}>Gallery</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/tips" className="nav-link" onClick={() => setIsMenuOpen(false)}>Tips</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
