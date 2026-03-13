import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar({ cartCount, openCart }) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user && user.isAdmin;

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login?status=loggedout');
        window.location.reload(); 
    };

    return (
        <nav style={navStyle}>
            <style>{`
                .nav-link {
                    color: white;
                    text-decoration: none;
                    font-weight: 900;
                    font-size: 0.7rem;
                    letter-spacing: 2px;
                    transition: all 0.3s ease;
                    position: relative;
                    cursor: pointer;
                }
                .nav-link:hover {
                    color: #FFD700;
                    transform: translateY(-2px);
                }
                .nav-link::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 2px;
                    bottom: -5px;
                    left: 0;
                    background-color: #FFD700;
                    transition: width 0.3s ease;
                }
                .nav-link:hover::after {
                    width: 100%;
                }
                .btn-hover:hover {
                    background: white !important;
                    color: #111 !important;
                    transform: scale(1.05);
                    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
                }
                .cart-hover:hover {
                    color: #FFD700 !important;
                }
            `}</style>

            <div style={logoStyle} onClick={() => navigate(isAdmin ? '/admin' : '/')}>
                <div style={logoContainer}>
                    <span style={myPart}>MY</span>
                    <div style={logoDivider}></div>
                    <span style={storePart}>STORE</span>
                </div>
                {isAdmin && <span style={adminTag}>ADMIN PORTAL</span>}
            </div>
            
            <div style={linkGroup}>
                {!isAdmin && (
                    <>
                        <Link to="/" className="nav-link">HOME</Link>
                        <Link to="/products" className="nav-link">SHOP</Link>
                        <Link to="/About" className="nav-link">ABOUT_US</Link>
                        <div onClick={openCart} className="nav-link cart-hover" style={cartToggleStyle}>
                            CART <span style={{marginLeft: '8px', color: '#FFD700'}}>[ {cartCount} ]</span>
                        </div>
                    </>
                )}

                {user ? (
                    <button onClick={handleLogout} className="btn-hover" style={logoutBtn}>LOGOUT</button>
                ) : (
                    <button onClick={() => navigate('/login')} className="btn-hover" style={loginBtn}>SIGN IN</button>
                )}
            </div>
        </nav>
    );
}

// --- STYLING (Keep these exactly as you have them) ---
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 8%', background: '#111', color: 'white', position: 'sticky', top: 0, zIndex: 1000, borderBottom: '4px solid #FFD700' };
const logoContainer = { display: 'flex', alignItems: 'center', gap: '10px' };
const logoStyle = { cursor: 'pointer', textTransform: 'uppercase' };
const myPart = { fontSize: '1.4rem', fontWeight: '400', letterSpacing: '8px', color: '#fff' };
const storePart = { fontSize: '1.4rem', fontWeight: '900', letterSpacing: '4px', color: '#FFD700' };
const logoDivider = { width: '2px', height: '24px', background: '#FFD700', opacity: 0.5 };
const adminTag = { fontSize: '0.6rem', background: '#FFD700', color: '#111', padding: '4px 10px', marginTop: '5px', display: 'inline-block', letterSpacing: '1px', fontWeight: '900' };
const linkGroup = { display: 'flex', alignItems: 'center', gap: '40px' };
const loginBtn = { background: '#FFD700', color: '#111', border: 'none', padding: '12px 28px', fontWeight: '900', fontSize: '0.65rem', letterSpacing: '2px', cursor: 'pointer' };
const logoutBtn = { background: 'transparent', color: '#FFD700', border: '2px solid #FFD700', padding: '10px 22px', fontWeight: '900', fontSize: '0.65rem', letterSpacing: '2px', cursor: 'pointer' };
const cartToggleStyle = { cursor: 'pointer', borderLeft: '1px solid #333', paddingLeft: '25px', display: 'flex', alignItems: 'center' };