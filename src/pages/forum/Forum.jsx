import React, { useState, useEffect } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import './Forum.css';

const Forum = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulating fetching data from Firebase
        const fetchPosts = async () => {
            try {
                const response = await fetch('/firebase-mock-data.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setPosts(data);
                setFilteredPosts(data);

                // Extract unique categories
                // Get all categories, use Set for uniqueness, put "All" at the beginning
                const uniqueCatSet = new Set(data.map(post => post.category));
                const uniqueCategories = ['All', ...Array.from(uniqueCatSet)];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error("Error fetching forum data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
        window.scrollTo(0, 0);
    }, []);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category === 'All') {
            setFilteredPosts(posts);
        } else {
            const filtered = posts.filter(post => post.category === category);
            setFilteredPosts(filtered);
        }
    };

    return (
        <div className="forum-container">
            <Header />
            <main className="forum-main">
                <section className="forum-header-section">
                    <h1 className="forum-title">Community Forum</h1>
                    <p className="forum-subtitle">Discuss techniques, workflows, and share knowledge.</p>
                </section>

                <div className="forum-content">
                    <aside className="forum-sidebar">
                        <h3>Categories</h3>
                        <ul className="category-list">
                            {categories.map((category, index) => (
                                <li key={index}>
                                    <button
                                        className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                                        onClick={() => handleCategoryChange(category)}
                                    >
                                        {category}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    <section className="forum-posts-section">
                        {loading ? (
                            <div className="forum-loading">Loading discussions...</div>
                        ) : filteredPosts.length > 0 ? (
                            <div className="forum-posts-grid">
                                {filteredPosts.map(post => (
                                    <article key={post.id} className="forum-post-card">
                                        <div className="post-header">
                                            <span className="post-category">{post.category}</span>
                                            <span className="post-date">{post.date}</span>
                                        </div>
                                        <h2 className="post-title">{post.title}</h2>
                                        <p className="post-content-preview">{post.content}</p>
                                        <div className="post-footer">
                                            <span className="post-author">By {post.author}</span>
                                            <span className="post-replies">{post.replies} Replies</span>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="forum-empty">No discussions found in this category.</div>
                        )}
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Forum;
