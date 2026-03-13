import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer({ isOpen, onClose, cartItems, setCart, removeFromCart }) {
    const navigate = useNavigate();
    const [showAuthMsg, setShowAuthMsg] = useState(false);

    // Calculate total price based on item prices
    const subtotal = cartItems.reduce((acc, item) => acc + Number(item.price), 0);

    const handleProceed = () => {
        const user = localStorage.getItem('user');
        
        if (user) {
            onClose(); 
            navigate('/checkout'); 
        } else {
            setShowAuthMsg(true);
            setTimeout(() => {
                setShowAuthMsg(false);
                onClose();
                navigate('/login');
            }, 2500);
        }
    };

    const handleBackToShop = () => {
        onClose();
        navigate('/products');
    };

    return (
        <>
            {/* DARK OVERLAY */}
            <div 
                onClick={onClose}
                style={{
                    ...overlayStyle,
                    visibility: isOpen ? 'visible' : 'hidden',
                    opacity: isOpen ? 1 : 0
                }} 
            />

            {/* THE DRAWER PANEL */}
            <div style={{
                ...drawerStyle,
                transform: isOpen ? 'translateX(0)' : 'translateX(100%)'
            }}>
                
                {/* LOGIN GUARD NOTIFICATION */}
                <div style={{
                    ...authNoticeStyle,
                    transform: showAuthMsg ? 'translateY(0)' : 'translateY(-150%)',
                    opacity: showAuthMsg ? 1 : 0
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div>
                            <p style={{ margin: 0, fontWeight: '900', fontSize: '0.7rem', letterSpacing: '2px' }}>AUTH REQUIRED</p>
                            <p style={{ margin: 0, fontSize: '0.6rem', color: '#666', letterSpacing: '1px' }}>REDIRECTING TO LOGIN SECURELY...</p>
                        </div>
                    </div>
                </div>

                <div style={drawerHeader}>
                    <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '900', letterSpacing: '3px' }}>
                        CART <span style={{color: '#FFD700'}}>[{cartItems.length}]</span>
                    </h2>
                    <button onClick={onClose} style={closeBtn}>✕</button>
                </div>

                <div style={itemsContainer}>
                    {cartItems.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '100px' }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: '900', color: '#111', letterSpacing: '4px', marginBottom: '5px' }}>EMPTY_STATION</p>
                            <p style={{fontSize: '0.65rem', fontWeight: 'bold', color: '#888', letterSpacing: '1px', marginBottom: '30px'}}>NO ITEMS DETECTED IN CURRENT SESSION</p>
                            <button onClick={handleBackToShop} style={shopNowBtn}>MOVE TO SHOP</button>
                        </div>
                    ) : (
                        cartItems.map((item, index) => (
                            <div key={index} style={cartItem}>
                                <img src={item.imageURL} alt={item.title} style={itemImg} />
                                <div style={{ flex: 1, paddingLeft: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h4 style={{ margin: '0 0 5px 0', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '1px' }}>{item.title.toUpperCase()}</h4>
                                        <button onClick={() => removeFromCart(index)} style={removeBtn}>REMOVE</button>
                                    </div>
                                    <p style={{ fontWeight: '900', margin: '2px 0', color: '#111', fontSize: '0.85rem' }}>${item.price}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* FOOTER SECTION */}
                {cartItems.length > 0 && (
                    <div style={drawerFooter}>
                        <div style={subtotalRow}>
                            <span style={{fontSize: '0.7rem', letterSpacing: '2px'}}>SUBTOTAL</span>
                            <span style={{ color: '#111' }}>${subtotal.toFixed(2)}</span>
                        </div>
                        <button onClick={handleProceed} style={checkoutBtn}>
                            PROCEED TO CHECKOUT
                        </button>
                        <p style={secureText}>SHARP EDGES, SECURE PAYMENTS</p>
                    </div>
                )}
            </div>
        </>
    );
}

// --- UPDATED THEMED STYLING (YELLOW STRIP REMOVED) ---
const overlayStyle = { 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    background: 'rgba(0,0,0,0.8)', 
    zIndex: 2000, 
    transition: '0.3s', 
    backdropFilter: 'blur(2px)' 
};

const drawerStyle = { 
    position: 'fixed', 
    top: 0, 
    right: 0, 
    width: '400px', 
    maxWidth: '90%', 
    height: '100%', 
    background: '#fff', 
    zIndex: 2001, 
    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)', 
    display: 'flex', 
    flexDirection: 'column', 
    boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', // Changed from yellow to subtle shadow
    fontFamily: 'inherit'
};

const authNoticeStyle = {
    position: 'absolute', top: '20px', left: '20px', right: '20px', 
    background: '#111', color: '#fff', padding: '20px', borderRadius: '0px', 
    border: '1px solid #FFD700', // Changed from left-only yellow strip to simple yellow border
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)', 
    transition: '0.5s ease', zIndex: 2005
};

const drawerHeader = { 
    padding: '30px 25px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderBottom: '1px solid #eee' 
};

const closeBtn = { 
    background: 'none', 
    border: 'none', 
    fontSize: '1.2rem', 
    cursor: 'pointer', 
    color: '#111', 
    fontWeight: '900' 
};

const itemsContainer = { 
    flex: 1, 
    overflowY: 'auto', 
    padding: '25px' 
};

const cartItem = { 
    display: 'flex', 
    alignItems: 'center', 
    marginBottom: '20px', 
    paddingBottom: '20px', 
    borderBottom: '1px solid #f2f2f2' 
};

const itemImg = { 
    width: '65px', 
    height: '65px', 
    objectFit: 'cover', 
    borderRadius: '0px',
    border: '1px solid #eee'
};

const removeBtn = { 
    background: 'none', 
    border: 'none', 
    color: '#FF0000', 
    fontSize: '0.55rem', 
    cursor: 'pointer', 
    fontWeight: '900',
    letterSpacing: '1px',
    textDecoration: 'underline'
};

const drawerFooter = { 
    padding: '30px 25px', 
    borderTop: '5px solid #111', 
    background: '#fff' 
};

const subtotalRow = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    fontSize: '0.9rem', 
    fontWeight: '900', 
    marginBottom: '25px' 
};

const checkoutBtn = { 
    width: '100%', 
    padding: '18px', 
    background: '#111', 
    color: '#FFD700', 
    border: 'none', 
    borderRadius: '0px', 
    fontWeight: '900', 
    cursor: 'pointer', 
    fontSize: '0.7rem',
    letterSpacing: '3px'
};

const secureText = { 
    textAlign: 'center', 
    fontSize: '0.55rem', 
    color: '#bbb', 
    marginTop: '15px',
    letterSpacing: '2px',
    fontWeight: 'bold'
};

const shopNowBtn = { 
    marginTop: '25px', 
    padding: '15px 30px', 
    background: '#FFD700', 
    color: '#111', 
    border: 'none', 
    borderRadius: '0px', 
    cursor: 'pointer',
    fontWeight: '900',
    fontSize: '0.65rem',
    letterSpacing: '3px'
};