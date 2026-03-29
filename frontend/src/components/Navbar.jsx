import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🛍️ ShopEase</Link>

      <div className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/cart" className="navbar-link">
          🛒 Cart
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
