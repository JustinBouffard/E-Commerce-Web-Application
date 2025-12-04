import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";

export default function ProductList({
  searchQuery,
  onProductClick,
  currentPage,
  onPageChange,
  sortBy,
  onSortChange,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  userReviews,
  onAddToCart,
}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const productsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://dummyjson.com/products?limit=0");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.products);
        setSortedProducts(data.products);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(data.products.map((p) => p.category)),
        ].sort();
        setCategories(uniqueCategories);

        setError(null);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let sorted = [...products];

    // Filter by category first
    if (selectedCategory) {
      sorted = sorted.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filter by price range
    sorted = sorted.filter((product) => {
      const discountedPrice =
        product.price * (1 - product.discountPercentage / 100);
      return (
        discountedPrice >= priceRange.min && discountedPrice <= priceRange.max
      );
    });

    // Filter by search query
    if (searchQuery.trim()) {
      sorted = sorted.filter((product) => {
        const searchTerm = searchQuery.toLowerCase();
        const matchesTitle = product.title?.toLowerCase().includes(searchTerm);
        const matchesDescription = product.description
          ?.toLowerCase()
          .includes(searchTerm);
        const matchesCategory = product.category
          ?.toLowerCase()
          .includes(searchTerm);
        const matchesBrand = product.brand?.toLowerCase().includes(searchTerm);
        const matchesTags = product.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm)
        );

        return (
          matchesTitle ||
          matchesDescription ||
          matchesCategory ||
          matchesBrand ||
          matchesTags
        );
      });
    }

    // Sort by selected option
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        sorted.sort(
          (a, b) => new Date(b.meta?.createdAt) - new Date(a.meta?.createdAt)
        );
        break;
      case "popularity":
      default:
        sorted.sort((a, b) => b.rating - a.rating);
        break;
    }

    setSortedProducts(sorted);
  }, [sortBy, products, searchQuery, selectedCategory, priceRange]);

  // Reset to first page when search query, sort, category, or price changes
  useEffect(() => {
    onPageChange(1);
  }, [searchQuery, sortBy, selectedCategory, priceRange]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="error">Error loading products: {error}</div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <div className="header-content">
          <h1>Our Collection</h1>
          <p className="header-subtitle">
            Browse our amazing selection of products
          </p>
        </div>
      </div>

      <div className="products-container">
        <div className="toolbar">
          <div className="toolbar-left">
            <span className="product-count">
              {sortedProducts.length}{" "}
              {sortedProducts.length === 1 ? "Product" : "Products"}
              {searchQuery && ` found for "${searchQuery}"`}
            </span>
            <div className="price-range-container">
              <label className="price-label">💲 Price:</label>
              <div className="price-range-inputs">
                <span className="price-prefix">$</span>
                <input
                  type="number"
                  className="price-input"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    onPriceRangeChange({
                      ...priceRange,
                      min: parseFloat(e.target.value) || 0,
                    })
                  }
                  min="0"
                />
                <span className="price-separator">–</span>
                <span className="price-prefix">$</span>
                <input
                  type="number"
                  className="price-input"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    onPriceRangeChange({
                      ...priceRange,
                      max: parseFloat(e.target.value) || 10000,
                    })
                  }
                  min="0"
                />
              </div>
            </div>
          </div>
          <div className="toolbar-right">
            <select
              className="category-select"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="popularity">Sort by: Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {sortedProducts.length === 0 ? (
          <div className="no-products">
            <p>No products found. Try a different search.</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={onProductClick}
                  userReviews={userReviews}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>

                <div className="pagination-info">
                  Page {currentPage} of {totalPages}
                </div>

                <button
                  className="pagination-btn"
                  onClick={() =>
                    onPageChange(Math.min(currentPage + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
