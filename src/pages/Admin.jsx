import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import './Admin.css';

export default function Admin() {
    // 100% POINTED TO VERCEL - NO LOCALHOST
    const backendUrl = "https://industrial-backend.vercel.app"; 
    
    // AUTH & UI STATE
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('orders');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
    const [searchQuery, setSearchQuery] = useState('');

    // DATA STATE
    const [products, setProducts] = useState([]);
    const [banners, setBanners] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);

    // FEEDBACK STATE
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

    // HELPER: NOTIFICATIONS
    const showSuccess = (msg) => {
        setNotify({ show: true, loading: true, msg: 'Processing...' });
        setTimeout(() => {
            setNotify({ show: true, loading: false, msg: msg });
            setTimeout(() => setNotify({ show: false, loading: false, msg: '' }), 2000);
        }, 600);
    };

    // HELPER: CONFIRMATION MODAL
    const triggerConfirm = (title, message, action) => {
        setModal({
            show: true,
            title: title,
            message: message,
            onConfirm: async () => {
                await action();
                setModal({ show: false, title: '', message: '', onConfirm: null });
            }
        });
    };

    // FETCH ALL DATA
    const fetchData = async () => {
        try {
            const [pRes, bRes, cRes, oRes] = await Promise.all([
                axios.get(`${backendUrl}/api/products`),
                axios.get(`${backendUrl}/api/banners`),
                axios.get(`${backendUrl}/api/categories`),
                axios.get(`${backendUrl}/api/orders`)
            ]);
            setProducts(pRes.data || []);
            setBanners(bRes.data || []);
            setCategories(cRes.data || []);
            setOrders(oRes.data || []);
        } catch (err) { 
            console.error("Fetch error", err); 
        }
    };

    useEffect(() => { 
        if (user) fetchData(); 
    }, [user]);

    // SUBMIT HANDLERS
    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('price', price);
        formData.append('image', image);
        try {
            await axios.post(`${backendUrl}/api/products`, formData);
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
            await axios.post(`${backendUrl}/api/banners`, formData);
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
            await axios.post(`${backendUrl}/api/categories`, formData);
            showSuccess("Category Created!");
            setCTitle(''); setCLink(''); setCImage(null);
            fetchData();
        } catch (err) { showSuccess("Category Failed"); }
    };

    // FIX: UPDATED DELETE LOGIC
    const deleteItem = (type, id) => {
        triggerConfirm("Confirm Deletion", "Are you sure? This cannot be undone.", async () => {
            try {
                await axios.delete(`${backendUrl}/api/${type}/${id}`);
                showSuccess("Deleted successfully");
                fetchData(); // Refresh list after delete
            } catch (err) {
                console.error("Delete failed", err);
                showSuccess("Error deleting item");
            }
        });
    };

    // FIX: ORDER STATUS LOGIC
    const updateOrderStatus = async (id, status) => {
        try {
            await axios.put(`${backendUrl}/api/orders/${id}`, { status });
            showSuccess(`Order ${status}`);
            fetchData();
        } catch (err) { 
            showSuccess("Status Update Failed"); 
        }
    };

    const getStatusStyle = (s) => {
        const bg = s === 'Pending' ? '#fff9e6' : s === 'Shipped' ? '#111' : '#FFD700';
        const color = s === 'Pending' ? '#856404' : s === 'Shipped' ? '#fff' : '#111';
        return { background: bg, color: color, fontSize: '0.6rem', fontWeight: 'bold', padding: '3px 10px', letterSpacing: '1px' };
    };

    // LOGIN SCREEN
    if (!user) {
        return (
            <div style={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center', background:'#f8f8f8'}}>
                <div style={{ background:'white', padding:'80px 60px', textAlign:'center', borderTop: '10px solid #FFD700', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', maxWidth: '400px', width: '90%' }}>
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
        <div className="admin-wrapper" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff' }}>
            
            {/* OVERLAYS */}
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
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{ width: '100%', padding: '20px 25px', textAlign: 'left', background: activeTab === tab ? '#FFD700' : 'transparent', color: activeTab === tab ? '#111' : '#666', border: 'none', cursor: 'pointer', fontSize: '0.7rem', letterSpacing: '3px', fontWeight: '900', transition: '0.3s', borderLeft: activeTab === tab ? '5px solid #fff' : '5px solid transparent' }}>
                            {isSidebarOpen ? tab.toUpperCase() : tab.substring(0,1).toUpperCase()}
                        </button>
                    ))}
                </nav>
            </div>

            {/* MAIN CONTENT */}
            <div style={{ marginLeft: isSidebarOpen ? '260px' : '80px', transition: '0.3s', flex: 1 }}>
                <div style={{ padding: '60px 8%' }}>
                    
                    {activeTab === 'orders' && (
                        <div>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'50px'}}>
                                <h1 style={pageTitleStyle}>Orders</h1>
                                <input type="text" placeholder="SEARCH..." style={minimalInput} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>
                            {orders.filter(o => o.customerName?.toLowerCase().includes(searchQuery.toLowerCase())).map(order => (
                                <div key={order._id} style={cardStyle}>
                                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', borderBottom:'1px solid #eee', paddingBottom:'10px'}}>
                                        <span style={{fontSize:'0.6rem', color:'#999'}}>ID: {order._id}</span>
                                        <span style={getStatusStyle(order.status)}>{order.status}</span>
                                    </div>
                                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', fontSize:'0.7rem'}}>
                                        <div>
                                            <p><strong>NAME:</strong> {order.customerName}</p>
                                            <p><strong>TEL:</strong> {order.phoneNumber}</p>
                                            <p><strong>ADDR:</strong> {order.address}</p>
                                        </div>
                                        <div style={{background:'#f9f9f9', padding:'10px'}}>
                                            {order.items?.map((it, idx) => <div key={idx}>{it.title} - ${it.price}</div>)}
                                            <p style={{fontWeight:900, marginTop:'10px'}}>TOTAL: ${order.totalAmount}</p>
                                        </div>
                                    </div>
                                    <div style={{marginTop:'20px', display:'flex', gap:'10px'}}>
                                        <button onClick={() => updateOrderStatus(order._id, 'Shipped')} style={actionBtn}>SHIP</button>
                                        <button onClick={() => updateOrderStatus(order._id, 'Delivered')} style={yellowActionBtnSmall}>DELIVER</button>
                                        <button onClick={() => deleteItem('orders', order._id)} style={{...deleteBtnStyle, marginLeft:'auto'}}>DELETE</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div>
                            <h1 style={pageTitleStyle}>Inventory</h1>
                            <div style={{...cardStyle, maxWidth:'500px', marginBottom: '40px', borderTop: '4px solid #FFD700'}}>
                                <input type="text" placeholder="TITLE" value={title} style={minimalInputFull} onChange={e => setTitle(e.target.value)} />
                                <input type="number" placeholder="PRICE" value={price} style={minimalInputFull} onChange={e => setPrice(e.target.value)} />
                                <input type="file" style={{fontSize: '0.6rem', marginTop: '10px'}} onChange={e => setImage(e.target.files[0])} />
                                <button onClick={handleProductSubmit} style={primaryBtn}>ADD PRODUCT</button>
                            </div>
                            <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px'}}>
                                {products.map(p => (
                                    <div key={p._id} style={{...cardStyle, padding: '15px'}}>
                                        <img src={p.imageURL} alt="" style={{width:'100%', height:'120px', objectFit:'cover'}} />
                                        <p style={{fontWeight:900, fontSize:'0.65rem', margin:'10px 0'}}>{p.title}</p>
                                        <button onClick={() => deleteItem('products', p._id)} style={deleteBtnStyle}>REMOVE</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'banners' && (
                        <div>
                            <h1 style={pageTitleStyle}>Banners</h1>
                            <div style={{...cardStyle, maxWidth:'500px', borderTop: '4px solid #FFD700', marginBottom: '40px'}}>
                                <input type="text" placeholder="BANNER TITLE" value={bTitle} style={minimalInputFull} onChange={e => setBTitle(e.target.value)} />
                                <input type="file" style={{fontSize: '0.6rem', marginTop: '10px'}} onChange={e => setBImage(e.target.files[0])} />
                                <button onClick={handleBannerSubmit} style={primaryBtn}>UPLOAD BANNER</button>
                            </div>
                            {banners.map(b => (
                                <div key={b._id} style={{...cardStyle, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                    <img src={b.imageURL} alt="" style={{height:'50px'}} />
                                    <span>{b.title}</span>
                                    <button onClick={() => deleteItem('banners', b._id)} style={deleteBtnStyle}>REMOVE</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'categories' && (
                        <div>
                            <h1 style={pageTitleStyle}>Categories</h1>
                            <div style={{...cardStyle, maxWidth:'500px', borderTop: '4px solid #FFD700', marginBottom: '40px'}}>
                                <input type="text" placeholder="CATEGORY NAME" value={cTitle} style={minimalInputFull} onChange={e => setCTitle(e.target.value)} />
                                <input type="file" style={{fontSize: '0.6rem', marginTop: '10px'}} onChange={e => setCImage(e.target.files[0])} />
                                <button onClick={handleCategorySubmit} style={primaryBtn}>SAVE CATEGORY</button>
                            </div>
                            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:'20px'}}>
                                {categories.map(c => (
                                    <div key={c._id} style={cardStyle}>
                                        <p>{c.title}</p>
                                        <button onClick={() => deleteItem('categories', c._id)} style={deleteBtnStyle}>DELETE</button>
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
            `}</style>
        </div>
    );
}

// STYLING OBJECTS
const pageTitleStyle = { fontSize: '1.4rem', fontWeight: '900', letterSpacing: '4px', color: '#111', textTransform: 'uppercase' };
const cardStyle = { background:'white', padding:'25px', marginBottom:'20px', border: '1px solid #eee' };
const minimalInput = { border: 'none', borderBottom: '2px solid #eee', padding: '10px 0', outline: 'none', fontSize: '0.7rem', width: '200px' };
const minimalInputFull = { width: '100%', border: 'none', borderBottom: '2px solid #eee', padding: '12px 0', outline: 'none', fontSize: '0.7rem', marginBottom: '10px' };
const actionBtn = { background: '#111', color: '#fff', border: 'none', padding: '8px 15px', fontSize: '0.6rem', fontWeight: 'bold', cursor: 'pointer' };
const yellowActionBtnSmall = { background: '#FFD700', color: '#111', border: 'none', padding: '8px 15px', fontSize: '0.6rem', fontWeight: 'bold', cursor: 'pointer' };
const primaryBtn = { width: '100%', padding: '15px', background: '#111', color: '#FFD700', border: 'none', fontWeight: '900', fontSize: '0.7rem', cursor: 'pointer', marginTop: '10px' };
const deleteBtnStyle = { background: 'none', border: 'none', color: '#FF0000', fontWeight: '900', fontSize: '0.6rem', cursor: 'pointer', borderBottom: '1px solid #FF0000' };
const notifOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 };
const notifCard = { background: 'white', padding: '40px', borderLeft: '8px solid #FFD700', textAlign: 'center' };
const tickStyle = { fontSize: '30px', color: '#FFD700' };
const confirmModalStyle = { background: 'white', padding: '30px', width: '300px', textAlign: 'center' };
const modalCancelBtn = { flex: 1, padding: '10px', background: '#eee', border: 'none', cursor: 'pointer' };
const modalConfirmBtn = { flex: 1, padding: '10px', background: '#111', color: '#FFD700', border: 'none', cursor: 'pointer' };