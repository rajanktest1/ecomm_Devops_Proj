import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import StarRating from '../components/StarRating';

function CartPage() {
  const { refreshCartCount } = useCart();
  const [cart,    setCart]    = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch('/api/cart');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCart(data);
    } catch {
      // keep existing cart on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    await fetch(`/api/cart/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQty }),
    });
    fetchCart();
    refreshCartCount();
  };

  const removeItem = async (itemId) => {
    await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
    fetchCart();
    refreshCartCount();
  };

  if (loading) return <div className="loading">⏳ Loading cart…</div>;

  if (cart.items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🛒</div>
        <div className="empty-state-title">Your cart is empty</div>
        <p className="empty-state-sub">Add some products to get started!</p>
        <Link to="/" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  const itemCount   = cart.items.reduce((s, i) => s + i.quantity, 0);
  const subtotal    = cart.total;
  const shipping    = subtotal >= 100 ? 0 : 9.99;
  const grandTotal  = subtotal + shipping;

  return (
    <div>
      <h1 className="page-title">Shopping Cart 🛒</h1>
      <p className="page-subtitle">
        {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
      </p>

      <div className="cart-layout">
        {/* ── Items table ── */}
        <div className="cart-table-wrap">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map(item => (
                <tr key={item.id}>
                  {/* Product info */}
                  <td>
                    <div className="cart-product-cell">
                      <span className="cart-emoji">{item.emoji}</span>
                      <div>
                        <div className="cart-product-name">{item.name}</div>
                        <Link
                          to={`/product/${item.product_id}`}
                          className="cart-view-link"
                        >
                          View details →
                        </Link>
                      </div>
                    </div>
                  </td>

                  {/* Unit price */}
                  <td className="cart-price">${item.price.toFixed(2)}</td>

                  {/* Quantity control */}
                  <td>
                    <div className="cart-qty-control">
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease"
                      >−</button>
                      <span className="cart-qty-value">{item.quantity}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase"
                      >+</button>
                    </div>
                  </td>

                  {/* Row subtotal */}
                  <td className="cart-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>

                  {/* Delete */}
                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Order summary ── */}
        <div className="order-summary">
          <div className="summary-heading">Order Summary</div>

          <div className="summary-line">
            <span>Subtotal ({itemCount} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-line">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>
          {shipping === 0 && (
            <div className="summary-free-ship">🎉 Free shipping on orders over $100!</div>
          )}

          <div className="summary-total">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>

          <div className="summary-actions">
            <button className="btn btn-success btn-block">
              Proceed to Checkout →
            </button>
            <Link to="/" className="btn btn-outline btn-block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
