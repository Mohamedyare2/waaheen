import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Download, Smartphone, ShoppingBag, ShieldCheck, Zap,
    CheckCircle2, Star, Store, QrCode,
    Menu, X, Sparkles, Shirt, Monitor, Sofa, Activity, Contact
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const categories = [
        { name: 'Dharka Ragga (Men)', icon: <Shirt size={22} />, desc: 'Shaadhadh, Suudh, Saraawiil & Funaanado' },
        { name: 'Dharka Dumarka (Women)', icon: <Contact size={22} />, desc: 'Diracyo, Xijaabyo, Boorsooyin & Qurxin' },
        { name: 'Elektaroonig (Electronics)', icon: <Monitor size={22} />, desc: 'Mobiles, Laptops, Chargers & Earpods' },
        { name: 'Alaabta Guriga (Home)', icon: <Sofa size={22} />, desc: 'Kuraas, Sariiro, Daahyo & Maacuun' },
        { name: 'Qurxinta & Cosmetics', icon: <Sparkles size={22} />, desc: 'Cadarrada, Kareemada & Qalabka Qurxinta' },
        { name: 'Cayaaraha & Jimicsiga (Sports)', icon: <Activity size={22} />, desc: 'Kabo orod, Funaanadaha kooxaha & Agab' },
    ];

    const features = [
        {
            icon: <Zap size={24} color="#F4A61D" />,
            title: 'Gaadhsiin Degdeg Ah',
            desc: 'Dalabkaagu wuxuu kugu soo gaadhayaa muddo kooban meel kasta oo aad kaga sugan tahay magaalada.'
        },
        {
            icon: <ShieldCheck size={24} color="#22C55E" />,
            title: 'Zaad & eDahab Sugan',
            desc: 'Si toos ah ugu bixi lacagta Zaad ama eDahab adigoo soo galinaya sawirka caddeynta (Screenshot).'
        },
        {
            icon: <Store size={24} color="#3B82F6" />,
            title: 'Dukaamo La Hubiyay',
            desc: 'Dhammaan ganacsatada ku jira Waaheen waa kuwa Admin-ku hubiyay tayada alaabtooda iyo daacadnimadooda.'
        },
        {
            icon: <Star size={24} color="#F59E0B" />,
            title: '2% Kaliya Macaashka Ganacsatada',
            desc: 'Ganacsatadu waxay bixinayaan macaash aad u yar oo ah 2% oo kaliya marka wax laga iibsado.'
        }
    ];

    return (
        <div className="landing-wrapper">
            {/* ── NAVBAR ────────────────────────────────────────── */}
            <header className="landing-nav">
                <div className="landing-container nav-inner">
                    <div className="landing-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <span className="logo-brand">WAA<span>HEEN</span></span>
                        <span className="logo-badge">Online Market</span>
                    </div>

                    <nav className="nav-desktop-links">
                        <a href="#about">Ku Saabsan</a>
                        <a href="#features">Astaamaha</a>
                        <a href="#categories">Qaybaha</a>
                        <a href="#merchants">Ganacsatada</a>
                        <a href="#download" className="nav-highlight">Soo Degso App-ka</a>
                    </nav>

                    <div className="nav-actions">
                        <button className="btn btn-outline nav-btn-shop" onClick={() => navigate('/shop')}>
                            <ShoppingBag size={17} /> Gal Suuqa (Web)
                        </button>
                        <a href="/waaheen-release.apk" download="waaheen-market.apk" className="btn btn-accent nav-btn-apk">
                            <Download size={17} /> Soo Degso APK
                        </a>
                        <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mobile-dropdown"
                        >
                            <a href="#about" onClick={() => setMobileMenuOpen(false)}>Ku Saabsan</a>
                            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Astaamaha</a>
                            <a href="#categories" onClick={() => setMobileMenuOpen(false)}>Qaybaha Alaabta</a>
                            <a href="#merchants" onClick={() => setMobileMenuOpen(false)}>Ganacsatada (Sellers)</a>
                            <a href="#download" onClick={() => setMobileMenuOpen(false)}>Soo Degso Android App</a>
                            <div className="mobile-dropdown-btns">
                                <button className="btn btn-primary w-full" onClick={() => { setMobileMenuOpen(false); navigate('/shop'); }}>
                                    <ShoppingBag size={18} /> Gal Suuqa Online-ka
                                </button>
                                <a href="/waaheen-release.apk" download="waaheen-market.apk" className="btn btn-accent w-full text-center">
                                    <Download size={18} /> Soo Degso Android App (APK)
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* ── HERO SECTION ─────────────────────────────────── */}
            <section className="landing-hero" id="about">
                <div className="landing-container hero-grid">
                    <motion.div
                        className="hero-content"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="hero-pill">
                            <Sparkles size={14} color="#F4A61D" />
                            <span>Suuqa Casriga ah ee Somaliland</span>
                        </div>
                        <h1 className="hero-title">
                            Wax Kasta Oo Aad U Baahan Tahay <span className="text-gradient">Hal Gujin Kaliya</span>
                        </h1>
                        <p className="hero-desc">
                            <strong>WAAHEEN Online Market</strong> waa madal kuu sahlaysa inaad ka dukaamaysato dukaamada ugu caansan dalka. Ku bixi Zaad ama eDahab, alaabtana albaabkaaga lagugu keeno.
                        </p>

                        <div className="hero-buttons">
                            <a href="#download" className="btn btn-accent btn-hero-lg">
                                <Download size={20} />
                                <div>
                                    <span className="btn-small-text">Hadda Hel Android</span>
                                    <span className="btn-main-text">Soo Degso App-ka (APK)</span>
                                </div>
                            </a>
                            <button className="btn btn-outline btn-hero-lg" onClick={() => navigate('/shop')}>
                                <ShoppingBag size={20} />
                                <div>
                                    <span className="btn-small-text">Bilaash Ku Isticmaal</span>
                                    <span className="btn-main-text">Fur Suuqa (Web Version)</span>
                                </div>
                            </button>
                        </div>

                        {/* Quick Trust badges */}
                        <div className="hero-trust">
                            <div className="trust-item">
                                <CheckCircle2 size={16} color="#22C55E" />
                                <span>Zaad & eDahab Ready</span>
                            </div>
                            <div className="trust-item">
                                <CheckCircle2 size={16} color="#22C55E" />
                                <span>Dukaamo La Xaqiijiyay</span>
                            </div>
                            <div className="trust-item">
                                <CheckCircle2 size={16} color="#22C55E" />
                                <span>Android APK Toos Ah</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* App Mockup / Visual */}
                    <motion.div
                        className="hero-visual"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <div className="phone-mockup">
                            <div className="phone-camera"></div>
                            <div className="phone-screen">
                                <div className="screen-header">
                                    <span>WAAHEEN</span>
                                    <span className="screen-dot"></span>
                                </div>
                                <div className="screen-banner">
                                    <span className="screen-tag">SUMMER SALE</span>
                                    <h4>Up to 30% OFF</h4>
                                    <p>Dhammaan alaabta suuqa</p>
                                </div>
                                <div className="screen-categories">
                                    <div className="mini-cat active">All</div>
                                    <div className="mini-cat">Men</div>
                                    <div className="mini-cat">Women</div>
                                    <div className="mini-cat">Phones</div>
                                </div>
                                <div className="screen-cards">
                                    <div className="mini-card">
                                        <div className="mini-img img-1"></div>
                                        <div className="mini-details">
                                            <strong>Smart Watch</strong>
                                            <span>$45.00</span>
                                        </div>
                                    </div>
                                    <div className="mini-card">
                                        <div className="mini-img img-2"></div>
                                        <div className="mini-details">
                                            <strong>Sneakers</strong>
                                            <span>$30.00</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="screen-cta" onClick={() => navigate('/shop')}>
                                    <span>Iibso Hadda →</span>
                                </div>
                            </div>
                        </div>
                        {/* Floating elements */}
                        <div className="floating-badge badge-top">
                            <ShieldCheck size={20} color="#22C55E" />
                            <div>
                                <strong>100% Sugan</strong>
                                <span>Rasiidka Screenshot-ka</span>
                            </div>
                        </div>
                        <div className="floating-badge badge-bottom">
                            <Smartphone size={20} color="#F4A61D" />
                            <div>
                                <strong>Android App</strong>
                                <span>Hadda Soo Degso</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── METRICS STRIP ────────────────────────────────── */}
            <section className="landing-metrics">
                <div className="landing-container metrics-grid">
                    <div className="metric-box">
                        <h3>1000+</h3>
                        <p>Alaab Kala Duwan</p>
                    </div>
                    <div className="metric-box">
                        <h3>100+</h3>
                        <p>Dukaamo Diwaangashan</p>
                    </div>
                    <div className="metric-box">
                        <h3>2%</h3>
                        <p>Kaliya Commission-ka</p>
                    </div>
                    <div className="metric-box">
                        <h3>24/7</h3>
                        <p>Adeeg & Taageero Macmiil</p>
                    </div>
                </div>
            </section>

            {/* ── FEATURES SECTION ─────────────────────────────── */}
            <section className="landing-section" id="features">
                <div className="landing-container">
                    <div className="section-head text-center">
                        <span className="section-subtitle">Maxaad U Doornaysaa Waaheen?</span>
                        <h2 className="section-main-title">Faa'iidooyinka Gaarka Ah Ee Waaheen</h2>
                        <p className="section-desc">
                            Waxaan kuu dhisnay nidaam casri ah oo u fududeynaya macmiilka iyo ganacsadahaba xidhiidh dhab ah iyo kalsooni buuxda.
                        </p>
                    </div>

                    <div className="features-grid">
                        {features.map((f, i) => (
                            <div className="feature-card" key={i}>
                                <div className="feature-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CATEGORIES SHOWCASE ──────────────────────────── */}
            <section className="landing-section bg-light" id="categories">
                <div className="landing-container">
                    <div className="section-head text-center">
                        <span className="section-subtitle">Kala Duwanaanshaha Suuqa</span>
                        <h2 className="section-main-title">Qaybaha Alaabta Ee Aad Ka Helayso</h2>
                        <p className="section-desc">
                            Dooro qeybta aad doonayso oo toos uga dhex dukaamayso Waaheen Market.
                        </p>
                    </div>

                    <div className="categories-landing-grid">
                        {categories.map((c, i) => (
                            <div className="cat-landing-card" key={i} onClick={() => navigate('/shop')}>
                                <div className="cat-landing-icon">{c.icon}</div>
                                <h4>{c.name}</h4>
                                <p>{c.desc}</p>
                                <span className="cat-link">Eeg Alaabta →</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── DOWNLOAD APP SECTION ─────────────────────────── */}
            <section className="landing-section download-section" id="download">
                <div className="landing-container download-inner">
                    <div className="download-text">
                        <div className="hero-pill mb-3">
                            <Smartphone size={14} color="#F4A61D" />
                            <span>Download Android Application</span>
                        </div>
                        <h2>Soo Degso WAAHEEN App Hadda!</h2>
                        <p>
                            Ku shubo Waaheen taleefankaaga gacanta ee Android. Waxaad si toos ah uga iibsan kartaa wax kasta, ku bixin kartaa Zaad/eDahab, lana socon kartaa heerka uu dalabkaagu marayo.
                        </p>

                        <div className="download-features-list">
                            <div><CheckCircle2 size={18} color="#22C55E" /> Fududayn buuxda oo mobile-ka ah</div>
                            <div><CheckCircle2 size={18} color="#22C55E" /> Rasiidka lacagta oo sawir ahaan loo diro</div>
                            <div><CheckCircle2 size={18} color="#22C55E" /> Ogeysiis toos ah marka dalabku diyaar yahay</div>
                        </div>

                        <div className="download-action-group">
                            <a
                                href="/waaheen-release.apk"
                                download="waaheen-market.apk"
                                className="btn btn-accent btn-download-card"
                            >
                                <Download size={28} />
                                <div className="text-left">
                                    <span className="download-label">Soo Degso Faylka Tooska Ah</span>
                                    <span className="download-title">Download APK (Android)</span>
                                </div>
                            </a>

                            <div className="google-play-badge">
                                <div className="play-icon">▶</div>
                                <div>
                                    <span className="badge-small">Google Play Store</span>
                                    <span className="badge-status">Dhawaan Soo Galaya</span>
                                </div>
                            </div>
                        </div>

                        <div className="download-meta">
                            <span>📦 Baaxadda: <strong>~15 MB</strong></span>
                            <span>📱 Nidaamka: <strong>Android 7.0+</strong></span>
                            <span>🛡️ Ammaan: <strong>Verified & Safe</strong></span>
                        </div>
                    </div>

                    <div className="download-qr-box">
                        <div className="qr-card">
                            <QrCode size={120} color="var(--primary)" />
                            <p>Sawir QR Code-ka si aad toos ugu soo degsato teleefankaaga</p>
                            <span className="qr-tag">Waaheen v1.0.0</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOR MERCHANTS SECTION ────────────────────────── */}
            <section className="landing-section" id="merchants">
                <div className="landing-container">
                    <div className="merchant-banner">
                        <div className="merchant-content">
                            <span className="hero-pill mb-2">Ma Leedahay Meherad?</span>
                            <h2>Ku Iibi Alaabtaada Waaheen Online Market</h2>
                            <p>
                                Is-diiwaangeli maanta oo gaadh kumannaan macaamiil ah oo jooga dhammaan gobollada dalka. Wax lacag ah lagamaa rabo furashada dukaankaaga — kaliya 2% macaash ah ayaa lagaa jarayaa iib kasta oo guuleysta!
                            </p>
                            <div className="merchant-btns">
                                <button className="btn btn-accent" onClick={() => navigate('/registration')}>
                                    <Store size={18} /> Is-Diiwaangeli Ganacsade Ahaan
                                </button>
                                <button className="btn btn-outline text-white" onClick={() => navigate('/login')}>
                                    Gal Akoonkaaga (Merchant Login)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────── */}
            <footer className="landing-footer">
                <div className="landing-container footer-grid">
                    <div className="footer-col brand-col">
                        <div className="landing-logo">
                            <span className="logo-brand text-white">WAA<span>HEEN</span></span>
                        </div>
                        <p>
                            Waaheen waa suuq online ah oo casri ah, ka shaqeeya fududaynta ganacsiga iyo isku xidhka dukaamada iyo macaamiisha.
                        </p>
                        <span className="footer-copy">© 2026 Waaheen Market. Dhammaan xuquuqdu way dhowran tahay.</span>
                    </div>

                    <div className="footer-col">
                        <h4>Xidhiidho Degdeg Ah</h4>
                        <a href="#about">Ku Saabsan</a>
                        <a href="#features">Astaamaha</a>
                        <a href="#download">Soo Degso App-ka</a>
                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/shop')}>Suuqa (Web)</span>
                    </div>

                    <div className="footer-col">
                        <h4>Ganacsatada</h4>
                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/registration')}>Fur Dukaan Cusub</span>
                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/login')}>Gelidda Ganacsatada</span>
                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/login')}>Gelidda Maamulka (Admin)</span>
                    </div>

                    <div className="footer-col">
                        <h4>Lacag Bixinta</h4>
                        <p>Waxaan taageernaa:</p>
                        <div className="payment-tags">
                            <span className="tag-zaad">Telesom ZAAD</span>
                            <span className="tag-edahab">Somtel eDahab</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
