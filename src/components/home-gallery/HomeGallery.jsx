import React from 'react';
import { artPieces } from '../../data/art-data';
import './HomeGallery.css';

const HomeGallery = () => {
    const featuredArt = artPieces.slice(0, 3);

    return (
        <section className="home-gallery-section" id="featured-works">
            <div className="section-header">
                <h2 className="section-featured-title">Featured Works</h2>
                <p className="section-description">A glimpse into the top industry projects.</p>
            </div>
            <div className="home-gallery-grid">
                {featuredArt.map((art) => (
                    <div key={art.id} className="home-art-card">
                        <div className="home-art-image-wrapper">
                            <img src={art.image} alt={art.title} className="home-art-image" />
                        </div>
                        <div className="home-art-info">
                            <h3>{art.title}</h3>
                            <p className="home-art-artist">Artist: {art.artist}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="home-gallery-footer">
                <button
                    className="explore-button"
                    onClick={() => window.location.href = '/gallery'}
                >
                    Explore Gallery
                </button>
            </div>
        </section>
    );
};

export default HomeGallery;
