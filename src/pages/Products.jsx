import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Products({ addToCart }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showAuthMsg, setShowAuthMsg] = useState(false);
    const navigate = useNavigate();

    const categories = [
        'All', 
        'Home Appliances', 
        'Gas Appliances', 
        'Furniture', 
        'Utensils', 
        'Men\'s Cloths', 
        'Winter Wear', 
        'Cosmetics', 
        'Perfumes', 
        'Stationary'
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // FIXED: Updated the localhost link to your live Vercel link
                const res = await axios.get('https://my-ecommerce-backend-v2.vercel.app/api/products');
                setProducts(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        const user = localStorage.getItem('user'); 
        if (!user) {
            setShowAuthMsg(true);
            setTimeout(() => setShowAuthMsg(false), 4000);
        }
        addToCart(product);
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
        let matchesCategory = false;
        if (selectedCategory === 'All') {
            matchesCategory = true;
        } else {
            const pCat = p.category ? p.category.toString().trim().toLowerCase() : "";
            const sCat = selectedCategory.toString().trim().toLowerCase();
            matchesCategory = pCat === sCat;
        }
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div style={loaderStyle}>
                <p>LOADING COLLECTION...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px 5%', backgroundColor: '#fff', minHeight: '100vh', position: 'relative' }}>
            
            {/* AUTH NOTIFICATION */}
            <div style={{
                ...authMessageStyle,
                transform: showAuthMsg ? 'translateX(0)' : 'translateX(150%)',
                opacity: showAuthMsg ? 1 : 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ borderRight: '1px solid #eee', paddingRight: '15px' }}>
                        <p style={{ margin: 0, fontWeight: '800', fontSize: '0.8rem' }}>GUEST NOTICE</p>
                        <p style={{ margin: 0, fontSize: '0.7rem', color: '#666' }}>Item added! Login to save.</p>
                    </div>
                    <button onClick={() => navigate('/login')} style={loginPromptBtn}>LOGIN</button>
                </div>
            </div>

            {/* SEARCH BAR */}
            <div style={shopSearchContainer}>
                <input 
                    type="text" 
                    placeholder="Search our collection..." 
                    style={shopSearchInput}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                />
            </div>

            {/* SECTION TITLE */}
            <div style={headerSection}>
                <h1 style={titleStyle}>{selectedCategory === 'All' ? 'Our Collection' : selectedCategory}</h1>
                <p style={subTitleStyle}>{filteredProducts.length} items available</p>
            </div>

            {/* PRODUCT GRID */}
            {filteredProducts.length > 0 ? (
                <div style={productGrid}>
                    {filteredProducts.map((product) => (
                        <div key={product._id} className="product-card" style={cardStyle}>
                            <div style={imageWrapper}>
                                <img 
                                    src={product.imageURL} 
                                    alt={product.title} 
                                    className="product-image"
                                    style={imgStyle} 
                                />
                            </div>
                            
                            <div style={infoSection}>
                                <p style={categoryLabel}>{product.category}</p>
                                <h3 style={productTitle}>{product.title}</h3>
                                <div style={priceRow}>
                                    <span style={priceText}>${product.price}</span>
                                </div>
                                <button 
                                    onClick={() => handleAddToCart(product)} 
                                    style={addBtn}
                                    className="add-to-cart-btn"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={emptyState}>
                    <p>No products found matching your search.</p>
                    <button 
                        onClick={() => {setSelectedCategory('All'); setSearchTerm('');}} 
                        style={resetBtn}
                    >
                        VIEW ALL PRODUCTS
                    </button>
                </div>
            )}

            <style>
                {`
                .product-card { transition: all 0.4s ease; border: 1px solid #f2f2f2; }
                .product-card:hover { border-color: #ccc; transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
                .product-card:hover .product-image { transform: scale(1.05); }
                
                .add-to-cart-btn { transition: 0.3s ease; background: #fff !important; cursor: pointer; }
                .add-to-cart-btn:hover { background: #111 !important; color: #fff !important; }
                `}
            </style>
        </div>
    );
}

const authMessageStyle = { position: 'fixed', top: '100px', right: '30px', backgroundColor: 'white', padding: '15px 25px', borderRadius: '4px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 9999, borderLeft: '4px solid #111', transition: '0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' };
const loginPromptBtn = { padding: '8px 15px', backgroundColor: '#111', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '0.7rem', cursor: 'pointer', borderRadius: '2px' };
const shopSearchContainer = { marginBottom: '60px', display: 'flex', justifyContent: 'center' };
const shopSearchInput = { width: '100%', maxWidth: '400px', padding: '12px 0', border: 'none', borderBottom: '1px solid #ddd', outline: 'none', fontSize: '1rem', textAlign: 'center', backgroundColor: 'transparent' };
const loaderStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', fontSize: '0.75rem', letterSpacing: '4px', color: '#999' };
const headerSection = { marginBottom: '40px', textAlign: 'center' };
const titleStyle = { margin: 0, fontSize: '1.8rem', color: '#111', fontWeight: '300', textTransform: 'uppercase', letterSpacing: '3px' };
const subTitleStyle = { color: '#bbb', marginTop: '8px', fontSize: '0.7rem', textTransform: 'uppercase' };
const productGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px' };
const cardStyle = { background: 'white', borderRadius: '4px', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' };
const imageWrapper = { height: '280px', overflow: 'hidden', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const imgStyle = { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' };
const infoSection = { padding: '20px', textAlign: 'center' };
const categoryLabel = { fontSize: '0.55rem', color: '#ccc', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 5px 0' };
const productTitle = { fontSize: '0.85rem', margin: '0 0 10px 0', color: '#111', fontWeight: '600', minHeight: '35px', lineHeight: '1.4' };
const priceRow = { marginBottom: '15px' };
const priceText = { fontSize: '1rem', fontWeight: '700', color: '#111' };
const addBtn = { width: '100%', padding: '10px', border: '1px solid #111', fontWeight: 'bold', color: '#111', fontSize: '0.65rem', textTransform: 'uppercase', borderRadius: '2px' };
const emptyState = { textAlign: 'center', padding: '80px 0', color: '#999' };
const resetBtn = { marginTop: '20px', background: 'none', border: 'none', borderBottom: '1px solid #111', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.7rem' };