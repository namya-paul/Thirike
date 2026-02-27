import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LostForm from '../components/LostForm';
import './ReportPage.css';

const ReportLost = () => {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  if (submitted) {
    return (
      <div className="page report-page">
        <div className="container">
          <div className="success-card">
            <div className="success-icon">✅</div>
            <h2>Report Submitted!</h2>
            <p>Your lost item report has been posted. You'll be notified when a matching found item is reported in your area.</p>
            <div className="success-actions">
              <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                Browse All Reports
              </button>
              <button className="btn btn-outline" onClick={() => setSubmitted(false)}>
                Submit Another Report
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page report-page">
      <div className="container">
        <div className="page-header">
          <div className="page-badge lost-badge">🔴 Report Lost Item</div>
          <h1>I Lost Something</h1>
          <p>Fill in the details below. Be as specific as possible to improve matching chances.</p>
        </div>
        <LostForm onSuccess={() => setSubmitted(true)} />
      </div>
    </div>
  );
};

export default ReportLost;
