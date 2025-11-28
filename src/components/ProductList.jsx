import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

export default function ProductList({ searchQuery }) {
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dummyjson.com/products?limit=0');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data.products);
        setSortedProducts(data.products);
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

    // Filter by search query
    if (searchQuery.trim()) {
      sorted = sorted.filter((product) => {
        const searchTerm = searchQuery.toLowerCase();
        const matchesTitle = product.title?.toLowerCase().includes(searchTerm);
        const matchesDescription = product.description?.toLowerCase().includes(searchTerm);
        const matchesCategory = product.category?.toLowerCase().includes(searchTerm);
        const matchesBrand = product.brand?.toLowerCase().includes(searchTerm);
        const matchesTags = product.tags?.some(tag => tag.toLowerCase().includes(searchTerm));
        
        return matchesTitle || matchesDescription || matchesCategory || matchesBrand || matchesTags;
      });
    }

    // Sort by selected option
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.meta?.createdAt) - new Date(a.meta?.createdAt));
        break;
      case 'popularity':
      default:
        sorted.sort((a, b) => b.rating - a.rating);
        break;
    }

    setSortedProducts(sorted);
  }, [sortBy, products, searchQuery]);

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
          <p className="header-subtitle">Browse our amazing selection of products</p>
        </div>
      </div>

      <div className="products-container">
        <div className="toolbar">
          <div className="toolbar-left">
            <span className="product-count">
              {sortedProducts.length} {sortedProducts.length === 1 ? 'Product' : 'Products'} 
              {searchQuery && ` found for "${searchQuery}"`}
            </span>
          </div>
          <div className="toolbar-right">
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
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
          <div className="products-grid">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
