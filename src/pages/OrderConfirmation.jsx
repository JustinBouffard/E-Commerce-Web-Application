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

  const paymentMethodLabels = {
    "credit-card": "💳 Credit Card",
    paypal: "🅿️ PayPal",
    "bank-transfer": "🏦 Bank Transfer",
  };

  const isQC =
    order.customer?.state?.toUpperCase() === "QC" ||
    order.customer?.state?.toUpperCase() === "QUEBEC";

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">
        {/* Success Message */}
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h1>Order Confirmed!</h1>
          <p className="thank-you-message">Thank you for your purchase!</p>
        </div>

        {/* Order Details */}
        <div className="order-details-section">
          <div className="order-header">
            <span>
              <strong>Order ID:</strong> {order.orderId}
            </span>
            <span>
              <strong>Date:</strong>{" "}
              {new Date(order.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "2-digit",
              })}
            </span>
          </div>

          <div className="order-items-section">
            <h2>Items</h2>
            <div className="order-items-list">
              {order.items?.map((item) => {
                const discountedPrice =
                  item.price * (1 - item.discountPercentage / 100);
                const itemTotal = discountedPrice * item.quantity;

                return (
                  <div key={item.id} className="order-item">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="order-item-image"
                    />
                    <div className="order-item-details">
                      <div className="item-title">{item.title}</div>
                      <div className="item-meta">
                        {item.brand} · Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="order-item-price">
                      ${itemTotal.toFixed(2)}
                      {item.discountPercentage >= 1 && (
                        <span className="original-price">
                          {" "}
                          was ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="order-summary-section">
            <h2>Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${order.subtotal?.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax {isQC ? "(GST + QST)" : "(GST)"}</span>
              <span>${order.tax?.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>
                {order.shipping === 0
                  ? "FREE"
                  : `$${order.shipping?.toFixed(2)}`}
              </span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${order.total?.toFixed(2)}</span>
            </div>
          </div>

          <div className="shipping-address-section">
            <h2>Address</h2>
            <div className="address-details">
              <p>
                {order.customer?.firstName} {order.customer?.lastName}
              </p>
              <p>{order.customer?.address}</p>
              <p>
                {order.customer?.city}, {order.customer?.state}{" "}
                {order.customer?.zipCode}
              </p>
              <p>
                <strong>Email:</strong> {order.customer?.email}
              </p>
              <p>
                <strong>Phone:</strong> {order.customer?.phone}
              </p>
            </div>
          </div>

          <div className="payment-method-section">
            <h2>Payment</h2>
            <div>
              {paymentMethodLabels[order.paymentMethod] || order.paymentMethod}
            </div>
          </div>
        </div>

        {/* Continue Shopping Button */}
        <button className="continue-btn" onClick={onContinueShopping}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
