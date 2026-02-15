import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faXTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faHexagonNodes } from '@fortawesome/free-solid-svg-icons'

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section">
                    <h3><FontAwesomeIcon icon={faHexagonNodes} className="logo-icon" />DevArts</h3>
                    <p>Where code meets creativity.</p>
                </div>
                <div className="footer-section">
                    <h4>Links</h4>
                    <ul className="footer-links">
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/gallery">Gallery</Link></li>
                        <li><Link to="/tips">Tips</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Connect</h4>
                    <div className="social-icons">
                        <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="social-icon"><FontAwesomeIcon icon={faXTwitter} />Twitter</a>
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="social-icon"><FontAwesomeIcon icon={faInstagram} />Instagram</a>
                        <a href="https://github.com/henryr20/devarts" target="_blank" rel="noopener noreferrer" className="social-icon"><FontAwesomeIcon icon={faGithub} />GitHub</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {currentYear} DevArts | All rights reserved.</p>
                <p>
                    <Link to="/legal">Privacy Policy & Cookies | Terms of Sale</Link>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
