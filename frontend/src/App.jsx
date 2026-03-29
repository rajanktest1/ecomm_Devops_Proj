import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import './index.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/"           element={<HomePage />}    />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart"        element={<CartPage />}    />
          </Routes>
        </main>
      </Router>
    </CartProvider>
  );
}

export default App;
