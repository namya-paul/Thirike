import React, { useState } from 'react';
import MapPicker from './MapPicker';
import { reportLostItem } from '../services/api';
import './ItemForm.css';

const CATEGORIES = ['General Items', 'Important Documents', 'Electronics', 'Accessories', 'Others'];
const IMPORTANT_DOC_TYPES = ['Aadhar Card', 'PAN Card', 'Passport', 'Driving License', 'Voter ID', 'Other Document'];

const LostForm = ({ onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpInput, setOtpInput] = useState('');

  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    color: '',
    brand: '',
    height: '',
    width: '',
    size: '',
    distinctiveFeatures: '',
    secretIdentifier: '',
    dateLostOrFound: '',
    timeLost: '',
    lat: null,
    lng: null,
    locationName: '',
    radius: 5,
    email: '',
    phone: '',
    docType: '',
    maskedId: '',
    verificationQuestion: '',
    verificationAnswer: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const isImportantDoc = formData.category === 'Important Documents';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = ({ lat, lng, locationName }) => {
    setFormData(prev => ({ ...prev, lat, lng, locationName }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email && !formData.phone) {
      setError('Please enter email or phone for OTP verification.');
      return;
    }
    try {
      // In real app, call API to send OTP
      setOtpSent(true);
      setError('');
    } catch {
      setError('Failed to send OTP. Try again.');
    }
  };

  const handleVerifyOtp = () => {
    // Simulate OTP verification (replace with real API call)
    if (otpInput === '123456') {
      setOtpVerified(true);
      setError('');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.lat || !formData.lng) {
      setError('Please select a location on the map.');
      return;
    }
    if (isImportantDoc && !otpVerified) {
      setError('Please complete OTP verification for Important Documents.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== null && v !== '') data.append(k, v);
      });
      data.append('type', 'lost');
      if (imageFile) data.append('image', imageFile);

      await reportLostItem(data);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return formData.itemName && formData.category;
    if (step === 2) return formData.lat && formData.lng && formData.dateLostOrFound;
    return true;
  };

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      {/* Step indicators */}
      <div className="form-steps">
        {['Item Details', 'Location & Time', 'Review & Submit'].map((s, i) => (
          <div key={i} className={`form-step ${step === i + 1 ? 'active' : ''} ${step > i + 1 ? 'done' : ''}`}>
            <div className="step-dot">{step > i + 1 ? '✓' : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      {/* ─── STEP 1: Item Details ─── */}
      {step === 1 && (
        <div className="form-section animate-in">
          <h3>Describe the Lost Item</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Item Name *</label>
              <input name="itemName" value={formData.itemName} onChange={handleChange}
                placeholder="e.g. Black Leather Wallet" required />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {isImportantDoc && (
            <div className="doc-warning">
              🔒 <strong>Important Documents</strong> require identity verification. Extra security measures apply.
              <div className="form-row" style={{ marginTop: 12 }}>
                <div className="form-group">
                  <label>Document Type</label>
                  <select name="docType" value={formData.docType} onChange={handleChange}>
                    <option value="">Select document type</option>
                    {IMPORTANT_DOC_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Last 4 digits of ID (masked)</label>
                  <input name="maskedId" value={formData.maskedId} onChange={handleChange}
                    placeholder="e.g. XXXX-XXXX-1234" maxLength={4} />
                  <small>Only last 4 digits visible to you — stored encrypted</small>
                </div>
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Color</label>
              <input name="color" value={formData.color} onChange={handleChange} placeholder="e.g. Black, Brown" />
            </div>
            <div className="form-group">
              <label>Brand (optional)</label>
              <input name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Samsung, Samsonite" />
            </div>
          </div>

          <div className="form-row three-col">
            <div className="form-group">
              <label>Height</label>
              <input name="height" value={formData.height} onChange={handleChange} placeholder="e.g. 12cm" />
            </div>
            <div className="form-group">
              <label>Width</label>
              <input name="width" value={formData.width} onChange={handleChange} placeholder="e.g. 8cm" />
            </div>
            <div className="form-group">
              <label>Size</label>
              <input name="size" value={formData.size} onChange={handleChange} placeholder="e.g. Medium" />
            </div>
          </div>

          <div className="form-group">
            <label>Distinctive Features</label>
            <textarea name="distinctiveFeatures" value={formData.distinctiveFeatures} onChange={handleChange}
              placeholder="Scratches, stickers, dents, marks..." />
          </div>

          <div className="form-group">
            <label>Secret Identifier 🔒</label>
            <input name="secretIdentifier" value={formData.secretIdentifier} onChange={handleChange}
              placeholder="Something only you know (stored encrypted, for ownership proof)" />
            <small>This will be used to verify the true owner. Never shown publicly.</small>
          </div>

          {isImportantDoc && (
            <div className="form-row">
              <div className="form-group">
                <label>Verification Question</label>
                <input name="verificationQuestion" value={formData.verificationQuestion} onChange={handleChange}
                  placeholder="e.g. What is your mother's maiden name?" />
              </div>
              <div className="form-group">
                <label>Answer (encrypted)</label>
                <input name="verificationAnswer" value={formData.verificationAnswer} onChange={handleChange}
                  placeholder="Your answer..." type="password" />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Upload Image (optional)</label>
            <div className="image-upload-area" onClick={() => document.getElementById('lost-img').click()}>
              {imagePreview
                ? <img src={imagePreview} alt="Preview" className="img-preview" />
                : <div className="upload-placeholder">📷 Click to upload image</div>
              }
            </div>
            <input id="lost-img" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          </div>
        </div>
      )}

      {/* ─── STEP 2: Location & Time ─── */}
      {step === 2 && (
        <div className="form-section animate-in">
          <h3>Where & When did you lose it?</h3>

          <div className="form-group">
            <label>Date Lost *</label>
            <input type="date" name="dateLostOrFound" value={formData.dateLostOrFound}
              onChange={handleChange} required max={new Date().toISOString().split('T')[0]} />
          </div>

          <div className="form-group">
            <label>Approximate Time</label>
            <input type="time" name="timeLost" value={formData.timeLost} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Search Radius: <strong>{formData.radius} km</strong></label>
            <input type="range" name="radius" min="1" max="20" value={formData.radius}
              onChange={handleChange} className="radius-slider" />
            <div className="radius-labels"><span>1 km</span><span>20 km</span></div>
          </div>

          <div className="form-group">
            <label>Pin Location on Map *</label>
            <MapPicker onLocationChange={handleLocationChange} radius={parseInt(formData.radius)} />
          </div>

          {isImportantDoc && (
            <div className="otp-section">
              <h4>🔐 Identity Verification Required</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 9XXXXXXXXX" />
                </div>
              </div>

              {!otpSent ? (
                <button type="button" className="btn btn-primary" onClick={handleSendOtp}>
                  📱 Send OTP
                </button>
              ) : !otpVerified ? (
                <div className="otp-verify">
                  <input value={otpInput} onChange={e => setOtpInput(e.target.value)}
                    placeholder="Enter 6-digit OTP" maxLength={6} className="otp-input" />
                  <button type="button" className="btn btn-secondary" onClick={handleVerifyOtp}>
                    Verify OTP
                  </button>
                  <p className="otp-hint">Demo OTP: 123456</p>
                </div>
              ) : (
                <div className="alert alert-success">✅ Identity verified successfully!</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── STEP 3: Review ─── */}
      {step === 3 && (
        <div className="form-section animate-in">
          <h3>Review Your Report</h3>
          <div className="review-grid">
            <div className="review-item"><span>Item</span><strong>{formData.itemName}</strong></div>
            <div className="review-item"><span>Category</span><strong>{formData.category}</strong></div>
            {formData.color && <div className="review-item"><span>Color</span><strong>{formData.color}</strong></div>}
            {formData.brand && <div className="review-item"><span>Brand</span><strong>{formData.brand}</strong></div>}
            <div className="review-item"><span>Date Lost</span><strong>{formData.dateLostOrFound}</strong></div>
            <div className="review-item"><span>Search Radius</span><strong>{formData.radius} km</strong></div>
            <div className="review-item full"><span>Location</span><strong>{formData.locationName || 'Pin set on map'}</strong></div>
          </div>

          {imagePreview && (
            <div className="form-group">
              <label>Uploaded Image</label>
              <img src={imagePreview} alt="Preview" className="img-preview" />
            </div>
          )}

          <div className="alert alert-info">
            ℹ️ Your report will be visible to community members in the selected area. Sensitive details remain private.
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="form-nav">
        {step > 1 && (
          <button type="button" className="btn btn-outline" onClick={() => setStep(s => s - 1)}>
            ← Back
          </button>
        )}
        {step < 3 ? (
          <button type="button" className="btn btn-primary" onClick={() => setStep(s => s + 1)}
            disabled={!canProceed()}>
            Next Step →
          </button>
        ) : (
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳ Submitting...' : '🔴 Submit Lost Report'}
          </button>
        )}
      </div>
    </form>
  );
};

export default LostForm;
