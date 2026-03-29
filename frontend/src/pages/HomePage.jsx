import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    fetch('/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => { setProducts(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return <div className="loading">⏳ Loading products…</div>;
  if (error)   return <div className="loading">❌ {error}</div>;

  return (
    <div>
      <h1 className="page-title">Welcome to ShopEase 🛍️</h1>
      <p className="page-subtitle">
        Discover our curated collection of {products.length} amazing products
      </p>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
