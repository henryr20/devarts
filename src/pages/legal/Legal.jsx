import React, { useEffect } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import './Legal.css';

const Legal = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="legal-container">
            <Header />
            <main className="legal-content">
                <section className="legal-section">
                    <h1>Legal Notice & Policies</h1>
                    <p className="last-updated">Last updated: February 15, 2026</p>

                    <div className="legal-block">
                        <h2>1. Privacy Policy</h2>
                        <p>
                            At DevArts, we value your privacy. This policy describes how we collect, use, and
                            protect your personal data when you use our website. We do not share your personal
                            information with third parties, except when necessary to comply with the law or protect our rights.
                        </p>
                    </div>

                    <div className="legal-block">
                        <h2>2. Cookie Policy</h2>
                        <p>
                            Our website uses cookies to improve your browsing experience. Cookies are small
                            data files stored on your device. We use technical cookies necessary for the
                            site's operation and analytical cookies to understand how users interact with our content.
                        </p>
                    </div>

                    <div className="legal-block">
                        <h2>3. Terms of Sale</h2>
                        <p>
                            By making a purchase on DevArts, you agree to our terms and conditions. All
                            digital products (such as premium tips or art resources) are delivered electronically.
                            Due to the nature of digital products, sales are final, although we evaluate exceptional cases for technical support.
                        </p>
                    </div>

                    <div className="legal-block">
                        <h2>4. Contact</h2>
                        <p>
                            If you have any questions about these policies, you can contact us through our
                            contact page or by sending an email to support@devarts.com.
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Legal;
