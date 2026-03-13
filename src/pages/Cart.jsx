import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cart({ cart, setCart, isCartOpen, setIsCartOpen }) {
    const navigate = useNavigate();
    const [showAuthMsg, setShowAuthMsg] = useState(false);

    // 1. Calculate Subtotal correctly based on quantity
    const subtotal = cart.reduce((acc, item) => acc + (Number(item.price) * (item.quantity || 1)), 0);

    // 2. Remove Item logic
    const removeItem = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    // 3. Increment / Decrement logic
    const updateQuantity = (index, delta) => {
        const newCart = [...cart];
        const item = newCart[index];
        const currentQty = item.quantity || 1;
        
        if (currentQty + delta > 0) {
            item.quantity = currentQty + delta;
            setCart(newCart);
        } else {
            removeItem(index); // Removes item if quantity hits 0
        }
    };

    // 4. Login Guard for Proceed Button
    const handleProceed = () => {
        const user = localStorage.getItem('user');
        if (user) {
            setIsCartOpen(false);
            navigate('/checkout'); 
        } else {
            setShowAuthMsg(true);
            setTimeout(() => {
                setShowAuthMsg(false);
                setIsCartOpen(false);
                navigate('/login'); 
            }, 2500);
        }
    };

    if (!isCartOpen) return null;

    return (
        <>
            <style>{`
                .proceed-btn:hover {
                    background: #FFD700 !important;
                    color: #111 !important;
                    transform: translateY(-2px);
                }
                .qty-btn:hover {
                    background: #FFD700 !important;
                    border-color: #FFD700 !important;
                }
            `}</style>

            {/* Backdrop for side drawer */}
            <div style={backdrop} onClick={() => setIsCartOpen(false)} />

            <div style={drawerStyle}>
                {/* LOGIN GUARD NOTIFICATION */}
                <div style={{
                    ...authNotice,
                    transform: showAuthMsg ? 'translateY(0)' : 'translateY(-150%)',
                    opacity: showAuthMsg ? 1 : 0
                }}>
                    <p style={{ margin: 0, fontWeight: '900', fontSize: '0.7rem', letterSpacing: '2px' }}>🔒 AUTH_REQUIRED</p>
                    <p style={{ margin: 0, fontSize: '0.6rem', color: '#888', letterSpacing: '1px' }}>REDIRECTING TO SECURE LOGIN...</p>
                </div>

                <div style={drawerHeader}>
                    <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '900', letterSpacing: '3px' }}>
                        CART <span style={{color: '#FFD700'}}>[{cart.reduce((a, b) => a + (b.quantity || 1), 0)}]</span>
                    </h2>
                    <button onClick={() => setIsCartOpen(false)} style={closeBtn}>✕</button>
                </div>

                <div style={itemsContainer}>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '100px' }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: '900', color: '#111', letterSpacing: '4px', marginBottom: '5px' }}>EMPTY_STATION</p>
                            <p style={{fontSize: '0.65rem', fontWeight: 'bold', color: '#888', letterSpacing: '1px', marginBottom: '30px'}}>NO ITEMS DETECTED IN SESSION</p>
                            <button onClick={() => setIsCartOpen(false)} style={backBtn}>RETURN TO SHOP</button>
                        </div>
                    ) : (
                        cart.map((item, index) => (
                            <div key={index} style={cartItem}>
                                <img src={item.imageURL} alt="" style={itemImg} />
                                <div style={{ flex: 1, marginLeft: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h4 style={{ margin: '0', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '1px' }}>{item.title.toUpperCase()}</h4>
                                        <button onClick={() => removeItem(index)} style={removeLink}>REMOVE</button>
                                    </div>
                                    <p style={priceTag}>${item.price}</p>
                                    
                                    {/* PLUS MINUS BUTTONS */}
                                    <div style={qtyContainer}>
                                        <button onClick={() => updateQuantity(index, -1)} className="qty-btn" style={qtyBtn}>-</button>
                                        <span style={qtyText}>{item.quantity || 1}</span>
                                        <button onClick={() => updateQuantity(index, 1)} className="qty-btn" style={qtyBtn}>+</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div style={footer}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: '900', letterSpacing: '2px' }}>SUBTOTAL</span>
                            <span style={{ fontSize: '1rem', fontWeight: '900', color: '#111' }}>
                                ${subtotal.toFixed(2)}
                            </span>
                        </div>
                        <button onClick={handleProceed} className="proceed-btn" style={proceedBtn}>
                            PROCEED TO CHECKOUT
                        </button>
                        <p style={secureText}>SHARP EDGES, SECURE PAYMENTS</p>
                    </div>
                )}
            </div>
        </>
    );
}

// THEMED STYLES
const drawerStyle = {
    position: 'fixed', top: 0, right: 0, width: '400px', maxWidth: '90%', height: '100vh',
    backgroundColor: 'white', zIndex: 2000, boxShadow: '-10px 0 0px #FFD700',
    display: 'flex', flexDirection: 'column', transition: '0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    fontFamily: 'inherit'
};

const backdrop = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', zIndex: 1999, backdropFilter: 'blur(2px)' };

const authNotice = {
    position: 'absolute', top: '20px', left: '20px', right: '20px', padding: '20px',
    background: '#111', color: '#fff', borderLeft: '8px solid #FFD700',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)', transition: '0.5s ease', zIndex: 2001
};

const drawerHeader = { padding: '30px 25px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const closeBtn = { background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#111', fontWeight: '900' };

const itemsContainer = { flex: 1, overflowY: 'auto', padding: '25px' };
const cartItem = { display: 'flex', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f2f2f2' };
const itemImg = { width: '70px', height: '70px', objectFit: 'cover', borderRadius: '0px', border: '1px solid #eee' };
const removeLink = { background: 'none', border: 'none', color: '#FF0000', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.55rem', fontWeight: '900', letterSpacing: '1px' };
const priceTag = { margin: '5px 0', fontWeight: '900', color: '#111', fontSize: '0.85rem' };

const qtyContainer = { display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' };
const qtyBtn = { width: '30px', height: '30px', borderRadius: '0px', border: '1px solid #111', background: '#fff', cursor: 'pointer', fontWeight: '900', transition: '0.3s' };
const qtyText = { fontWeight: '900', width: '30px', textAlign: 'center', fontSize: '0.8rem' };

const footer = { padding: '30px 25px', borderTop: '5px solid #111', background: '#fff' };
const proceedBtn = { width: '100%', padding: '18px', background: '#111', color: '#FFD700', border: 'none', borderRadius: '0px', fontWeight: '900', cursor: 'pointer', fontSize: '0.7rem', letterSpacing: '3px', transition: '0.3s' };
const backBtn = { marginTop: '25px', padding: '15px 30px', background: '#FFD700', color: '#111', border: 'none', borderRadius: '0px', cursor: 'pointer', fontWeight: '900', fontSize: '0.65rem', letterSpacing: '3px' };
const secureText = { textAlign: 'center', fontSize: '0.55rem', color: '#bbb', marginTop: '15px', letterSpacing: '2px', fontWeight: 'bold' };