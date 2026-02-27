import React, { useState, useEffect } from 'react';
import ItemCard from '../components/ItemCard';
import { getItems } from '../services/api';
import './Dashboard.css';

const CATEGORIES = ['All', 'General Items', 'Important Documents', 'Electronics', 'Accessories', 'Others'];

const Dashboard = () => {
  const [items, setItems] = useState([]); // Ensure items is initialized as an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',      // all | lost | found
    category: 'All',
    search: '',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getItems();
      setItems(Array.isArray(data) ? data : []); // Ensure response is an array
    } catch {
      setError('Failed to load items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = Array.isArray(items) ? items.filter(item => {
    const matchType = filters.type === 'all' || item.type === filters.type;
    const matchCat = filters.category === 'All' || item.category === filters.category;
    const matchSearch = !filters.search ||
      item.itemName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.distinctiveFeatures?.toLowerCase().includes(filters.search.toLowerCase());
    return matchType && matchCat && matchSearch;
  }) : [];

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Browse Reports</h1>
          <p>Search through lost and found items in the community</p>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by item name or features..."
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            />
          </div>

          <div className="filter-tabs">
            {['all', 'lost', 'found'].map(t => (
              <button
                key={t}
                className={`filter-tab ${filters.type === t ? 'active' : ''}`}
                onClick={() => setFilters(f => ({ ...f, type: t }))}
              >
                {t === 'all' ? '📋 All' : t === 'lost' ? '🔴 Lost' : '🟢 Found'}
              </button>
            ))}
          </div>

          <select
            className="category-filter"
            value={filters.category}
            onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Results count */}
        <div className="results-info">
          {loading ? 'Loading...' : `${filtered.length} report${filtered.length !== 1 ? 's' : ''} found`}
        </div>

        {/* Grid */}
        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔎</div>
            <h3>No items found</h3>
            <p>Try adjusting your filters or be the first to report in this category.</p>
          </div>
        ) : (
          <div className="items-grid">
            {filtered.map(item => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
