import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import './FeaturedWorkCard.css';

const FeaturedWorkCard = ({ art }) => {
    const [likes, setLikes] = useState(0);

    const handleLike = (e) => {
        e.stopPropagation();
        setLikes(prev => prev + 1);
    };

    return (
        <div className="home-art-card">
            <div className="home-art-image-wrapper">
                <img src={art.image} alt={art.title} className="home-art-image" />
            </div>
            <div className="home-art-info">
                <h3>{art.title}</h3>
                <div className="home-art-meta">
                    <p className="home-art-artist">Artist: {art.artist}</p>
                    <button className="like-button" onClick={handleLike} aria-label="Like">
                        <FontAwesomeIcon icon={faHeart} className="like-icon" />
                        <span className="like-count">{likes}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeaturedWorkCard;
