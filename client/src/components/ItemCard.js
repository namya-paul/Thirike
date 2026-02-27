import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiTag } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import './ItemCard.css';

function ItemCard({ item, type = 'lost' }) {
  const imageUrl = item.image
    ? `${process.env.REACT_APP_API_URL?.replace('/api', '')}/uploads/${item.image}`
    : null;

  const timeAgo = item.createdAt
    ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })
    : '';

  return (
    <Link to={`/item/${item._id}`} className="item-card">
      <div className="item-card-img">
        {imageUrl ? (
          <img src={imageUrl} alt={item.name} />
        ) : (
          <div className="item-card-placeholder">
            <span>📦</span>
          </div>
        )}
        <span className={`badge badge-${type} item-card-badge`}>
          {type === 'lost' ? '🔴 Lost' : '🟢 Found'}
        </span>
        {item.status === 'matched' && (
          <span className="badge badge-matched item-card-badge2">✅ Matched</span>
        )}
      </div>

      <div className="item-card-body">
        <h3 className="item-card-title">{item.name}</h3>

        <div className="item-card-meta">
          <span className="meta-item">
            <FiTag size={13} />
            {item.category}
          </span>
          {item.location?.address && (
            <span className="meta-item">
              <FiMapPin size={13} />
              {item.location.address.substring(0, 30)}...
            </span>
          )}
          <span className="meta-item">
            <FiClock size={13} />
            {timeAgo}
          </span>
        </div>

        {item.description && (
          <p className="item-card-desc">{item.description.substring(0, 90)}...</p>
        )}

        <div className="item-card-tags">
          {item.color && <span className="tag">{item.color}</span>}
          {item.brand && <span className="tag">{item.brand}</span>}
        </div>
      </div>
    </Link>
  );
}

export default ItemCard;
