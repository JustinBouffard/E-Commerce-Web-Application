import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductDetail({
  onAddToCart,
  userReviews,
  onAddReview,
}) {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
    reviewerName: "",
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const reviewsRef = useRef(null);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://dummyjson.com/products/${productId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }

        const data = await response.json();
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetail();
      window.scrollTo(0, 0);
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      onAddToCart(product, quantity);
      setAddedToCart(true);
      // Reset the "added to cart" message after 2 seconds
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 100)) {
      setQuantity(value);
    }
  };

  const handleScrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (reviewForm.rating && reviewForm.comment.trim()) {
      const newReview = {
        rating: parseInt(reviewForm.rating),
        comment: reviewForm.comment.trim(),
        reviewerName: reviewForm.reviewerName.trim() || "Anonymous",
        date: new Date().toISOString(),
      };
      onAddReview(productId, newReview);
      setReviewForm({ rating: 5, comment: "", reviewerName: "" });
      setShowReviewForm(false);
    }
  };

  const handleReviewFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "rating") {
      setReviewForm((prev) => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setReviewForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStarClick = (starIndex) => {
    setReviewForm((prev) => ({ ...prev, rating: starIndex + 1 }));
  };

  const renderStarRating = () => {
    const currentRating = parseInt(reviewForm.rating);

    return (
      <div className="star-rating-input">
        {[...Array(5)].map((_, index) => {
          const isFilled = index < currentRating;
          return (
            <span
              key={index}
              className={`star-input ${isFilled ? "filled" : "empty"}`}
              onClick={() => handleStarClick(index)}
              title={`Rate ${index + 1} stars`}
            >
              ★
            </span>
          );
        })}
        <span className="rating-display">{currentRating}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="detail-page">
        <button className="back-button" onClick={onBack}>
          ← Back to Products
        </button>
        <div className="error">Error loading product: {error}</div>
      </div>
    );
  }

  const discountedPrice = (
    product.price *
    (1 - product.discountPercentage / 100)
  ).toFixed(2);
  const savings = (product.price - parseFloat(discountedPrice)).toFixed(2);

  // Combine API reviews and user reviews
  const productUserReviews = userReviews[String(productId)] || [];
  const allReviews = [...(product.reviews || []), ...productUserReviews];
  const reviewCount = allReviews.length;

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
    <div className="detail-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back to Products
      </button>

      <div className="detail-container">
        {/* Left Column - Images */}
        <div className="detail-images">
          <div className="main-image-wrapper">
            <img
              src={product.images?.[selectedImageIndex] || product.thumbnail}
              alt={product.title}
              className="main-image"
            />
            {product.discountPercentage >= 1 && (
              <div className="discount-badge-large">
                <span className="discount-text">
                  {product.discountPercentage.toFixed(0)}%
                </span>
                <span className="discount-label">OFF</span>
              </div>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="thumbnail-gallery">
              {product.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${
                    selectedImageIndex === index ? "active" : ""
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={image} alt={`Product ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="detail-info">
          <div className="detail-brand">{product.brand}</div>
          <h1 className="detail-title">{product.title}</h1>

          {/* Rating Section */}
          <div className="detail-rating">
            <div className="rating-stars-large">
              {[...Array(5)].map((_, i) => {
                let starClass = "empty";
                if (i < fullStars) {
                  starClass = "filled";
                } else if (i === fullStars && hasHalfStar) {
                  starClass = "half";
                }
                return (
                  <span key={i} className={`star-large ${starClass}`}>
                    ★
                  </span>
                );
              })}
            </div>
            <span className="rating-value-large">{calculatedRating}</span>
            <span className="review-count" onClick={handleScrollToReviews}>
              ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
            </span>
          </div>

          {/* Price Section */}
          <div className="detail-price-section">
            <div className="price-display">
              <span className="detail-current-price">${discountedPrice}</span>
              {product.discountPercentage >= 1 && parseFloat(savings) > 0 && (
                <>
                  <span className="detail-original-price">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="savings-badge">Save ${savings}</span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="detail-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {/* Product Details */}
          <div className="detail-specs">
            <div className="spec-item">
              <span className="spec-label">Category:</span>
              <span className="spec-value">{product.category}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Stock:</span>
              <span className="spec-value">
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Availability:</span>
              <span
                className={`availability ${product.availabilityStatus
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {product.availabilityStatus}
              </span>
            </div>
            {product.weight && (
              <div className="spec-item">
                <span className="spec-label">Weight:</span>
                <span className="spec-value">{product.weight}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="spec-item">
                <span className="spec-label">Dimensions:</span>
                <span className="spec-value">
                  {product.dimensions.width} × {product.dimensions.height} ×{" "}
                  {product.dimensions.depth}
                </span>
              </div>
            )}
          </div>

          {/* Add to Cart Section */}
          <div className="add-to-cart-section">
            {product.stock > 0 ? (
              <>
                <div className="quantity-selector">
                  <label htmlFor="quantity">Quantity:</label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="quantity-select"
                  >
                    {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="detail-add-to-cart-btn"
                  onClick={handleAddToCart}
                >
                  <span>🛒</span>{" "}
                  {addedToCart ? "Added to Cart!" : "Add to Cart"}
                </button>
              </>
            ) : (
              <button className="detail-add-to-cart-btn out-of-stock" disabled>
                Out of Stock
              </button>
            )}
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="tags-section">
              <h4>Tags:</h4>
              <div className="tags-list">
                {product.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section" ref={reviewsRef}>
        <div className="reviews-header">
          <h2>Customer Reviews</h2>
          <button
            className="add-review-btn"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? "Cancel" : "Write a Review"}
          </button>
        </div>

        {showReviewForm && (
          <form className="review-form" onSubmit={handleSubmitReview}>
            <div className="form-group">
              <label>Rating:</label>
              {renderStarRating()}
            </div>

            <div className="form-group">
              <label htmlFor="comment">Review:</label>
              <textarea
                id="comment"
                name="comment"
                value={reviewForm.comment}
                onChange={handleReviewFormChange}
                placeholder="Share your thoughts about this product..."
                className="form-input textarea"
                rows="5"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="reviewerName">Name (Optional):</label>
              <input
                id="reviewerName"
                type="text"
                name="reviewerName"
                value={reviewForm.reviewerName}
                onChange={handleReviewFormChange}
                placeholder="Your name (defaults to Anonymous)"
                className="form-input"
              />
            </div>

            <button type="submit" className="submit-review-btn">
              Submit Review
            </button>
          </form>
        )}

        {allReviews.length > 0 ? (
          <div className="reviews-list">
            {allReviews.map((review, index) => (
              <div key={index} className="review-item">
                <div className="review-header">
                  <div className="review-user">
                    <span className="review-name">
                      {review.reviewerName || "Anonymous"}
                    </span>
                    {review.reviewerEmail && (
                      <span className="review-email">
                        {review.reviewerEmail}
                      </span>
                    )}
                  </div>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => {
                      let starClass = "empty";
                      if (i < review.rating) {
                        starClass = "filled";
                      }
                      return (
                        <span key={i} className={`review-star ${starClass}`}>
                          ★
                        </span>
                      );
                    })}
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
                <div className="review-date">
                  {new Date(review.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </div>
    </div>
  );
}
