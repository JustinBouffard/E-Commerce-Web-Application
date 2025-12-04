import { useNavigate } from "react-router-dom";

export default function Navbar({
  searchQuery,
  onSearchChange,
  cartItemCount,
  onHomeClick,
}) {
  const navigate = useNavigate();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      navigate("/");
    }
  };

  const handleSearchChange = (value) => {
    onSearchChange(value);
  };

  const handleCartButtonClick = () => {
    navigate("/cart");
  };

  const handleHome = () => {
    onHomeClick();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <button
            className="brand-logo-btn"
            onClick={handleHome}
            title="Go to home page"
          >
            <h1 className="brand-logo">ShopHub</h1>
          </button>
        </div>

        <div className="navbar-center">
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        <div className="navbar-right">
          <button
            className="nav-icon-btn cart-btn"
            title="Shopping Cart"
            onClick={handleCartButtonClick}
          >
            <span>🛒</span>
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
