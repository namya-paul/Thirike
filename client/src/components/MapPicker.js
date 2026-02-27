import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Circle } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function ClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

function MapPicker({ value, onChange, radius = 5 }) {
  const defaultCenter = value
    ? [value.lat, value.lng]
    : [20.5937, 78.9629]; // India center

  const handleLocationSelect = useCallback(
    async (latlng) => {
      // Reverse geocode using Nominatim (free, no API key needed)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
        );
        const data = await res.json();
        onChange({
          lat: latlng.lat,
          lng: latlng.lng,
          address: data.display_name || `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`,
        });
      } catch {
        onChange({
          lat: latlng.lat,
          lng: latlng.lng,
          address: `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`,
        });
      }
    },
    [onChange]
  );

  return (
    <div>
      <MapContainer
        center={defaultCenter}
        zoom={value ? 14 : 5}
        style={{ height: '350px', width: '100%', borderRadius: '10px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://openstreetmap.org">OpenStreetMap</a>'
        />
        <ClickHandler onLocationSelect={handleLocationSelect} />
        {value && (
          <>
            <Marker position={[value.lat, value.lng]} />
            <Circle
              center={[value.lat, value.lng]}
              radius={radius * 1000}
              pathOptions={{ color: '#2563EB', fillColor: '#2563EB', fillOpacity: 0.08 }}
            />
          </>
        )}
      </MapContainer>
      {value && (
        <div className="map-address-box">
          <span>📍</span>
          <span>{value.address}</span>
        </div>
      )}
      {!value && (
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '8px', textAlign: 'center' }}>
          Click on the map to drop a pin at the location
        </p>
      )}
    </div>
  );
}

export default MapPicker;
