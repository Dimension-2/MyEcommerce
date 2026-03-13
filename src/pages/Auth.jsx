import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

export default function Auth() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const [isSystemLoading, setIsSystemLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('status') === 'loggedout') {
            triggerSystemLoad("LOGOUT SUCCESSFUL", () => {
                showToast("SESSION TERMINATED SUCCESSFULLY");
            });
            navigate('/login', { replace: true });
        }
    }, [location, navigate]);

    const showToast = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000);
    };

    const triggerSystemLoad = (text, callback) => {
        setLoadingText(text);
        setIsSystemLoading(true);
        setTimeout(() => {
            setIsSystemLoading(false);
            if (callback) callback();
        }, 1800); // Animation duration
    };

    const handleAuth = async (e, type) => {
        e.preventDefault();

        if (type === 'admin') {
            triggerSystemLoad("INITIALIZING ADMIN PROTOCOL", () => {
                const adminUser = { name: "Admin", email: "admin@gmail.com", isAdmin: true };
                localStorage.setItem('user', JSON.stringify(adminUser));
                navigate('/admin');
                window.location.reload();
            });
            return;
        }

        try {
            const endpoint = type === 'signup' ? '/api/users/signup' : '/api/users/login';
            const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
            
            triggerSystemLoad("AUTHORIZING ACCESS", () => {
                localStorage.setItem('user', JSON.stringify(res.data));
                navigate('/');
                window.location.reload();
            });
        } catch (err) {
            showToast(err.response?.data?.message || "AUTHENTICATION FAILED");
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            const res = await axios.post(`http://localhost:5000/api/users/google-login`, {
                name: decoded.name,
                email: decoded.email,
                image: decoded.picture
            });
            
            triggerSystemLoad("SYNCING GOOGLE ACCOUNT", () => {
                localStorage.setItem('user', JSON.stringify(res.data));
                navigate('/');
                window.location.reload();
            });
        } catch (err) {
            showToast("GOOGLE SYNC FAILED");
        }
    };

    return (
        <GoogleOAuthProvider clientId="251511926848-3sg3odo8s55iba20ctkir00fsot91i2m.apps.googleusercontent.com">
            <div style={containerStyle}>
                <style>{`
                    @keyframes scan {
                        0% { top: -10%; }
                        100% { top: 110%; }
                    }
                    .auth-input:focus {
                        border-bottom: 2px solid #FFD700 !important;
                        background: #fff !important;
                    }
                    .main-btn-hover:hover {
                        background: #FFD700 !important;
                        color: #111 !important;
                        transform: scale(1.02);
                    }
                    .ghost-btn-hover:hover {
                        background: #FFD700 !important;
                        color: #111 !important;
                    }
                `}</style>

                {/* SYSTEM LOADING OVERLAY */}
                {isSystemLoading && (
                    <div style={systemOverlay}>
                        <div style={scanLine}></div>
                        <div style={loadingContent}>
                            <div style={spinnerStyle}></div>
                            <h2 style={loadingTextStyle}>{loadingText}</h2>
                            <p style={subLoadingText}>CORE STABLE v2.4.0</p>
                        </div>
                    </div>
                )}

                {message && <div style={toastStyle}>{message.toUpperCase()}</div>}

                <div style={authCard}>
                    {/* SIGN UP SIDE */}
                    <div style={{...formSide, left: 0, width: '50%', opacity: isRightPanelActive ? 1 : 0, zIndex: isRightPanelActive ? 5 : 1, transform: isRightPanelActive ? 'translateX(100%)' : 'none', transition: 'all 0.6s ease-in-out'}}>
                        <form style={formStyle} onSubmit={(e) => handleAuth(e, 'signup')}>
                            <h1 style={titleStyle}>CREATE ACCOUNT</h1>
                            <div style={underLine}></div>
                            <input type="text" placeholder="NAME" className="auth-input" style={inputStyle} required onChange={e => setFormData({...formData, name: e.target.value})} />
                            <input type="email" placeholder="EMAIL" className="auth-input" style={inputStyle} required onChange={e => setFormData({...formData, email: e.target.value})} />
                            <input type="password" placeholder="PASSWORD" className="auth-input" style={inputStyle} required onChange={e => setFormData({...formData, password: e.target.value})} />
                            <button type="submit" className="main-btn-hover" style={mainBtn}>SIGN UP</button>
                        </form>
                    </div>

                    {/* SIGN IN SIDE */}
                    <div style={{...formSide, left: 0, width: '50%', zIndex: 2, transform: isRightPanelActive ? 'translateX(100%)' : 'none', transition: 'all 0.6s ease-in-out', opacity: isRightPanelActive ? 0 : 1}}>
                        <form style={formStyle} onSubmit={(e) => handleAuth(e, 'login')}>
                            <h1 style={titleStyle}>SIGN IN</h1>
                            <div style={underLine}></div>
                            <input type="email" placeholder="EMAIL" className="auth-input" style={inputStyle} required onChange={e => setFormData({...formData, email: e.target.value})} />
                            <input type="password" placeholder="PASSWORD" className="auth-input" style={inputStyle} required onChange={e => setFormData({...formData, password: e.target.value})} />
                            
                            <button type="submit" className="main-btn-hover" style={mainBtn}>LOGIN TO SYSTEM</button>

                            <div style={{ marginTop: '20px' }}>
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => showToast("LOGIN FAILED")}
                                    shape="square"
                                    theme="outline"
                                />
                            </div>

                            <div onClick={(e) => handleAuth(e, 'admin')} style={adminSwitchBtn}>SWITCH TO ADMIN TERMINAL →</div>
                        </form>
                    </div>

                    <div style={{...overlayContainer, left: '50%', transform: isRightPanelActive ? 'translateX(-100%)' : 'none'}}>
                        <div style={{...overlay, left: '-100%', width: '200%', transform: isRightPanelActive ? 'translateX(50%)' : 'none'}}>
                            <div style={{...overlayPanel, transform: isRightPanelActive ? 'translateX(0)' : 'translateX(-20%)'}}>
                                <h1 style={overlayTitle}>WELCOME BACK</h1>
                                <p style={overlaySub}>ACCESS YOUR SECURE DASHBOARD</p>
                                <button className="ghost-btn-hover" style={ghostBtn} onClick={() => setIsRightPanelActive(false)}>SIGN IN</button>
                            </div>
                            <div style={{...overlayPanel, right: 0, transform: isRightPanelActive ? 'translateX(20%)' : 'translateX(0)'}}>
                                <h1 style={overlayTitle}>HELLO, FRIEND</h1>
                                <p style={overlaySub}>JOIN THE 2026 STABLE NETWORK</p>
                                <button className="ghost-btn-hover" style={ghostBtn} onClick={() => setIsRightPanelActive(true)}>SIGN UP</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}

