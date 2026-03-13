import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages - Ensure these files exist in your 'src/pages' folder!
import Home from './pages/Home';
import Products from './pages/Products';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import About from './pages/About';
import Checkout from './pages/Checkout';

// Components - Matching your folder sidebar
import Navbar from './components/Navbar'; 
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

function App() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Check if the person logged in is the Admin
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user && user.isAdmin === true;

  const addToCart = (product) => {
    setCart([...cart, product]);
    setIsCartOpen(true); 
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  return (
    <Router>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap');
          body { font-family: 'Montserrat', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          input::placeholder { color: #888; }`}
      </style>

      <Navbar 
        cartCount={cart.length} 
        openCart={() => setIsCartOpen(true)} 
        setSearchTerm={setSearchTerm} 
      />

      <div style={{ minHeight: '80vh' }}>
        <Routes>
          
          <Route path="/" element={<Home />} /> 
          <Route path="/login" element={<Auth />} />
          <Route path="/products" element={<Products addToCart={addToCart} searchTerm={searchTerm} />} />
          
          {/* PROTECTED ADMIN ROUTE */}
          <Route 
            path="/admin" 
            element={isAdmin ? <Admin /> : <Navigate to="/login" />} 
          />
          <Route path="/about" element={<About />} />
          <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} />} />
        </Routes>
      </div>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart} 
        removeFromCart={removeFromCart}
      />

      <Footer />
    </Router>
  );
}

export default App;