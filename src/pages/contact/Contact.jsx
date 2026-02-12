import React, { useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import LocationMap from '../../components/location-map/LocationMap';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setIsSubmitted(true);
            setFormData({
                name: '',
                email: '',
                subject: 'General Inquiry',
                message: ''
            });
            // Reset success message after 5 seconds
            setTimeout(() => setIsSubmitted(false), 5000);
        }, 1000);
    };

    return (
        <div className="page-container">
            <Header />
            <main className="contact-main">
                <section className="contact-header">
                    <h1>Get in Touch</h1>
                    <p>We'd love to hear from you. Drop us a line.</p>
                </section>

                <div className="contact-layout">
                    <section className="contact-form-section">
                        <h2>Send us a Message</h2>
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                >
                                    <option value="General Inquiry">General Inquiry</option>
                                    <option value="Collaboration">Collaboration</option>
                                    <option value="Support">Support</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            {isSubmitted ? (
                                <div className="success-message">
                                    Message sent successfully! We'll be in touch soon.
                                </div>
                            ) : (
                                <button type="submit" className="submit-button">Send Message</button>
                            )}
                        </form>
                    </section>

                    <section className="contact-map-section">
                        <h2>Find Us</h2>
                        <LocationMap />
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;
