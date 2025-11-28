export default function Navbar({ searchQuery, onSearchChange }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 className="brand-logo">ShopHub</h1>
        </div>
        
        <div className="navbar-center">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="navbar-right">
          <button className="nav-icon-btn" title="Account">
            <span>👤</span>
          </button>
          <button className="nav-icon-btn" title="Favorites">
            <span>❤️</span>
          </button>
          <button className="nav-icon-btn cart-btn" title="Shopping Cart">
            <span>🛒</span>
            <span className="cart-badge">0</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
