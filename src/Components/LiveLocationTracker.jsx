import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
};

const LiveLocationTracker = () => {
  const [location, setLocation] = useState({});
  const [address, setAddress] = useState('Fetching...');
  const [error, setError] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [retryRequested, setRetryRequested] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyB-dcKKb1acMX3QHM7t-Nk0ff-7X1aeNAM',
  });

  const startTracking = () => {
    if ('geolocation' in navigator) {
      const watcher = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          fetchAddress(latitude, longitude);
          generateShareLink(latitude, longitude);
          setError('');
        },
        (err) => {
          console.error('Geolocation error:', err);
          switch (err.code) {
            case 1:
              setError('❌ Permission denied. Please allow location access.');
              break;
            case 2:
              setError('❌ Position unavailable. Try again later.');
              break;
            case 3:
              setError('❌ Timeout while fetching location.');
              break;
            default:
              setError('❌ Unknown error occurred while accessing location.');
          }
        },
        { enableHighAccuracy: true }
      );

      return () => {
        navigator.geolocation.clearWatch(watcher);
      };
    } else {
      setError('❌ Geolocation is not supported by your browser.');
    }
  };

  useEffect(() => {
    startTracking();
  }, [retryRequested]);

  const fetchAddress = async (lat, lng) => {
    try {
      const res = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=abf2852787c94bb0880bb588d35d0cf6`
      );
      const result = res.data.results[0];
      if (result) {
        setAddress(result.formatted);
      } else {
        setAddress('⚠️ No address found.');
      }
    } catch (err) {
      console.error('❌ Address fetch error:', err);
      setAddress('❌ Unable to fetch address.');
    }
  };

  const generateShareLink = (lat, lng) => {
    const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
    setShareUrl(mapsLink);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleWhatsAppShare = () => {
    const message = `📍 Here's my live location:\n${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loadError) return <p className="text-red-600">Error loading Google Maps</p>;
  if (!isLoaded) return <p className="text-blue-600">Loading Google Maps...</p>;

  return (
    <div className="bg-white/30 backdrop-blur-md p-6 rounded-xl shadow-xl border border-gray-300 max-w-md mx-auto text-center mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📍 Live Location Tracker</h2>

      {error ? (
        <>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={() => setRetryRequested(!retryRequested)}
            className="mt-3 px-4 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
          >
            🔁 Retry Location
          </button>
        </>
      ) : location.latitude && location.longitude ? (
        <>
          <p className="text-sm text-gray-700">
            <strong>Latitude:</strong> {location.latitude.toFixed(5)}<br />
            <strong>Longitude:</strong> {location.longitude.toFixed(5)}
          </p>

          <p className="mt-2 text-sm text-green-800">
            <strong>Nearby Address:</strong> {address}
          </p>

          <div className="mt-4 mb-4 rounded overflow-hidden shadow-md" style={{ height: '300px' }}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{ lat: location.latitude, lng: location.longitude }}
              zoom={16}
              options={{ streetViewControl: false, fullscreenControl: false }}
            >
              <Marker position={{ lat: location.latitude, lng: location.longitude }} />
            </GoogleMap>
          </div>

          <div className="mt-4 space-y-2">
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              🌍 View in Google Maps
            </a>

            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
              >
                {copied ? '✅ Copied!' : '📋 Copy Link'}
              </button>

              <button
                onClick={handleWhatsAppShare}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                🟢 Share on WhatsApp
              </button>

              <button
                onClick={() => setShowQR(!showQR)}
                className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
              >
                {showQR ? '❌ Hide QR' : '📱 Show QR Code'}
              </button>
            </div>
          </div>

          {showQR && (
            <div className="mt-4 flex justify-center">
              <QRCodeSVG value={shareUrl} size={130} />
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-blue-600">📡 Fetching location...</p>
      )}
    </div>
  );
};

export default LiveLocationTracker;
