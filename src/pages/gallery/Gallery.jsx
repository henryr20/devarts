import React from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import ArtGallery from '../../components/art-gallery/ArtGallery';
import './Gallery.css';

const Gallery = () => {
    return (
        <div className="page-container">
            <Header />
            <main className="gallery-main">
                <section className="gallery-header">
                    <h1>3D Art Gallery</h1>
                    <p>Explore the finest works from our community.</p>
                </section>
                <ArtGallery />
            </main>
            <Footer />
        </div>
    );
};

export default Gallery;
