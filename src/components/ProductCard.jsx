import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({
  product,
  onProductClick,
  userReviews,
  onAddToCart,
}) {
  const navigate = useNavigate();
  const [addedToCart, setAddedToCart] = useState(false);
  const discountedPrice = (
    product.price *
    (1 - product.discountPercentage / 100)
  ).toFixed(2);

  // Combine API reviews and user reviews
  const allReviews = [
    ...(product.reviews || []),
    ...(userReviews?.[product.id] || []),
  ];

  // Calculate average rating from all reviews
  const calculatedRating =
    allReviews.length > 0
      ? (
          allReviews.reduce((sum, review) => sum + review.rating, 0) /
          allReviews.length
        ).toFixed(1)
      : (product.rating || 0).toFixed(1);

  const ratingValue = parseFloat(calculatedRating);
  const fullStars = Math.floor(ratingValue);
  const hasHalfStar = ratingValue % 1 >= 0.5;

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="product-image-wrapper">
        <div className="product-image-container">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="product-image"
          />
        </div>
        {product.discountPercentage >= 1 && (
          <div className="discount-badge">
            <span className="discount-text">
              {product.discountPercentage.toFixed(0)}%
            </span>
            <span className="discount-label">OFF</span>
          </div>
        )}
      </div>

      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-title">{product.title}</h3>

        <div className="product-rating">
          <div className="rating-stars">
            {[...Array(5)].map((_, i) => {
              let starClass = "empty";
              if (i < fullStars) {
                starClass = "filled";
              } else if (i === fullStars && hasHalfStar) {
                starClass = "half";
              }
              return (
                <span key={i} className={`star ${starClass}`}>
                  ★
                </span>
              );
            })}
          </div>
          <span className="rating-value">({calculatedRating})</span>
        </div>

        <div className="product-price">
          <span className="current-price">${discountedPrice}</span>
          {product.discountPercentage >= 1 &&
            product.price !== parseFloat(discountedPrice) && (
              <span className="original-price">
                ${product.price.toFixed(2)}
              </span>
            )}
        </div>

        <div className="product-footer">
          <span
            className={`availability ${product.availabilityStatus
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            {product.availabilityStatus}
          </span>
          <button
            className={`add-to-cart-btn ${addedToCart ? "added" : ""}`}
            title="Add to cart"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product, 1);
              setAddedToCart(true);
              // Reset the "added to cart" state after 2 seconds
              setTimeout(() => setAddedToCart(false), 2000);
            }}
          >
            <span>{addedToCart ? "✓" : "🛒"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
