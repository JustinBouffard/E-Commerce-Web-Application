import { useEffect } from "react";
import "../styles/OrderConfirmation.css";

export default function OrderConfirmation({ order, onContinueShopping }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!order) {
    return (
      <div className="order-confirmation-page">
        <div className="confirmation-container">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h1>Order Not Found</h1>
            <p>
              We couldn't find the order details. Please try placing your order
              again.
            </p>
            <button className="continue-btn" onClick={onContinueShopping}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">
        {/* Success Message */}
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h1>Order Paid</h1>
          <p className="thank-you-message">Thank you for your purchase!</p>
        </div>

        {/* Continue Shopping Button */}
        <button className="continue-btn" onClick={onContinueShopping}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
