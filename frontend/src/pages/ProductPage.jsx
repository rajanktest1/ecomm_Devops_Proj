import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import StarRating from '../components/StarRating';

function ProductPage() {
  const { id } = useParams();
  const { refreshCartCount } = useCart();

  const [product,      setProduct]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [quantity,     setQuantity]     = useState(1);
  const [addedToCart,  setAddedToCart]  = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setQuantity(1);
    setAddedToCart(false);

    fetch(`/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found.');
        return res.json();
      })
      .then(data => { setProduct(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [id]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, quantity }),
      });
      if (!res.ok) throw new Error('Could not add to cart.');
      setAddedToCart(true);
      refreshCartCount();
      setTimeout(() => setAddedToCart(false), 3000);
    } catch {
      // silently ignore in demo
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <div className="loading">⏳ Loading product…</div>;
  if (error)   return (
    <div>
      <Link to="/" className="back-link">← Back to Products</Link>
      <div className="loading">❌ {error}</div>
    </div>
  );

  const avgRating = product.reviews.length
    ? Math.round(product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length)
    : 0;

  return (
    <div>
      <Link to="/" className="back-link">← Back to Products</Link>

      {/* ── Main detail block ── */}
      <div className="product-detail">
        {/* Emoji "image" */}
        <div className="product-detail-visual">{product.emoji}</div>

        {/* Info panel */}
        <div className="product-detail-info">
          <div className="product-detail-category">{product.category}</div>
          <h1 className="product-detail-name">{product.name}</h1>

          {product.reviews.length > 0 && (
            <div className="star-row">
              <StarRating rating={avgRating} />
              <span className="star-count">
                {avgRating}/5 ({product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          )}

          <div className="product-detail-price">${product.price.toFixed(2)}</div>
          <p className="product-detail-description">{product.description}</p>

          {/* Quantity selector */}
          <div className="quantity-row">
            <span className="quantity-label">Quantity:</span>
            <div className="quantity-control">
              <button
                className="quantity-btn"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >−</button>
              <span className="quantity-value">{quantity}</span>
              <button
                className="quantity-btn"
                onClick={() => setQuantity(q => q + 1)}
                aria-label="Increase quantity"
              >+</button>
            </div>
          </div>

          <button
            className="btn btn-success btn-block"
            onClick={handleAddToCart}
            disabled={addingToCart}
          >
            🛒 Add to Cart — ${(product.price * quantity).toFixed(2)}
          </button>

          {addedToCart && (
            <div className="add-to-cart-feedback">
              ✅ Added to cart successfully!
            </div>
          )}
        </div>
      </div>

      {/* ── Reviews ── */}
      <div className="reviews-section">
        <h2 className="reviews-title">
          Customer Reviews ({product.reviews.length})
        </h2>

        {product.reviews.length === 0 ? (
          <p style={{ color: '#64748b' }}>No reviews yet — be the first!</p>
        ) : (
          product.reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <span className="review-author">{review.reviewer}</span>
                <StarRating rating={review.rating} />
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductPage;