// --- SYSTEM ANIMATION STYLES ---
const systemOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(17, 17, 17, 0.98)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' };
const scanLine = { position: 'absolute', width: '100%', height: '2px', background: '#FFD700', opacity: 0.3, boxShadow: '0 0 15px #FFD700', animation: 'scan 2s linear infinite' };
const loadingContent = { textAlign: 'center' };
const spinnerStyle = { width: '40px', height: '40px', border: '3px solid #333', borderTop: '3px solid #FFD700', margin: '0 auto 20px', animation: 'spin 0.8s linear infinite' };
const loadingTextStyle = { color: '#fff', fontSize: '0.8rem', letterSpacing: '4px', fontWeight: '900', margin: 0 };
const subLoadingText = { color: '#FFD700', fontSize: '0.5rem', letterSpacing: '2px', marginTop: '10px', opacity: 0.7 };

// --- THEMED STYLES ---
const toastStyle = { position: 'fixed', top: '20px', right: '20px', background: '#111', color: '#FFD700', padding: '15px 30px', borderRadius: '0px', borderLeft: '5px solid #FFD700', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', zIndex: 2000, fontWeight: '900', fontSize: '0.7rem', letterSpacing: '2px' };
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f0f0' };
const authCard = { background: '#fff', borderRadius: '0px', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', position: 'relative', overflow: 'hidden', width: '850px', minHeight: '550px', border: '1px solid #ddd' };
const formSide = { position: 'absolute', top: 0, height: '100%' };
const formStyle = { background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '0 60px', height: '100%', textAlign: 'center' };
const titleStyle = { fontSize: '1.4rem', fontWeight: '900', letterSpacing: '5px', margin: '0 0 5px 0', color: '#111' };
const underLine = { height: '3px', width: '30px', background: '#FFD700', marginBottom: '30px' };
const inputStyle = { background: '#f4f4f4', border: 'none', borderBottom: '2px solid #eee', padding: '15px 10px', margin: '10px 0', width: '100%', borderRadius: '0px', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px', outline: 'none', transition: '0.3s' };
const mainBtn = { borderRadius: '0px', border: 'none', background: '#111', color: '#FFD700', fontSize: '0.7rem', fontWeight: '900', padding: '15px 50px', cursor: 'pointer', marginTop: '20px', letterSpacing: '3px', transition: '0.4s' };
const ghostBtn = { ...mainBtn, background: 'transparent', border: '2px solid #FFD700', color: '#FFD700', marginTop: '25px' };
const adminSwitchBtn = { marginTop: '30px', fontSize: '0.6rem', color: '#aaa', cursor: 'pointer', textDecoration: 'none', fontWeight: '900', letterSpacing: '2px' };
const overlayContainer = { position: 'absolute', top: 0, width: '50%', height: '100%', overflow: 'hidden', transition: 'transform 0.6s ease-in-out', zIndex: 100 };
const overlay = { background: '#111', color: '#FFFFFF', position: 'relative', height: '100%', transition: 'transform 0.6s ease-in-out' };
const overlayPanel = { position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '0 40px', textAlign: 'center', top: 0, height: '100%', width: '50%', transition: 'transform 0.6s ease-in-out' };
const overlayTitle = { fontSize: '1.6rem', fontWeight: '900', letterSpacing: '4px', margin: '0 0 10px 0' };
const overlaySub = { fontSize: '0.6rem', letterSpacing: '2px', color: '#888', fontWeight: '700' };