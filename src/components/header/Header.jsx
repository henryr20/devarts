import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHexagonNodes } from '@fortawesome/free-solid-svg-icons'

const Header = () => {
    return (
        <header className="header-container">
            <div className="logo-container">
                <Link to="/" className="logo-link">
                    <FontAwesomeIcon icon={faHexagonNodes} className="logo-icon" />
                    <span className="logo-text">DevArts</span>
                </Link>
            </div>
            <nav className="nav-container">
                <ul className="nav-list">
                    <li className="nav-item">
                        <Link to="/home" className="nav-link">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/gallery" className="nav-link">Gallery</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/tips" className="nav-link">Tips</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/contact" className="nav-link">Contact</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
