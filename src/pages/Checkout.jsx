import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Checkout.css";

export default function Checkout({ cart, onCheckout, onCancel }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    paymentMethod: "credit-card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate totals with tax based on province/state
  const subtotal = cart.reduce((sum, item) => {
    const discountedPrice = item.price * (1 - item.discountPercentage / 100);
    return sum + discountedPrice * item.quantity;
  }, 0);

  // Calculate tax based on province/state
  const tax = useMemo(() => {
    const state = formData.state?.trim().toUpperCase() || "";
    // GST (5% Canada) always applies
    const gst = subtotal * 0.05;

    // QST (9.975% Quebec) only if Quebec is selected
    let qst = 0;
    if (state === "QC" || state === "QUEBEC") {
      qst = subtotal * 0.09975;
    }

    return gst + qst;
  }, [formData.state, subtotal]);

  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Invalid phone number";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";

    // Only validate card details if credit card is selected
    if (formData.paymentMethod === "credit-card") {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = "Card number is required";
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "Invalid card number (16 digits required)";
      }
      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = "Expiry date is required";
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = "Invalid format (MM/YY)";
      }
      if (!formData.cvv.trim()) {
        newErrors.cvv = "CVV is required";
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = "Invalid CVV (3-4 digits)";
      }
    }

    setErrors(newErrors);

    // Scroll to the first error field if validation fails
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus();
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\s/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatExpiryDate = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length >= 2) {
      return digits.slice(0, 2) + "/" + digits.slice(2, 4);
    }
    return digits;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData((prev) => ({ ...prev, cardNumber: formatted }));
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: "" }));
    }
  };

  const handleExpiryDateChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setFormData((prev) => ({ ...prev, expiryDate: formatted }));
    if (errors.expiryDate) {
      setErrors((prev) => ({ ...prev, expiryDate: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate order ID and create order
      const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const orderData = {
        orderId,
        date: new Date().toISOString(),
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        items: cart,
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        shipping: shipping,
        total: parseFloat(total.toFixed(2)),
        paymentMethod: formData.paymentMethod,
      };

      onCheckout(orderData);
    } catch (error) {
      console.error("Payment processing failed:", error);
      setErrors({ submit: "Payment processing failed. Please try again." });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some items before proceeding to checkout.</p>
          <button
            className="back-to-cart-btn"
            onClick={() => navigate("/cart")}
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Left Column - Form */}
        <div className="checkout-form-section">
          <h1>Checkout</h1>

          {errors.submit && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="checkout-form">
            {/* Shipping Information */}
            <fieldset className="form-fieldset">
              <legend className="form-legend">Shipping Information</legend>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`form-input ${errors.firstName ? "error" : ""}`}
                    placeholder="Your first name here"
                  />
                  {errors.firstName && (
                    <span className="field-error">{errors.firstName}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`form-input ${errors.lastName ? "error" : ""}`}
                    placeholder="Your last name here"
                  />
                  {errors.lastName && (
                    <span className="field-error">{errors.lastName}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? "error" : ""}`}
                  placeholder="Your email here"
                />
                {errors.email && (
                  <span className="field-error">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`form-input ${errors.phone ? "error" : ""}`}
                  placeholder="Your phone number here"
                />
                {errors.phone && (
                  <span className="field-error">{errors.phone}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="address">Street Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`form-input ${errors.address ? "error" : ""}`}
                  placeholder="Your street address here"
                />
                {errors.address && (
                  <span className="field-error">{errors.address}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`form-input ${errors.city ? "error" : ""}`}
                    placeholder="Your city here"
                  />
                  {errors.city && (
                    <span className="field-error">{errors.city}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="state">Province *</label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`form-input ${errors.state ? "error" : ""}`}
                  >
                    <option value="">Select a province</option>
                    <option value="AB">Alberta (AB)</option>
                    <option value="BC">British Columbia (BC)</option>
                    <option value="MB">Manitoba (MB)</option>
                    <option value="NB">New Brunswick (NB)</option>
                    <option value="NL">Newfoundland and Labrador (NL)</option>
                    <option value="NS">Nova Scotia (NS)</option>
                    <option value="NT">Northwest Territories (NT)</option>
                    <option value="NU">Nunavut (NU)</option>
                    <option value="ON">Ontario (ON)</option>
                    <option value="PE">Prince Edward Island (PE)</option>
                    <option value="QC">Quebec (QC)</option>
                    <option value="SK">Saskatchewan (SK)</option>
                    <option value="YT">Yukon (YT)</option>
                  </select>
                  {errors.state && (
                    <span className="field-error">{errors.state}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="zipCode">ZIP Code *</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={`form-input ${errors.zipCode ? "error" : ""}`}
                    placeholder="Your ZIP/postal code"
                  />
                  {errors.zipCode && (
                    <span className="field-error">{errors.zipCode}</span>
                  )}
                </div>
              </div>
            </fieldset>

            {/* Payment Information */}
            <fieldset className="form-fieldset">
              <legend className="form-legend">Payment Method</legend>

              <div className="form-group">
                <label>Select Payment Method *</label>
                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit-card"
                      checked={formData.paymentMethod === "credit-card"}
                      onChange={handleChange}
                    />
                    <span className="payment-label">💳 Credit Card</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === "paypal"}
                      onChange={handleChange}
                    />
                    <span className="payment-label">🅿️ PayPal</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank-transfer"
                      checked={formData.paymentMethod === "bank-transfer"}
                      onChange={handleChange}
                    />
                    <span className="payment-label">🏦 Bank Transfer</span>
                  </label>
                </div>
              </div>

              {formData.paymentMethod === "credit-card" && (
                <>
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number *</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      className={`form-input ${
                        errors.cardNumber ? "error" : ""
                      }`}
                      placeholder="Your 16-digit card number"
                      maxLength="19"
                    />
                    {errors.cardNumber && (
                      <span className="field-error">{errors.cardNumber}</span>
                    )}
                    <p className="field-hint">
                      We accept Visa, Mastercard, and American Express
                    </p>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expiryDate">Expiry Date *</label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleExpiryDateChange}
                        className={`form-input ${
                          errors.expiryDate ? "error" : ""
                        }`}
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                      {errors.expiryDate && (
                        <span className="field-error">{errors.expiryDate}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="cvv">CVV *</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        className={`form-input ${errors.cvv ? "error" : ""}`}
                        placeholder="Your 3-4 digit CVV"
                        maxLength="4"
                      />
                      {errors.cvv && (
                        <span className="field-error">{errors.cvv}</span>
                      )}
                    </div>
                  </div>
                </>
              )}

              {formData.paymentMethod === "paypal" && (
                <div className="payment-info-message">
                  <p>
                    You will be redirected to PayPal to complete your payment
                    securely.
                  </p>
                </div>
              )}

              {formData.paymentMethod === "bank-transfer" && (
                <div className="payment-info-message">
                  <p>
                    Bank transfer details will be provided after you complete
                    your order.
                  </p>
                </div>
              )}
            </fieldset>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Complete Purchase"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column - Order Summary */}
        <div className="checkout-summary-section">
          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="summary-items">
              {cart.map((item) => {
                const discountedPrice =
                  item.price * (1 - item.discountPercentage / 100);
                const itemTotal = discountedPrice * item.quantity;

                return (
                  <div key={item.id} className="summary-item">
                    <div className="item-image">
                      <img src={item.thumbnail} alt={item.title} />
                    </div>
                    <div className="item-details">
                      <div className="item-title">{item.title}</div>
                      <div className="item-quantity">Qty: {item.quantity}</div>
                    </div>
                    <div className="item-price">${itemTotal.toFixed(2)}</div>
                  </div>
                );
              })}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-calculation">
              <div className="calc-row">
                <span className="calc-label">Subtotal:</span>
                <span className="calc-value">${subtotal.toFixed(2)}</span>
              </div>
              <div className="calc-row">
                <span className="calc-label">
                  Tax:
                  {formData.state?.trim().toUpperCase() === "QC" ||
                  formData.state?.trim().toUpperCase() === "QUEBEC" ? (
                    <span className="tax-breakdown">
                      {" "}
                      (GST 5% + QST 9.975%)
                    </span>
                  ) : (
                    <span className="tax-breakdown"> (GST 5%)</span>
                  )}
                </span>
                <span className="calc-value">${tax.toFixed(2)}</span>
              </div>
              <div className="calc-row">
                <span className="calc-label">Shipping:</span>
                <span className="calc-value">
                  {shipping === 0 ? (
                    <>
                      <span className="shipping-free">FREE</span>
                    </>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              {shipping === 0 && (
                <div className="free-shipping-notice">
                  ✓ Free shipping on orders over $100
                </div>
              )}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span className="total-label">Total:</span>
              <span className="total-value">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
