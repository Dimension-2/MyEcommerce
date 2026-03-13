import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import './Admin.css';

export default function Admin() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('orders');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
    const [searchQuery, setSearchQuery] = useState('');

    const [products, setProducts] = useState([]);
    const [banners, setBanners] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);

    const [notify, setNotify] = useState({ show: false, loading: false, msg: '' });
    const [modal, setModal] = useState({ show: false, title: '', message: '', onConfirm: null });

    // FORM STATES
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);

    const [bTitle, setBTitle] = useState('');
    const [bSubtitle, setBSubtitle] = useState('');
    const [bImage, setBImage] = useState(null);

    const [cTitle, setCTitle] = useState('');
    const [cLink, setCLink] = useState('');
    const [cImage, setCImage] = useState(null);

    const showSuccess = (msg) => {
        setNotify({ show: true, loading: true, msg: 'Processing...' });
        setTimeout(() => {
            setNotify({ show: true, loading: false, msg: msg });
            setTimeout(() => setNotify({ show: false, loading: false, msg: '' }), 2000);
        }, 600);
    };

    const triggerConfirm = (title, message, action) => {
        setModal({
            show: true,
            title: title,
            message: message,
            onConfirm: async () => {
                await action();
                setModal({ ...modal, show: false });
            }
        });
    };

    const fetchData = async () => {
        try {
            const [pRes, bRes, cRes, oRes] = await Promise.all([
                axios.get('http://localhost:5000/api/products'),
                axios.get('http://localhost:5000/api/banners'),
                axios.get('http://localhost:5000/api/categories'),
                axios.get('http://localhost:5000/api/orders')
            ]);
            setProducts(pRes.data);
            setBanners(bRes.data);
            setCategories(cRes.data);
            setOrders(oRes.data);
        } catch (err) { console.error("Fetch error", err); }
    };

    useEffect(() => { if (user) fetchData(); }, [user]);

    // SUBMISSION HANDLERS
    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('price', price);
        formData.append('image', image);
        try {
            await axios.post('http://localhost:5000/api/products', formData);
            showSuccess("Product Added!");
            setTitle(''); setPrice(''); setImage(null);
            fetchData();
        } catch (err) { showSuccess("Error Adding Product"); }
    };

    const handleBannerSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', bTitle);
        formData.append('subtitle', bSubtitle);
        formData.append('image', bImage);
        try {
            await axios.post('http://localhost:5000/api/banners', formData);
            showSuccess("Banner Added!");
            setBTitle(''); setBSubtitle(''); setBImage(null);
            fetchData();
        } catch (err) { showSuccess("Banner Upload Failed"); }
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', cTitle);
        formData.append('linkText', cLink);
        formData.append('image', cImage);
        try {
            await axios.post('http://localhost:5000/api/categories', formData);
            showSuccess("Category Created!");
            setCTitle(''); setCLink(''); setCImage(null);
            fetchData();
        } catch (err) { showSuccess("Category Failed"); }
    };

    const deleteItem = (type, id) => {
        triggerConfirm("Confirm Deletion", "This item will be permanently removed.", async () => {
            try {
                await axios.delete(`http://localhost:5000/api/${type}/${id}`);
                showSuccess("Deleted Successfully");
                fetchData();
            } catch (err) { showSuccess("Delete Failed"); }
        });
    };

    const updateOrderStatus = async (id, status) => {
        await axios.put(`http://localhost:5000/api/orders/${id}`, { status });
        showSuccess(`Marked as ${status}`);
        fetchData();
    };

    const getStatusStyle = (s) => {
        const bg = s === 'Pending' ? '#fff9e6' : s === 'Shipped' ? '#111' : '#FFD700';
        const color = s === 'Pending' ? '#856404' : s === 'Shipped' ? '#fff' : '#111';
        return { background: bg, color: color, fontSize: '0.6rem', fontWeight: 'bold', padding: '3px 10px', borderRadius: '0px', letterSpacing: '1px' };
    };

    // THEMED LOGIN SCREEN
    if (!user) {
        return (
            <div style={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center', background:'#f8f8f8', fontFamily: 'inherit'}}>
                <div style={{
                    background:'white', 
                    padding:'80px 60px', 
                    borderRadius:'0px', 
                    textAlign:'center', 
                    borderTop: '10px solid #FFD700',
                    borderBottom: '1px solid #eee',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                    maxWidth: '400px',
                    width: '90%'
                }}>
                    <h1 style={{marginBottom:'5px', fontSize:'1.4rem', fontWeight:900, letterSpacing:'8px', color: '#111'}}>ADMIN</h1>
                    <div style={{height: '3px', width: '30px', background: '#FFD700', margin: '0 auto 25px auto'}}></div>
                    <p style={{color:'#888', marginBottom:'40px', fontSize: '0.65rem', letterSpacing: '2px', fontWeight: 'bold'}}>AUTHORIZATION REQUIRED</p>
                    <div style={{display:'flex', justifyContent:'center'}}>
                        <GoogleLogin 
                            onSuccess={res => setUser(jwtDecode(res.credential))} 
                            theme="outline"
                            shape="square"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-wrapper" style={{ display: 'flex', minHeight: '100vh', fontFamily: 'inherit', backgroundColor: '#fff' }}>
            
            {modal.show && (
                <div style={notifOverlay}>
                    <div style={confirmModalStyle}>
                        <h2 style={{margin:'0 0 10px 0', fontSize:'0.85rem', letterSpacing: '2px', fontWeight: 900}}>{modal.title.toUpperCase()}</h2>
                        <p style={{color:'#666', fontSize:'0.7rem', lineHeight:'1.5'}}>{modal.message}</p>
                        <div style={{display:'flex', gap:'10px', marginTop:'25px'}}>
                            <button onClick={() => setModal({...modal, show:false})} style={modalCancelBtn}>CANCEL</button>
                            <button onClick={modal.onConfirm} style={modalConfirmBtn}>CONFIRM</button>
                        </div>
                    </div>
                </div>
            )}

            {notify.show && (
                <div style={notifOverlay}>
                    <div style={notifCard}>
                        {notify.loading ? <div className="spinner"></div> : <div style={tickStyle}>✓</div>}
                        <p style={{margin:'15px 0 0 0', fontWeight:'900', fontSize:'0.65rem', letterSpacing: '2px'}}>{notify.msg.toUpperCase()}</p>
                    </div>
                </div>
            )}

            {/* SIDEBAR */}
            <div style={{ width: isSidebarOpen ? '260px' : '80px', position: 'fixed', height: '100vh', backgroundColor: '#111', transition: '0.3s', zIndex: 100 }}>
                <div style={{ padding: '35px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' }}>
                    {isSidebarOpen && <h2 style={{ fontSize: '1rem', letterSpacing: '4px', fontWeight: '900', margin: 0, color: '#FFD700' }}>ADMIN</h2>}
                    <div style={{ cursor: 'pointer', fontSize: '1.2rem', color: '#FFD700' }} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>{isSidebarOpen ? '✕' : '☰'}</div>
                </div>
                <nav style={{ marginTop: '30px' }}>
                    {['orders', 'products', 'banners', 'categories'].map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)} 
                            style={{
                                width: '100%',
                                padding: '20px 25px',
                                textAlign: 'left',
                                background: activeTab === tab ? '#FFD700' : 'transparent',
                                color: activeTab === tab ? '#111' : '#666',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.7rem',
                                letterSpacing: '3px',
                                fontWeight: '900',
                                transition: '0.3s',
                                borderLeft: activeTab === tab ? '5px solid #fff' : '5px solid transparent'
                            }}
                        >
                            {isSidebarOpen ? tab.toUpperCase() : tab.substring(0,1).toUpperCase()}
                        </button>
                    ))}
                </nav>
                <div style={{ position: 'absolute', bottom: '30px', width: '100%', padding: '0 20px' }}>
                    <button onClick={() => setUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                        {user.picture && <img src={user.picture} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #FFD700' }} referrerPolicy="no-referrer" />}
                        {isSidebarOpen && <span style={{ fontSize: '0.6rem', fontWeight: 'bold', letterSpacing: '2px' }}>LOGOUT</span>}
                    </button>
                </div>
            </div>

            {/* CONTENT AREA */}
            <div style={{ marginLeft: isSidebarOpen ? '260px' : '80px', transition: '0.3s', flex: 1 }}>
                <div style={{ padding: '60px 8%' }}>
                    
                    {/* ORDERS TAB */}
                    {activeTab === 'orders' && (
                        <div>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'50px'}}>
                                <div>
                                    <h1 style={pageTitleStyle}>Purchase History</h1>
                                    <div style={{height: '4px', width: '40px', background: '#FFD700', marginTop: '10px', marginBottom: '15px'}}></div>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="SEARCH CUSTOMER..." 
                                    style={minimalInput} 
                                    onChange={(e) => setSearchQuery(e.target.value)} 
                                />
                            </div>
                            {orders.filter(o => o.customerName?.toLowerCase().includes(searchQuery.toLowerCase())).map(order => (
                                <div key={order._id} style={cardStyle}>
                                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px', borderBottom: '1px solid #f2f2f2', paddingBottom: '15px'}}>
                                        <div>
                                            <p style={{margin:0, fontSize: '0.55rem', color: '#999', letterSpacing: '1px'}}>ID: #{order._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                        <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
                                            <span style={getStatusStyle(order.status)}>{order.status.toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'40px'}}>
                                        <div style={{fontSize:'0.7rem', lineHeight: '1.8', letterSpacing: '0.5px'}}>
                                            <p><strong>NAME:</strong> {order.customerName}</p>
                                            <p><strong>TEL:</strong> {order.phoneNumber}</p>
                                            <p><strong>ADDR:</strong> {order.address}</p>
                                        </div>
                                        <div style={{background: '#fcfcfc', padding: '15px', border: '1px solid #eee'}}>
                                            {order.items.map((item, i) => (
                                                <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px dotted #ccc'}}>
                                                    <span style={{fontSize:'0.65rem', fontWeight:700}}>{item.title}</span>
                                                    <span style={{fontSize:'0.65rem'}}>${item.price}</span>
                                                </div>
                                            ))}
                                            <p style={{textAlign:'right', margin:'12px 0 0 0', fontWeight:900, fontSize:'0.8rem', color: '#111'}}>TOTAL: ${order.totalAmount}</p>
                                        </div>
                                    </div>
                                    <div style={{marginTop:'25px', display:'flex', gap:'10px'}}>
                                        <button onClick={() => updateOrderStatus(order._id, 'Shipped')} style={actionBtn}>MARK SHIPPED</button>
                                        <button onClick={() => updateOrderStatus(order._id, 'Delivered')} style={yellowActionBtnSmall}>MARK DELIVERED</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* PRODUCTS TAB */}
                    {activeTab === 'products' && (
                        <div>
                            <h1 style={pageTitleStyle}>Inventory</h1>
                            <div style={{...cardStyle, maxWidth:'500px', marginBottom: '60px', borderTop: '4px solid #FFD700'}}>
                                <p style={sectionLabel}>ADD NEW ITEM</p>
                                <input type="text" placeholder="PRODUCT TITLE" value={title} style={minimalInputFull} onChange={e => setTitle(e.target.value)} />
                                <input type="number" placeholder="PRICE ($)" value={price} style={minimalInputFull} onChange={e => setPrice(e.target.value)} />
                                <input type="file" style={{fontSize: '0.6rem', marginTop: '20px'}} onChange={e => setImage(e.target.files[0])} />
                                <button onClick={handleProductSubmit} style={primaryBtn}>SAVE TO CATALOG</button>
                            </div>
                            <p style={sectionLabel}>CURRENT CATALOG</p>
                            <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px'}}>
                                {products.map(p => (
                                    <div key={p._id} style={{...cardStyle, padding: '15px'}}>
                                        <img src={p.imageURL} alt="" style={{width:'100%', height:'150px', objectFit:'cover', marginBottom: '15px'}} />
                                        <span style={{fontWeight:900, fontSize:'0.7rem', display:'block', marginBottom: '5px'}}>{p.title.toUpperCase()}</span>
                                        <span style={{fontSize:'0.75rem', color:'#111', fontWeight: 'bold'}}>${p.price}</span>
                                        <div style={{marginTop: '15px'}}>
                                            <button onClick={() => deleteItem('products', p._id)} style={deleteBtnStyle}>REMOVE ITEM</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* BANNERS TAB - ADDED DISPLAY LIST */}
                    {activeTab === 'banners' && (
                        <div>
                            <h1 style={pageTitleStyle}>Marketing</h1>
                            <div style={{...cardStyle, maxWidth:'500px', borderTop: '4px solid #FFD700', marginBottom: '60px'}}>
                                <p style={sectionLabel}>UPLOAD BANNER</p>
                                <input type="text" placeholder="MAIN TITLE" value={bTitle} style={minimalInputFull} onChange={e => setBTitle(e.target.value)} />
                                <input type="text" placeholder="SUBTITLE" value={bSubtitle} style={minimalInputFull} onChange={e => setBSubtitle(e.target.value)} />
                                <input type="file" style={{fontSize: '0.6rem', marginTop: '20px'}} onChange={e => setBImage(e.target.files[0])} />
                                <button onClick={handleBannerSubmit} style={primaryBtn}>PUBLISH BANNER</button>
                            </div>
                            <p style={sectionLabel}>ACTIVE BANNERS</p>
                            <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px'}}>
                                {banners.map(b => (
                                    <div key={b._id} style={{...cardStyle, padding: '15px'}}>
                                        <img src={b.imageURL} alt="" style={{width:'100%', height:'120px', objectFit:'cover', marginBottom: '15px'}} />
                                        <span style={{fontWeight:900, fontSize:'0.7rem', display:'block'}}>{b.title.toUpperCase()}</span>
                                        <span style={{fontSize:'0.6rem', color:'#888'}}>{b.subtitle}</span>
                                        <div style={{marginTop: '15px'}}>
                                            <button onClick={() => deleteItem('banners', b._id)} style={deleteBtnStyle}>REMOVE BANNER</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CATEGORIES TAB - ADDED DISPLAY LIST */}
                    {activeTab === 'categories' && (
                        <div>
                            <h1 style={pageTitleStyle}>Categories</h1>
                            <div style={{...cardStyle, maxWidth:'500px', borderTop: '4px solid #FFD700', marginBottom: '60px'}}>
                                <p style={sectionLabel}>CREATE CATEGORY CARD</p>
                                <input type="text" placeholder="CATEGORY NAME" value={cTitle} style={minimalInputFull} onChange={e => setCTitle(e.target.value)} />
                                <input type="text" placeholder="BUTTON LABEL" value={cLink} style={minimalInputFull} onChange={e => setCLink(e.target.value)} />
                                <input type="file" style={{fontSize: '0.6rem', marginTop: '20px'}} onChange={e => setCImage(e.target.files[0])} />
                                <button onClick={handleCategorySubmit} style={primaryBtn}>SAVE CATEGORY</button>
                            </div>
                            <p style={sectionLabel}>LIVE CATEGORIES</p>
                            <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px'}}>
                                {categories.map(c => (
                                    <div key={c._id} style={{...cardStyle, padding: '15px'}}>
                                        <img src={c.imageURL} alt="" style={{width:'100%', height:'150px', objectFit:'cover', marginBottom: '15px'}} />
                                        <span style={{fontWeight:900, fontSize:'0.7rem', display:'block'}}>{c.title.toUpperCase()}</span>
                                        <div style={{marginTop: '15px'}}>
                                            <button onClick={() => deleteItem('categories', c._id)} style={deleteBtnStyle}>REMOVE CATEGORY</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            <style>{`
                .spinner { border: 2px solid rgba(0,0,0,0.1); width: 20px; height: 20px; border-radius: 50%; border-left-color: #FFD700; animation: spin 0.8s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                input::placeholder { letter-spacing: 2px; font-size: 0.6rem; color: #bbb; text-transform: uppercase; }
                body { background-color: #fff; margin: 0; }
            `}</style>
        </div>
    );
}

// --- STYLING CONSTANTS ---
const pageTitleStyle = { fontSize: '1.6rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '6px', margin: 0, color: '#111' };
const sectionLabel = { fontSize: '0.65rem', letterSpacing: '3px', color: '#111', marginBottom: '25px', fontWeight: '900' };
const cardStyle = { background:'white', padding:'30px', marginBottom:'20px', border: '1px solid #eee', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' };
const minimalInput = { border: 'none', borderBottom: '2px solid #eee', padding: '10px 0', outline: 'none', fontSize: '0.7rem', width: '250px', letterSpacing: '1px', fontWeight: 'bold' };
const minimalInputFull = { width: '100%', border: 'none', borderBottom: '2px solid #eee', padding: '12px 0', outline: 'none', fontSize: '0.7rem', marginBottom: '10px', fontWeight: 'bold' };
const actionBtn = { background: '#111', color: '#fff', border: 'none', padding: '10px 20px', fontSize: '0.6rem', fontWeight: 'bold', letterSpacing: '2px', cursor: 'pointer' };
const yellowActionBtnSmall = { background: '#FFD700', color: '#111', border: 'none', padding: '10px 20px', fontSize: '0.6rem', fontWeight: 'bold', letterSpacing: '2px', cursor: 'pointer' };
const primaryBtn = { width: '100%', padding: '18px', background: '#111', color: '#FFD700', border: 'none', fontWeight: '900', fontSize: '0.7rem', letterSpacing: '3px', cursor: 'pointer', marginTop: '20px' };
const deleteBtnStyle = { background: 'none', border: 'none', color: '#FF0000', fontWeight: '900', fontSize: '0.6rem', letterSpacing: '1px', cursor: 'pointer', borderBottom: '1px solid #FF0000' };

const notifOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 };
const notifCard = { background: 'white', padding: '50px', borderLeft: '10px solid #FFD700', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const tickStyle = { fontSize: '30px', color: '#FFD700', fontWeight: '900' };
const confirmModalStyle = { background: 'white', padding: '40px', width: '350px', textAlign: 'center', borderTop: '8px solid #FFD700' };
const modalCancelBtn = { flex: 1, padding: '12px', background: '#eee', border: 'none', fontSize: '0.65rem', fontWeight: '900', cursor: 'pointer', letterSpacing: '1px' };
const modalConfirmBtn = { flex: 1, padding: '12px', background: '#111', color: '#FFD700', border: 'none', fontSize: '0.65rem', fontWeight: '900', cursor: 'pointer', letterSpacing: '1px' };