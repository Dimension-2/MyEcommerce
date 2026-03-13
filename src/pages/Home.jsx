import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [banners, setBanners] = useState([]);
    const [categories, setCategories] = useState([]);
    const [current, setCurrent] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bRes = await axios.get('http://localhost:5000/api/banners');
                const cRes = await axios.get('http://localhost:5000/api/categories');
                setBanners(bRes.data);
                setCategories(cRes.data);
            } catch (err) {
                console.error("LINK_ERROR: RE-ESTABLISHING CONNECTION...");
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (banners.length > 0 && !isHovered) {
            const timer = setInterval(() => {
                nextSlide();
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [banners, current, isHovered]);

    const nextSlide = () => setCurrent(prev => (prev === banners.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrent(prev => (prev === 0 ? banners.length - 1 : prev - 1));

    return (
        <div style={pageContainer}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
                * { font-family: 'Inter', sans-serif; box-sizing: border-box; }

                /* BANNER INTERACTION */
                .banner-content { 
                    opacity: 0; 
                    transform: translateY(30px); 
                    transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1); 
                }
                .slide-container:hover .banner-content { 
                    opacity: 1; 
                    transform: translateY(0); 
                }
                .slide-container:hover .banner-dimmer { 
                    background: rgba(0,0,0,0.6) !important; 
                }

                /* NAVIGATION ARROWS */
                .nav-arrow { 
                    opacity: 0; transition: 0.3s; z-index: 10; 
                    background: #111 !important; color: #FFD700 !important; 
                    border: none; cursor: pointer; width: 50px; height: 50px; 
                    font-weight: 900; position: absolute; top: 50%; transform: translateY(-50%);
                }
                .hero-wrapper:hover .nav-arrow { opacity: 1; }
                .nav-arrow:hover { background: #FFD700 !important; color: #111 !important; }

                /* BUTTONS */
                .main-btn-hover { 
                    padding: 15px 40px; background: #FFD700; color: #111; border: none; font-weight: 900; 
                    cursor: pointer; transition: 0.3s; border-radius: 0px; letter-spacing: 3px; font-size: 0.75rem;
                }
                .main-btn-hover:hover { background: #fff; transform: scale(1.05); }

                /* CARDS */
                .industrial-card { 
                    background: white; border: 1px solid #f0f0f0; transition: all 0.4s ease; 
                    cursor: pointer; overflow: hidden;
                }
                .industrial-card:hover { 
                    border-color: #111; 
                    transform: translateY(-8px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.08);
                }
                .cat-overlay-hover { 
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(255, 215, 0, 0.9); display: flex; justify-content: center;
                    align-items: center; color: #111; opacity: 0; transition: 0.3s;
                }
                .industrial-card:hover .cat-overlay-hover { opacity: 1; }
                .industrial-card:hover .cat-img-scale { transform: scale(1.1); }
            `}</style>

            {/* 1. HERO SECTION (WITH HOVER REVEAL) */}
            <div 
                className="hero-wrapper"
                style={heroWrapper} 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <button onClick={prevSlide} className="nav-arrow" style={{ left: '20px' }}>❮</button>
                <button onClick={nextSlide} className="nav-arrow" style={{ right: '20px' }}>❯</button>

                <div style={{ ...slideTrack, transform: `translateX(-${current * 100}%)` }}>
                    {banners.map((banner, idx) => (
                        <div key={idx} className="slide-container" style={{ ...slideStyle, backgroundImage: `url(${banner.imageURL})` }}>
                            <div className="banner-dimmer" style={bannerOverlay}>
                                <div className="banner-content" style={textContainer}>
                                    <h1 style={heroTitle}>{banner.title.toUpperCase()}</h1>
                                    <p style={heroSub}>{banner.subtitle.toUpperCase()}</p>
                                    <button onClick={() => navigate('/products')} className="main-btn-hover">
                                        VIEW COLLECTION
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={dotContainer}>
                    {banners.map((_, i) => (
                        <div key={i} onClick={() => setCurrent(i)}
                            style={{
                                width: current === i ? '40px' : '10px', height: '4px',
                                background: current === i ? '#FFD700' : 'rgba(255,255,255,0.3)',
                                cursor: 'pointer', transition: '0.4s'
                            }} 
                        />
                    ))}
                </div>
            </div>

            {/* 2. SYSTEM STATUS RIBBON */}
            <div style={infoRibbon}>
                <div style={infoItem}><span>[ 🚚 ]</span> <b>FREE_DELIVERY</b></div>
                <div style={vLine}></div>
                <div style={infoItem}><span>[ 🛡️ ]</span> <b>SECURE_ENCRYPTION</b></div>
                <div style={vLine}></div>
                <div style={infoItem}><span>[ ⭐ ]</span> <b>PREMIUM_STOCK</b></div>
            </div>

            {/* 3. CATEGORY COLLECTIONS (ALIGNED & SCALED) */}
            <div style={{ padding: '80px 5%', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: '900', margin: 0, letterSpacing: '8px', color: '#111' }}>THE_MANIFEST</h2>
                    <div style={accentLine}></div>
                </div>

                <div style={cardGrid}>
                    {categories.map((cat, i) => (
                        <div key={i} onClick={() => navigate('/products')} className="industrial-card">
                            <div style={imgBox}>
                                <img src={cat.imageURL} alt={cat.title} className="cat-img-scale" style={catImg} />
                                <div className="cat-overlay-hover">
                                     <span style={{fontWeight: '900', letterSpacing: '2px', fontSize: '0.7rem'}}>OPEN_LOGS</span>
                                </div>
                            </div>
                            <div style={cardContent}>
                                <h3 style={catTitle}>{cat.title.toUpperCase()}</h3>
                                <p style={catSub}>{cat.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// --- REFINED STYLE OBJECTS ---
const pageContainer = { backgroundColor: '#fff', minHeight: '100vh' };
const heroWrapper = { position: 'relative', height: '85vh', width: '100%', overflow: 'hidden', background: '#000' };
const slideTrack = { display: 'flex', width: '100%', height: '100%', transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)' };
const slideStyle = { minWidth: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' };

const bannerOverlay = { 
    height: '100%', width: '100%', 
    background: 'rgba(0,0,0,0)', // Invisible until hover
    display: 'flex', alignItems: 'center', padding: '0 10%',
    transition: '0.5s ease'
};

const textContainer = { color: '#fff', maxWidth: '700px' };
const heroTitle = { fontSize: '4rem', fontWeight: '900', margin: 0, lineHeight: '1', letterSpacing: '-1px' };
const heroSub = { fontSize: '0.8rem', margin: '20px 0 35px 0', letterSpacing: '6px', color: '#FFD700', fontWeight: '700' };
const dotContainer = { position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 };

const infoRibbon = { 
    display: 'flex', justifyContent: 'center', alignItems: 'center', 
    gap: '50px', padding: '30px 0', borderBottom: '1px solid #f5f5f5', background: '#fff' 
};
const infoItem = { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.6rem', letterSpacing: '2px', color: '#111' };
const vLine = { width: '1px', height: '20px', background: '#eee' };

const accentLine = { width: '50px', height: '5px', background: '#FFD700', margin: '20px auto' };

// GRID FIX: Changed to 280px min for better alignment
const cardGrid = { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
    gap: '25px' 
};

const imgBox = { width: '100%', height: '300px', overflow: 'hidden', background: '#f9f9f9', position: 'relative' };
const catImg = { width: '100%', height: '100%', objectFit: 'cover', transition: '0.6s cubic-bezier(0.165, 0.84, 0.44, 1)' };
const cardContent = { padding: '20px', textAlign: 'center' };
const catTitle = { margin: '0 0 5px 0', fontSize: '0.9rem', fontWeight: '900', letterSpacing: '2px', color: '#111' };
const catSub = { margin: 0, color: '#999', fontSize: '0.65rem', fontWeight: '600', letterSpacing: '1px' };