import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById, claimItem } from '../services/api';
import './ItemDetail.css';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimMode, setClaimMode] = useState(false);
  const [claimData, setClaimData] = useState({ answer: '', email: '', phone: '' });
  const [claimError, setClaimError] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getItemById(id);
        setItem(data);
      } catch {
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleClaim = async (e) => {
    e.preventDefault();
    try {
      await claimItem(id, claimData);
      setClaimSuccess(true);
    } catch (err) {
      setClaimError(err.response?.data?.message || 'Claim verification failed.');
    }
  };

  if (loading) return <div className="detail-page"><div className="container"><p>Loading...</p></div></div>;
  if (!item) return null;

  const isLost = item.type === 'lost';
  const fallback = `https://via.placeholder.com/600x400/EFF6FF/1E3A8A?text=${encodeURIComponent(item.itemName)}`;

  return (
    <div className="detail-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back to results</button>

        <div className="detail-grid">
          {/* Image */}
          <div className="detail-image">
            <img
              src={item.imageUrl ? `http://localhost:5000/${item.imageUrl}` : fallback}
              alt={item.itemName}
              onError={(e) => { e.target.src = fallback; }}
            />
            <span className={`detail-badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
              {isLost ? '🔴 Lost Item' : '🟢 Found Item'}
            </span>
          </div>

          {/* Info */}
          <div className="detail-info">
            <div className="detail-category">{item.category}</div>
            <h1 className="detail-title">{item.itemName}</h1>

            <div className="detail-fields">
              {item.color && <div className="detail-field"><span>Color</span><strong>{item.color}</strong></div>}
              {item.brand && <div className="detail-field"><span>Brand</span><strong>{item.brand}</strong></div>}
              {item.height && <div className="detail-field"><span>Height</span><strong>{item.height}</strong></div>}
              {item.width && <div className="detail-field"><span>Width</span><strong>{item.width}</strong></div>}
              {item.size && <div className="detail-field"><span>Size</span><strong>{item.size}</strong></div>}
              <div className="detail-field">
                <span>Date</span>
                <strong>{new Date(item.dateLostOrFound || item.dateFoundOrFound).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
              </div>
              <div className="detail-field">
                <span>Location</span>
                <strong>📍 {item.locationName || 'Location set'}</strong>
              </div>
            </div>

            {item.distinctiveFeatures && (
              <div className="detail-section">
                <h4>Distinctive Features</h4>
                <p>{item.distinctiveFeatures}</p>
              </div>
            )}

            {item.handedToPolice && (
              <div className="alert alert-info">
                🚔 This item has been handed to: <strong>{item.policeStation || 'Local police'}</strong>
              </div>
            )}

            {/* Claim button */}
            {!claimMode && !claimSuccess && (
              <button className="btn btn-primary btn-lg claim-btn" onClick={() => setClaimMode(true)}>
                {isLost ? '📩 Contact Reporter' : '✋ Claim This Item'}
              </button>
            )}

            {/* Claim form */}
            {claimMode && !claimSuccess && (
              <div className="claim-form">
                <h4>🔐 Verify Your Identity</h4>
                {item.verificationQuestion && (
                  <p className="verification-q">Q: {item.verificationQuestion}</p>
                )}
                {claimError && <div className="alert alert-error">{claimError}</div>}
                <form onSubmit={handleClaim}>
                  {item.verificationQuestion && (
                    <div className="form-group">
                      <label>Your Answer</label>
                      <input type="password" value={claimData.answer}
                        onChange={e => setClaimData(d => ({ ...d, answer: e.target.value }))}
                        placeholder="Answer the verification question" required />
                    </div>
                  )}
                  <div className="form-group">
                    <label>Your Email *</label>
                    <input type="email" value={claimData.email}
                      onChange={e => setClaimData(d => ({ ...d, email: e.target.value }))}
                      placeholder="your@email.com" required />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" value={claimData.phone}
                      onChange={e => setClaimData(d => ({ ...d, phone: e.target.value }))}
                      placeholder="+91 9XXXXXXXXX" />
                  </div>
                  <div className="claim-actions">
                    <button type="submit" className="btn btn-primary">Submit Claim</button>
                    <button type="button" className="btn btn-outline" onClick={() => setClaimMode(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {claimSuccess && (
              <div className="alert alert-success">
                ✅ Claim submitted! The reporter will contact you within 24 hours.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
