import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob blob-1" />
          <div className="hero-blob blob-2" />
        </div>
        <div className="container hero-content">
          <div className="hero-tag">🌍 Community-Driven Lost & Found</div>
          <h1 className="hero-title">
            Lost Something?<br />
            <span>We'll Help You Find It.</span>
          </h1>
          <p className="hero-subtitle">
            Thirike connects people who've lost belongings with those who've found them —
            using location intelligence and community trust.
          </p>
          <div className="hero-cta">
            <Link to="/report-lost" className="btn btn-primary btn-lg">
              🔴 Report Lost Item
            </Link>
            <Link to="/report-found" className="btn btn-secondary btn-lg">
              🟢 Report Found Item
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>2,400+</strong><span>Items Reported</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>1,800+</strong><span>Items Reunited</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>50+</strong><span>Communities</span></div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Simple Process</div>
            <h2>How Thirike Works</h2>
            <p>Three simple steps to reconnect with your belongings</p>
          </div>

          <div className="steps-grid">
            {[
              {
                num: '01',
                icon: '📝',
                title: 'Report',
                desc: 'Submit a detailed report of your lost or found item with photos, description, and pin your location on the map.',
                color: '#EFF6FF',
                border: '#BFDBFE',
              },
              {
                num: '02',
                icon: '🔍',
                title: 'Match',
                desc: 'Our smart system compares reports using location radius, category, and item features to find potential matches.',
                color: '#F0FDF4',
                border: '#BBF7D0',
              },
              {
                num: '03',
                icon: '🤝',
                title: 'Reconnect',
                desc: 'Verify ownership securely and arrange to get your item back. For important documents, extra verification protects you.',
                color: '#FFFBEB',
                border: '#FDE68A',
              },
            ].map((step, i) => (
              <div key={i} className="step-card" style={{ '--bg': step.color, '--border': step.border }}>
                <div className="step-num">{step.num}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── QUICK ACTIONS ─── */}
      <section className="quick-actions">
        <div className="container">
          <div className="actions-grid">
            <div className="action-card lost-card">
              <div className="action-icon">😔</div>
              <h3>Did you lose something?</h3>
              <p>File a report with details and location. Our matching system will alert you when a found item matches.</p>
              <Link to="/report-lost" className="btn btn-primary">Report Lost Item →</Link>
            </div>
            <div className="action-card found-card">
              <div className="action-icon">😊</div>
              <h3>Did you find something?</h3>
              <p>Help someone get their belongings back. Report what you found and we'll connect you with the rightful owner.</p>
              <Link to="/report-found" className="btn btn-secondary">Report Found Item →</Link>
            </div>
            <div className="action-card browse-card">
              <div className="action-icon">🗺️</div>
              <h3>Browse all reports</h3>
              <p>Search through all lost and found reports in your area. Filter by category, date, and location.</p>
              <Link to="/dashboard" className="btn btn-outline">Browse Items →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST & SAFETY ─── */}
      <section className="trust-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Trust & Safety</div>
            <h2>Your Privacy is Our Priority</h2>
            <p>We've built Thirike with safety at its core</p>
          </div>

          <div className="trust-grid">
            {[
              { icon: '🔒', title: 'Encrypted Data', desc: 'All sensitive information like document IDs and secret identifiers are encrypted at rest.' },
              { icon: '🪪', title: 'Document Verification', desc: 'Important documents require OTP + verification questions before claims can be processed.' },
              { icon: '📍', title: 'Location Privacy', desc: 'Only the general area is shown publicly. Exact coordinates are shared only with verified matches.' },
              { icon: '🛡️', title: 'Ownership Proof', desc: 'Multi-layer verification ensures items go back to their rightful owners, not fraudsters.' },
            ].map((item, i) => (
              <div key={i} className="trust-card">
                <div className="trust-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="cta-banner">
        <div className="container cta-content">
          <h2>Start Searching Today</h2>
          <p>Join thousands of people helping each other in the community</p>
          <div className="hero-cta">
            <Link to="/report-lost" className="btn btn-light btn-lg">Report Lost Item</Link>
            <Link to="/report-found" className="btn btn-outline-light btn-lg">Report Found Item</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
