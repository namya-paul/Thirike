import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon-sm">T</div>
              <span>Thirike</span>
            </div>
            <p>A community-driven Lost & Found platform. Helping people reconnect with their belongings using location intelligence.</p>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <Link to="/report-lost">Report Lost Item</Link>
            <Link to="/report-found">Report Found Item</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <a href="#about">About Us</a>
            <a href="#contact">Contact</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <a href="mailto:hello@thirike.com">hello@thirike.com</a>
            <a href="#faq">FAQ</a>
            <a href="#safety">Safety Tips</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Thirike. All rights reserved.</p>
          <p className="footer-made">Made with ❤️ for the community</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
