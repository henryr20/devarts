import React from 'react';
import './ArtGallery.css';
import Modal from '../modal/Modal';
import { artPieces } from '../../data/art-data';

const ArtGallery = () => {
    const [selectedArt, setSelectedArt] = React.useState(null);

    const openModal = (art) => {
        setSelectedArt(art);
    };

    const closeModal = () => {
        setSelectedArt(null);
    };

    return (
        <section className="gallery-container">
            <h2 className="section-title">Latest Masterpieces</h2>
            <div className="gallery-grid">
                {artPieces.map((art) => (
                    <div key={art.id} className="art-card" onClick={() => openModal(art)}>
                        <div className="art-image-container">
                            <img src={art.image} alt={art.title} className="art-image" />
                        </div>
                        <div className="art-info">
                            <h3 className="art-title">{art.title}</h3>
                            <p className="art-artist">by {art.artist}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={!!selectedArt} onClose={closeModal}>
                {selectedArt && (
                    <div className="art-modal-content">
                        <img src={selectedArt.image} alt={selectedArt.title} className="modal-image" />
                        <div className="modal-info">
                            <h2>{selectedArt.title}</h2>
                            <p className="modal-artist">by {selectedArt.artist}</p>
                            <p className="modal-description">{selectedArt.description}</p>
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    );
};

export default ArtGallery;
