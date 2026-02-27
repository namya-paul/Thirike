import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FoundForm from '../components/FoundForm';
import './ReportPage.css';

const ReportFound = () => {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  if (submitted) {
    return (
      <div className="page report-page">
        <div className="container">
          <div className="success-card">
            <div className="success-icon">🎉</div>
            <h2>Thank You for Helping!</h2>
            <p>Your found item report is live. The rightful owner will be notified and can contact you securely through our platform.</p>
            <div className="success-actions">
              <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
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
          <div className="page-badge found-badge">🟢 Report Found Item</div>
          <h1>I Found Something</h1>
          <p>Thank you for taking the time to report. Describe what you found and help reunite it with its owner.</p>
        </div>
        <FoundForm onSuccess={() => setSubmitted(true)} />
      </div>
    </div>
  );
};

export default ReportFound;
