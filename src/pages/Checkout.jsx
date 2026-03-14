import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Checkout({ cart, setCart }) {
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        phoneNumber: '',
        email: '',
        city: '',
        address: ''
    });

    // Calculate total price accurately
    const subtotal = cart.reduce((acc, item) => acc + Number(item.price), 0);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (cart.length === 0) return alert("SYSTEM ERROR: CART IS EMPTY");

        const orderData = {
            ...formData,
            items: cart,
            totalAmount: subtotal,
            paymentMethod: 'Cash on Delivery'
        };

        try {
            // FIXED: Pointing to your live Vercel backend instead of localhost
            await axios.post('https://industrial-backend.vercel.app/api/orders', orderData);
            
            setIsSuccess(true); 
            setCart([]); // Clear cart on success
        } catch (err) {
            console.error("Order Submission Error:", err);
            alert("TERMINAL ERROR: FAILED TO PROCESS ORDER. Check your connection.");
        }
    };

    return (
        <div style={containerStyle}>
            <style>{`
                .checkout-input:focus {
                    border-bottom: 2px solid #FFD700 !important;
                    background: #fff !important;
                }
                .order-btn:hover {
                    background: #FFD700 !important;
                    color: #111 !important;
                    transform: translateY(-2px);
                }
                @keyframes slideIn { 
                    from { transform: translateY(30px); opacity: 0; } 
                    to { transform: translateY(0); opacity: 1; } 
                }
                @keyframes scanline {
                    0% { bottom: 0%; }
                    100% { bottom: 100%; }
                }
            `}</style>

            <div style={mainContent}>
                
                {/* LEFT SIDE: FORM */}
                <div style={formWrapper}>
                    <h2 style={headerStyle}>DELIVERY_LOGISTICS</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={inputGroup}>
                            <label style={labelStyle}>FULL NAME</label>
                            <input type="text" name="customerName" className="checkout-input" placeholder="IDENTIFICATION REQUIRED" required onChange={handleChange} style={inputStyle} />
                        </div>
                        <div style={inputGroup}>
                            <label style={labelStyle}>PHONE NUMBER</label>
                            <input type="text" name="phoneNumber" className="checkout-input" placeholder="03XXXXXXXXX" required onChange={handleChange} style={inputStyle} />
                        </div>
                        <div style={inputGroup}>
                            <label style={labelStyle}>EMAIL ADDRESS</label>
                            <input type="email" name="email" className="checkout-input" placeholder="CONTACT@STABLE.COM" required onChange={handleChange} style={inputStyle} />
                        </div>
                        <div style={inputGroup}>
                            <label style={labelStyle}>CITY</label>
                            <input type="text" name="city" className="checkout-input" placeholder="DESTINATION CITY" required onChange={handleChange} style={inputStyle} />
                        </div>
                        <div style={inputGroup}>
                            <label style={labelStyle}>FULL DELIVERY ADDRESS</label>
                            <textarea name="address" className="checkout-input" placeholder="STREET, BUILDING, SECTOR..." required onChange={handleChange} style={{...inputStyle, height: '100px'}} />
                        </div>
                        
                        <button type="submit" className="order-btn" style={orderBtn}>CONFIRM ORDER (COD)</button>
                    </form>
                </div>

                {/* RIGHT SIDE: ORDER SUMMARY PREVIEW */}
                <div style={summarySide}>
                    <h2 style={headerStyle}>ORDER_MANIFEST</h2>
                    <div style={scrollBox}>
                        {cart.map((item, i) => (
                            <div key={i} style={miniItem}>
                                <img src={item.imageURL} alt="" style={miniImg} />
                                <div style={{flex: 1}}>
                                    <p style={{margin: 0, fontWeight: '900', fontSize: '0.75rem', letterSpacing: '1px'}}>{item.title ? item.title.toUpperCase() : "PRODUCT"}</p>
                                    <p style={{margin: '2px 0 0 0', color: '#111', fontWeight: '900', fontSize: '0.85rem'}}>${item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div style={billBox}>
                        <div style={billRow}><span>UNITS:</span> <span>{cart.length}</span></div>
                        <div style={billRow}><span>SHIPPING:</span> <span style={{color: '#111'}}>ESTABLISHED [FREE]</span></div>
                        <hr style={{border: 'none', borderBottom: '1px solid #ddd', margin: '15px 0'}} />
                        <div style={{...billRow, fontSize: '1.2rem', marginTop: '10px'}}>
                            <span>TOTAL:</span> 
                            <span style={{color: '#111'}}>${subtotal.toFixed(2)}</span>
                        </div>
                        <div style={codBadge}>💵 COD: PENDING ON ARRIVAL</div>
                    </div>
                </div>
            </div>

            {/* SUCCESS POPUP MODAL */}
            {isSuccess && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <div style={tickCircle}>
                            ✓
                            <div style={scanLineAnim}></div>
                        </div>
                        <h2 style={{fontSize: '1.5rem', fontWeight: '900', letterSpacing: '3px', margin: '10px 0'}}>MANIFEST_LOCKED</h2>
                        <p style={{color: '#888', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '30px', fontWeight: 'bold'}}>ORDER PROCESSED INTO THE STABLE NETWORK. EXPECT ARRIVAL SHORTLY.</p>
                        <button onClick={() => navigate('/')} style={backHomeBtn}>RETURN TO COMMAND</button>
                    </div>
                </div>
            )}
        </div>
    );
}

// THEMED STYLES
const containerStyle = { padding: '80px 5%', backgroundColor: '#f4f4f4', minHeight: '100vh', display: 'flex', justifyContent: 'center' };
const mainContent = { display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px', width: '100%', maxWidth: '1200px' };
const formWrapper = { background: 'white', padding: '40px', borderRadius: '0px', border: '1px solid #ddd', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', animation: 'slideIn 0.5s ease-out' };
const headerStyle = { borderBottom: '5px solid #111', paddingBottom: '10px', marginBottom: '30px', fontSize: '1rem', fontWeight: '900', letterSpacing: '4px' };
const inputGroup = { marginBottom: '25px' };
const labelStyle = { display: 'block', marginBottom: '10px', fontWeight: '900', fontSize: '0.65rem', color: '#888', letterSpacing: '2px' };
const inputStyle = { width: '100%', padding: '15px', borderRadius: '0px', border: 'none', background: '#f9f9f9', borderBottom: '2px solid #eee', boxSizing: 'border-box', transition: '0.3s', outline: 'none', fontSize: '0.8rem', fontWeight: 'bold' };
const summarySide = { background: 'white', padding: '30px', borderRadius: '0px', borderTop: '10px solid #FFD700', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', height: 'fit-content', position: 'sticky', top: '100px' };
const scrollBox = { maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', paddingRight: '10px' };
const miniItem = { display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #f2f2f2' };
const miniImg = { width: '50px', height: '50px', borderRadius: '0px', objectFit: 'cover', border: '1px solid #eee' };
const billBox = { background: '#f9f9f9', padding: '25px', borderRadius: '0px', border: '1px solid #eee' };
const billRow = { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: '900', fontSize: '0.7rem', letterSpacing: '1px' };
const codBadge = { marginTop: '20px', textAlign: 'center', border: '1px dashed #111', color: '#111', padding: '12px', fontSize: '0.6rem', fontWeight: '900', letterSpacing: '2px' };
const orderBtn = { width: '100%', padding: '20px', background: '#111', color: '#FFD700', border: 'none', borderRadius: '0px', fontWeight: '900', fontSize: '0.8rem', cursor: 'pointer', transition: '0.4s', marginTop: '10px', letterSpacing: '3px' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(5px)' };
const modalContent = { background: 'white', padding: '60px', borderRadius: '0px', textAlign: 'center', maxWidth: '500px', width: '90%', animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)', borderTop: '10px solid #FFD700' };
const tickCircle = { width: '80px', height: '80px', background: '#111', borderRadius: '0px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFD700', fontSize: '2.5rem', margin: '0 auto 20px', position: 'relative', overflow: 'hidden' };
const scanLineAnim = { position: 'absolute', width: '100%', height: '2px', background: '#FFD700', left: 0, animation: 'scanline 1.5s linear infinite', boxShadow: '0 0 10px #FFD700' };
const backHomeBtn = { padding: '15px 40px', background: '#111', color: '#FFD700', border: 'none', borderRadius: '0px', fontWeight: '900', cursor: 'pointer', letterSpacing: '2px', fontSize: '0.7rem', transition: '0.3s' };