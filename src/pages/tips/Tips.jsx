import React, { useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Modal from '../../components/modal/Modal';
import { tipsData } from '../../data/tips-data';
import './Tips.css';

const Tips = () => {
    const [selectedTip, setSelectedTip] = useState(null);

    const getYouTubeThumbnail = (url) => {
        if (!url) return null;
        // Extracts video ID from embed or watch URL
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            return `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
        }
        return null;
    };

    const openModal = (tip) => {
        setSelectedTip(tip);
    };

    const closeModal = () => {
        setSelectedTip(null);
    };

    return (
        <div className="page-container">
            <Header />
            <main className="tips-main">
                <section className="tips-header">
                    <h1>Technical Art Tips</h1>
                    <p>Level up your workflow with these industry-standard practices.</p>
                </section>

                <div className="tips-grid">
                    {tipsData.map(tip => (
                        <article key={tip.id} className="tip-card" onClick={() => openModal(tip)}>
                            <div className="tip-image-container">
                                <img src={getYouTubeThumbnail(tip.videoUrl) || tip.image} alt={tip.title} className="tip-image" />
                                <div className="play-icon-overlay">▶</div>
                                <span className={`tip-level-badge ${tip.level.toLowerCase()}`}>{tip.level}</span>
                            </div>
                            <div className="tip-content">
                                <span className="tip-category">{tip.category}</span>
                                <h3>{tip.title}</h3>
                                <p>{tip.content}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </main>
            <Footer />

            <Modal isOpen={!!selectedTip} onClose={closeModal}>
                {selectedTip && (
                    <div className="tip-modal-content">
                        {selectedTip.videoUrl ? (
                            <div className="video-container">
                                <iframe
                                    width="100%"
                                    height="315"
                                    src={selectedTip.videoUrl}
                                    title={selectedTip.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            <img src={selectedTip.image} alt={selectedTip.title} className="modal-image" />
                        )}
                        <div className="modal-info">
                            <span className="tip-category">{selectedTip.category}</span>
                            <h2>{selectedTip.title}</h2>
                            <p className="tip-author-modal">By: {selectedTip.author}</p>
                            <p className="modal-description">{selectedTip.content}</p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Tips;
