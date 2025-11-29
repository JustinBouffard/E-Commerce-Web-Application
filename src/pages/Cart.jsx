import { useNavigate } from "react-router-dom";
import "../styles/Cart.css";

export default function Cart({ cart, onRemove, onUpdateQuantity, onCheckout }) {
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cart
      .reduce(
        (total, item) =>
          total +
          item.price * (1 - item.discountPercentage / 100) * item.quantity,
        0
      )
      .toFixed(2);
  };

  const calculateOriginalTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const calculateSavings = () => {
    // Only calculate savings from items with discount >= 1%
    const savingsFromSignificantDiscounts = cart
      .filter((item) => item.discountPercentage >= 1)
      .reduce(
        (total, item) =>
          total + item.price * (item.discountPercentage / 100) * item.quantity,
        0
      )
      .toFixed(2);
    return savingsFromSignificantDiscounts;
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <button className="cart-back-button" onClick={() => navigate("/")}>
            ← Back to Products
          </button>
          <h1>Shopping Cart</h1>
        </div>
        <div className="empty-cart">
          <p className="empty-cart-icon">🛒</p>
          <p className="empty-cart-message">Your cart is empty</p>
          <p className="empty-cart-subtitle">
            Start shopping to add items to your cart!
          </p>
          <button
            className="continue-shopping-btn"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button className="cart-back-button" onClick={() => navigate("/")}>
          ← Back to Products
        </button>
        <div className="cart-title-row">
          <h1>Shopping Cart</h1>
          <div className="cart-summary-header">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </div>
        </div>
      </div>

      <div className="cart-container">
        <div className="cart-items">
          {cart.map((item) => {
            const discountedPrice = (
              item.price *
              (1 - item.discountPercentage / 100)
            ).toFixed(2);
            const itemTotal = (discountedPrice * item.quantity).toFixed(2);

            return (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={item.thumbnail || item.images?.[0]}
                    alt={item.title}
                  />
                </div>

                <div className="cart-item-details">
                  <h3 className="cart-item-title">{item.title}</h3>
                  <p className="cart-item-brand">{item.brand}</p>

                  <div className="cart-item-price">
                    <span className="current-price">${discountedPrice}</span>
                    {item.discountPercentage >= 1 && (
                      <>
                        <span className="original-price">
                          ${item.price.toFixed(2)}
                        </span>
                        <span className="discount-label">
                          {item.discountPercentage.toFixed(0)}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="cart-item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-total">
                  <p className="item-total-price">${itemTotal}</p>
                </div>

                <button
                  className="cart-item-remove"
                  onClick={() => onRemove(item.id)}
                  title="Remove from cart"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal ({totalItems} items):</span>
            <span>${calculateOriginalTotal()}</span>
          </div>

          {parseFloat(calculateSavings()) > 0 && (
            <div className="summary-row savings">
              <span>Total Savings:</span>
              <span>-${calculateSavings()}</span>
            </div>
          )}

          <div className="summary-divider"></div>

          <div className="summary-row total">
            <span>Total:</span>
            <span>${calculateTotal()}</span>
          </div>

          <button className="checkout-btn" onClick={onCheckout}>
            Proceed to Checkout
          </button>
          <button
            className="continue-shopping-btn"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
