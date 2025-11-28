export default function ProductCard({ product }) {
  const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);
  
  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <div className="product-image-container">
          <img 
            src={product.thumbnail} 
            alt={product.title}
            className="product-image"
          />
        </div>
        {product.discountPercentage > 0 && (
          <div className="discount-badge">
            <span className="discount-text">{product.discountPercentage.toFixed(0)}%</span>
            <span className="discount-label">OFF</span>
          </div>
        )}
      </div>
      
      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-title">{product.title}</h3>
        
        <div className="product-rating">
          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`star ${i < Math.round(product.rating) ? 'filled' : 'empty'}`}>★</span>
            ))}
          </div>
          <span className="rating-value">({product.rating.toFixed(1)})</span>
        </div>
        
        <div className="product-price">
          <span className="current-price">${discountedPrice}</span>
          {product.price !== discountedPrice && (
            <span className="original-price">${product.price.toFixed(2)}</span>
          )}
        </div>
        
        <div className="product-footer">
          <span className={`availability ${product.availabilityStatus.toLowerCase().replace(' ', '-')}`}>
            {product.availabilityStatus}
          </span>
          <button className="add-to-cart-btn" title="Add to cart">
            <span>🛒</span>
          </button>
        </div>
      </div>
    </div>
  );
}
