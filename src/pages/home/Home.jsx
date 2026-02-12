import React, { useEffect, useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import FeaturedTip from '../../components/featured-tip/FeaturedTip';
import HomeGallery from '../../components/home-gallery/HomeGallery';
import { tipsData } from '../../data/tips-data';
import './Home.css';

const Home = () => {
    const [dailyTip, setDailyTip] = useState(null);

    useEffect(() => {
        // Scroll to top on mount
        window.scrollTo(0, 0);

        // Select a random tip
        const randomIndex = Math.floor(Math.random() * tipsData.length);
        setDailyTip(tipsData[randomIndex]);
    }, []);

    return (
        <div className="home-container">
            <Header />
            <main className="main-content">
                <section className="hero-section">
                    <div className="hero-content">
                        <h1 className="hero-title">Welcome to DevArts</h1>
                        <p className="hero-subtitle">
                            The definitive technical hub for 3D artists, technical directors, and creative developers.
                            Discover cutting-edge workflows, industry-standard tips, and a community dedicated to
                            bridging the gap between artistic vision and technical excellence in game development.
                        </p>
                    </div>
                </section>

                <HomeGallery />

                {dailyTip && (
                    <FeaturedTip
                        title={dailyTip.title}
                        content={dailyTip.content}
                        author={dailyTip.author}
                        level={dailyTip.level}
                    />
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Home;
