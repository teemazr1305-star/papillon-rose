import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import App from './App';

// Design system & component styles
import './styles/tokens.css';
import './styles/header.css';
import './styles/footer.css';
import './styles/product-card.css';
import './styles/cart-drawer.css';
import './styles/hero.css';
import './styles/home-sections.css';
import './styles/shop.css';
import './styles/product-detail.css';
import './styles/checkout.css';
import './styles/misc-pages.css';
import './styles/admin.css';
import './styles/utilities.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
