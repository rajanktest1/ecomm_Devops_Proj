import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-emoji">{product.emoji}</div>
      <div className="product-card-body">
        <div className="product-card-category">{product.category}</div>
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-price">${product.price.toFixed(2)}</div>
      </div>
    </Link>
  );
}

export default ProductCard;
