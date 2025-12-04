import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Footer from "./components/Footer";
import "./styles/App.css";

// Helper functions to initialize state from localStorage
const getInitialSearchQuery = () => {
  const saved = localStorage.getItem("searchQuery");
  return saved ? saved : "";
};

const getInitialSortBy = () => {
  const saved = localStorage.getItem("sortBy");
  return saved ? saved : "popularity";
};

const getInitialCategory = () => {
  const saved = localStorage.getItem("selectedCategory");
  return saved ? saved : "";
};

const getInitialPriceRange = () => {
  const saved = localStorage.getItem("priceRange");
  try {
    return saved ? JSON.parse(saved) : { min: 0, max: 10000 };
  } catch {
    return { min: 0, max: 10000 };
  }
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery());
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(getInitialSortBy());
  const [selectedCategory, setSelectedCategory] = useState(
    getInitialCategory()
  );
  const [priceRange, setPriceRange] = useState(getInitialPriceRange());
  const [cart, setCart] = useState([]);
  const [userReviews, setUserReviews] = useState({});
  const [lastOrder, setLastOrder] = useState(null);

  // Initialize state from localStorage on mount
  useEffect(() => {
    // Load user reviews from localStorage
    const savedReviews = localStorage.getItem("userReviews");
    if (savedReviews) {
      try {
        const parsedReviews = JSON.parse(savedReviews);
        setUserReviews(parsedReviews);
      } catch (error) {
        console.error("Failed to load reviews from localStorage:", error);
      }
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          setCart(parsedCart);
        }
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
      }
    }

    // Load last order from localStorage
    const savedOrder = localStorage.getItem("lastOrder");
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder);
        setLastOrder(parsedOrder);
      } catch (error) {
        console.error("Failed to load last order from localStorage:", error);
      }
    }
  }, []);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Persist search query to localStorage
  useEffect(() => {
    localStorage.setItem("searchQuery", searchQuery);
  }, [searchQuery]);

  // Persist sort preference to localStorage
  useEffect(() => {
    localStorage.setItem("sortBy", sortBy);
  }, [sortBy]);

  // Persist selected category to localStorage
  useEffect(() => {
    localStorage.setItem("selectedCategory", selectedCategory);
  }, [selectedCategory]);

  // Persist price range to localStorage
  useEffect(() => {
    localStorage.setItem("priceRange", JSON.stringify(priceRange));
  }, [priceRange]);

  // Persist user reviews to localStorage
  useEffect(() => {
    if (Object.keys(userReviews).length > 0) {
      localStorage.setItem("userReviews", JSON.stringify(userReviews));
    }
  }, [userReviews]);

  // Persist last order to localStorage
  useEffect(() => {
    if (lastOrder) {
      localStorage.setItem("lastOrder", JSON.stringify(lastOrder));
    }
  }, [lastOrder]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const addUserReview = (productId, review) => {
    const id = String(productId);
    setUserReviews((prevReviews) => {
      const productReviews = prevReviews[id] || [];
      const updatedReviews = {
        ...prevReviews,
        [id]: [...productReviews, review],
      };
      localStorage.setItem("userReviews", JSON.stringify(updatedReviews));
      return updatedReviews;
    });
  };

  const getProductReviews = (productId) => {
    return userReviews[String(productId)] || [];
  };

  const handleCheckout = (orderData) => {
    setLastOrder(orderData);
    clearCart();
    navigate(`/order-confirmation`);
  };

  return (
    <>
      <main className="app">
        {location.pathname !== "/checkout" && (
          <Navbar
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            cartItemCount={cartItemCount}
            onHomeClick={() => {
              setSearchQuery("");
              setSelectedCategory("");
              setPriceRange({ min: 0, max: 10000 });
              setCurrentPage(1);
              navigate("/");
            }}
          />
        )}
        <Routes>
          <Route
            path="/"
            element={
              <ProductList
                searchQuery={searchQuery}
                onProductClick={(productId) =>
                  navigate(`/product/${productId}`)
                }
                currentPage={currentPage}
                onPageChange={handlePageChange}
                sortBy={sortBy}
                onSortChange={handleSortChange}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                userReviews={userReviews}
                onAddToCart={addToCart}
              />
            }
          />
          <Route
            path="/product/:productId"
            element={
              <ProductDetail
                onAddToCart={addToCart}
                userReviews={userReviews}
                onAddReview={addUserReview}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                onRemove={removeFromCart}
                onUpdateQuantity={updateCartQuantity}
                onCheckout={() => navigate("/checkout")}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <Checkout
                cart={cart}
                onCheckout={handleCheckout}
                onCancel={() => navigate("/cart")}
              />
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <OrderConfirmation
                order={lastOrder}
                onContinueShopping={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                  setPriceRange({ min: 0, max: 10000 });
                  setCurrentPage(1);
                  navigate("/");
                }}
              />
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
