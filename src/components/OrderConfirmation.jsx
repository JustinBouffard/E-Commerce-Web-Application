import { useParams } from "react-router-dom";
import "./OrderConfirmation.css";

export default function OrderConfirmation({ order, onContinueShopping }) {
  const { orderId } = useParams();

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
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase. We're preparing your order.</p>
        </div>

        {/* Main Content */}
        <div className="confirmation-content">
          {/* Order Info */}
          <div className="order-info-section">
            <div className="info-card">
              <h2>Order Number</h2>
              <p className="order-number">{order.orderId}</p>
              <p className="order-date">
                {new Date(order.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="info-card">
              <h2>Estimated Delivery</h2>
              <p className="delivery-date">
                {new Date(
                  new Date(order.date).getTime() + 5 * 24 * 60 * 60 * 1000
                ).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="delivery-method">
                Standard Shipping (5-7 business days)
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="customer-info-section">
            <h2 className="section-title">Shipping To</h2>
            <div className="customer-details">
              <p className="customer-name">
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <p>{order.customer.address}</p>
              <p>
                {order.customer.city}, {order.customer.state}{" "}
                {order.customer.zipCode}
              </p>
              <p className="customer-contact">
                Email:{" "}
                <a href={`mailto:${order.customer.email}`}>
                  {order.customer.email}
                </a>
              </p>
              <p className="customer-contact">Phone: {order.customer.phone}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="order-items-section">
            <h2 className="section-title">Order Items</h2>
            <div className="items-list">
              {order.items.map((item) => {
                const discountedPrice =
                  item.price * (1 - item.discountPercentage / 100);
                const itemTotal = discountedPrice * item.quantity;

                return (
                  <div key={item.id} className="order-item">
                    <div className="item-image">
                      <img src={item.thumbnail} alt={item.title} />
                    </div>
                    <div className="item-details">
                      <h3 className="item-title">{item.title}</h3>
                      <p className="item-brand">{item.brand}</p>
                      <div className="item-specs">
                        <span className="spec">Quantity: {item.quantity}</span>
                        <span className="spec">
                          ${discountedPrice.toFixed(2)} each
                        </span>
                      </div>
                    </div>
                    <div className="item-total">${itemTotal.toFixed(2)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary-section">
            <h2 className="section-title">Order Summary</h2>
            <div className="summary-box">
              <div className="summary-row">
                <span className="summary-label">Subtotal:</span>
                <span className="summary-value">
                  ${order.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Tax:</span>
                <span className="summary-value">${order.tax.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Shipping:</span>
                <span className="summary-value">
                  {order.shipping === 0 ? (
                    <span className="free-shipping">FREE</span>
                  ) : (
                    `$${order.shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total-row">
                <span className="summary-label">Total Amount Paid:</span>
                <span className="summary-value">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="whats-next-section">
            <h2 className="section-title">What's Next?</h2>
            <div className="steps-list">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Order Confirmation</h3>
                  <p>
                    A confirmation email has been sent to {order.customer.email}
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Processing</h3>
                  <p>
                    We're preparing your order for shipment. You'll receive a
                    tracking number via email within 24 hours.
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Shipment</h3>
                  <p>
                    Your package will be shipped and should arrive by{" "}
                    {new Date(
                      new Date(order.date).getTime() + 5 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="confirmation-actions">
            <button className="continue-btn" onClick={onContinueShopping}>
              Continue Shopping
            </button>
            <button className="track-btn">Track Order</button>
          </div>
        </div>
      </div>
    </div>
  );
}
