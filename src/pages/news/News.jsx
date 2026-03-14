import React from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import './News.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRss } from '@fortawesome/free-solid-svg-icons';
import { useParams, Link } from 'react-router-dom';

const newsItems = [
    {
        id: '4',
        title: 'Platform Update: Enhanced Node Interface',
        date: 'March 14, 2026',
        content: 'Our latest platform update introduces a significantly improved node-based interface for technical workflows. The new system offers better performance and more intuitive connections for complex project management.',
        image: '/news-platform-update.png'
    },
    {
        id: '3',
        title: 'Mastering AI-Driven Workflows',
        date: 'March 12, 2026',
        content: 'Discover how artificial intelligence is transforming the technical art landscape. This guide explores integration techniques for machine learning models within standard 3D asset pipelines, maximizing efficiency without sacrificing creative control.',
        image: '/news-ai-workflow.png'
    },
    {
        id: '2',
        title: 'Community Forum CRUD Features',
        date: 'March 4, 2026',
        content: 'Users can now create, edit, and delete their own posts directly within the community forum. This allows for a more interactive and dynamic community experience, deeply integrated with Firebase Firestore in real-time.',
    },
    {
        id: '1',
        title: 'Welcome to the New DevArts Platform!',
        date: 'March 2, 2026',
        content: 'We have officially launched the new platform featuring a community forum, an art gallery, and coding tips.',
    }
];

const NewsItemDetail = ({ id }) => {
    const item = newsItems.find(n => n.id === id);
    if (!item) return <div className="news-content"><p>News item not found.</p></div>;

    return (
        <div className="news-content news-detail">
            {item.image && <img src={item.image} alt={item.title} className="news-detail-image" />}
            <h2>{item.title}</h2>
            <span className="news-date">{item.date}</span>
            <p>{item.content}</p>
            <Link to="/news" className="back-link">← Back to all news</Link>
        </div>
    );
};

const NewsList = () => {
    return (
        <div className="news-content">
            <div className="news-grid">
                {newsItems.map(item => (
                    <div key={item.id} className="news-card">
                        {item.image && <img src={item.image} alt={item.title} className="news-card-thumbnail" />}
                        <h3>{item.title}</h3>
                        <span className="news-date">{item.date}</span>
                        <p>{item.content.substring(0, 80)}...</p>
                        <Link to={`/news/${item.id}`} className="read-more">Read More</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function News() {
    const { id } = useParams();

    return (
        <div className="news-page">
            <Header />
            <main className="news-main">
                <div className="news-header">
                    <h1>News & Updates</h1>
                    <a href="https://devarts-d89d6.web.app/rss.xml" target="_blank" rel="noopener noreferrer" className="rss-link">
                        <FontAwesomeIcon icon={faRss} /> RSS Feed
                    </a>
                </div>

                {id ? <NewsItemDetail id={id} /> : <NewsList />}
            </main>
            <Footer />
        </div>
    );
}
