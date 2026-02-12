import React from 'react';
import './FeaturedTip.css';

const FeaturedTip = ({ title, content, author, level }) => {
    return (
        <section className="featured-tip-container">
            <div className="featured-tip-content">
                <span className="tip-badge">Daily Tip</span>
                <h2 className="tip-title">{title}</h2>
                <p className="tip-text">{content}</p>
                <div className="tip-meta">
                    <span className="tip-author">Tip by: {author}</span>
                    <span className={`tip-level ${level.toLowerCase()}`}>{level}</span>
                </div>
            </div>
        </section>
    );
};

export default FeaturedTip;
