import React, { useState } from 'react';
import MapPicker from './MapPicker';
import { reportFoundItem } from '../services/api';
import './ItemForm.css';
const sanitizePayload = (data) => {
  return {
    ...data,
    locationName: data.locationName || '', // Replace undefined with an empty string
    finderPhone: data.finderPhone.trim(), // Remove extra spaces
    distinctiveFeatures: data.distinctiveFeatures || '',
    policeStation: data.policeStation || '',
    height: data.height || '',
    width: data.width || '',
    size: data.size || '',
  };
};
const CATEGORIES = ['General Items', 'Important Documents', 'Electronics', 'Accessories', 'Others'];

const FoundForm = ({ onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    color: '',
    brand: '',
    height: '',
    width: '',
    size: '',
    distinctiveFeatures: '',
    dateFoundOrFound: '',
    timeFound: '',
    lat: null,
    lng: null,
    locationName: '',
    radius: 5,
    finderEmail: '',
    finderPhone: '',
    handedToPolice: false,
    policeStation: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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

  const handleSubmit = async (e) => {
  e.preventDefault();
  const sanitizedData = sanitizePayload(formData); // Sanitize the payload
  console.log('Submitting', sanitizedData);

  // Validate required fields
  if (!sanitizedData.itemName || !sanitizedData.category) {
    setError('Item name and category are required.');
    return;
  }
  if (!sanitizedData.lat || !sanitizedData.lng) {
    setError('Please select a location on the map.');
    return;
  }
  if (!sanitizedData.dateFoundOrFound) {
    setError('Date found is required.');
    return;
  }
  if (!sanitizedData.finderEmail) {
    setError('Finder email is required.');
    return;
  }

  setLoading(true);
  setError('');
  try {
    const data = new FormData();
    Object.entries(sanitizedData).forEach(([k, v]) => {
      if (v !== null && v !== '') data.append(k, v);
    });
    data.append('type', 'found');
    if (imageFile) data.append('image', imageFile);

    await reportFoundItem(data);
    onSuccess();
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to submit. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const canProceed = () => {
    if (step === 1) return formData.itemName && formData.category;
    if (step === 2) return formData.lat && formData.lng && formData.dateFoundOrFound;
    return true;
  };

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      {/* Step indicators */}
      <div className="form-steps">
        {['Item Details', 'Location & Time', 'Contact & Submit'].map((s, i) => (
          <div key={i} className={`form-step ${step === i + 1 ? 'active' : ''} ${step > i + 1 ? 'done' : ''}`}>
            <div className="step-dot">{step > i + 1 ? '✓' : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      {/* ─── STEP 1 ─── */}
      {step === 1 && (
        <div className="form-section animate-in">
          <h3>Describe the Found Item</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Item Name *</label>
              <input name="itemName" value={formData.itemName} onChange={handleChange}
                placeholder="e.g. Blue Backpack" required />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Color</label>
              <input name="color" value={formData.color} onChange={handleChange} placeholder="e.g. Blue, Silver" />
            </div>
            <div className="form-group">
              <label>Brand (if visible)</label>
              <input name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Apple, Nike" />
            </div>
          </div>

          <div className="form-row three-col">
            <div className="form-group">
              <label>Height</label>
              <input name="height" value={formData.height} onChange={handleChange} placeholder="e.g. 30cm" />
            </div>
            <div className="form-group">
              <label>Width</label>
              <input name="width" value={formData.width} onChange={handleChange} placeholder="e.g. 20cm" />
            </div>
            <div className="form-group">
              <label>Size</label>
              <input name="size" value={formData.size} onChange={handleChange} placeholder="e.g. Large" />
            </div>
          </div>

          <div className="form-group">
            <label>Distinctive Features</label>
            <textarea name="distinctiveFeatures" value={formData.distinctiveFeatures} onChange={handleChange}
              placeholder="Any visible marks, stickers, condition of the item..." />
          </div>

          <div className="found-notice">
            💚 Thank you for being a good Samaritan! Do not reveal sensitive info about documents found publicly.
          </div>

          <div className="form-group">
            <label>Upload Image *</label>
            <div className="image-upload-area" onClick={() => document.getElementById('found-img').click()}>
              {imagePreview
                ? <img src={imagePreview} alt="Preview" className="img-preview" />
                : <div className="upload-placeholder">📷 Click to upload image of found item</div>
              }
            </div>
            <input id="found-img" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          </div>
        </div>
      )}

      {/* ─── STEP 2 ─── */}
      {step === 2 && (
        <div className="form-section animate-in">
          <h3>Where & When did you find it?</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Date Found *</label>
              <input type="date" name="dateFoundOrFound" value={formData.dateFoundOrFound}
                onChange={handleChange} required max={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="form-group">
              <label>Approximate Time</label>
              <input type="time" name="timeFound" value={formData.timeFound} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Location Radius: <strong>{formData.radius} km</strong></label>
            <input type="range" name="radius" min="1" max="20" value={formData.radius}
              onChange={handleChange} className="radius-slider" />
            <div className="radius-labels"><span>1 km</span><span>20 km</span></div>
          </div>

          <div className="form-group">
            <label>Pin the Location on Map *</label>
            <MapPicker
  value={
    formData.lat && formData.lng
      ? {
          lat: formData.lat,
          lng: formData.lng,
          address: formData.locationName,
        }
      : null
  }
  onChange={handleLocationChange}
  radius={parseInt(formData.radius)}
/>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input type="checkbox" name="handedToPolice" checked={formData.handedToPolice} onChange={handleChange} />
              I have handed this item to the police / authority
            </label>
          </div>

          {formData.handedToPolice && (
            <div className="form-group">
              <label>Police Station / Authority Name</label>
              <input name="policeStation" value={formData.policeStation} onChange={handleChange}
                placeholder="e.g. Kozhikode Town Police Station" />
            </div>
          )}
        </div>
      )}

      {/* ─── STEP 3 ─── */}
      {step === 3 && (
        <div className="form-section animate-in">
          <h3>Your Contact Details</h3>

          <div className="alert alert-info">
            ℹ️ Your contact details are kept private. The owner will contact you through our platform.
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="finderEmail" value={formData.finderEmail} onChange={handleChange}
                placeholder="your@email.com" required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" name="finderPhone" value={formData.finderPhone} onChange={handleChange}
                placeholder="+91 9XXXXXXXXX" />
            </div>
          </div>

          <div className="review-grid">
            <div className="review-item"><span>Item</span><strong>{formData.itemName}</strong></div>
            <div className="review-item"><span>Category</span><strong>{formData.category}</strong></div>
            <div className="review-item"><span>Date Found</span><strong>{formData.dateFoundOrFound}</strong></div>
            <div className="review-item full"><span>Location</span><strong>{formData.locationName || 'Pin set on map'}</strong></div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="form-nav">
        {step > 1 && (
          <button type="button" className="btn btn-outline" onClick={() => setStep(s => s - 1)}>
            ← Back
          </button>
        )}
        {step < 3 ? (
          <button type="button" className="btn btn-secondary" onClick={() => setStep(s => s + 1)}
            disabled={!canProceed()}>
            Next Step →
          </button>
        ) : (
          <button type="submit" className="btn btn-secondary" disabled={loading}>
            {loading ? '⏳ Submitting...' : '🟢 Submit Found Report'}
          </button>
        )}
      </div>
    </form>
  );
};

export default FoundForm;
