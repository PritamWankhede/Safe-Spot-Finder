import React, { useEffect, useRef, useState } from 'react';

const IdleMonitor = () => {
  const timeoutRef = useRef(null);
  const [isIdle, setIsIdle] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [networkStatus, setNetworkStatus] = useState('good');

  useEffect(() => {
    const resetTimer = () => {
      clearTimeout(timeoutRef.current);
      if (isIdle) {
        setIsIdle(false);
        alert('✅ You are now active!');
      }
      timeoutRef.current = setTimeout(() => {
        setIsIdle(true);
        alert('⚠️ You’ve been idle for 2 minutes!');
      }, 2 * 60 * 1000); 
    };

    resetTimer();
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      clearTimeout(timeoutRef.current);
    };
  }, [isIdle]);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      alert('🔴 You are offline!');
    };
    const handleOnline = () => {
      setIsOffline(false);
      alert('✅ You are back online!');
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  useEffect(() => {
    if ('connection' in navigator) {
      const conn = navigator.connection;

      const updateNetworkStatus = () => {
        const isPoor = conn.downlink < 1 || conn.rtt > 300;
        setNetworkStatus(isPoor ? 'poor' : 'good');

        if (isPoor) {
          alert('🐢 Your network is slow!');
        }
      };

      updateNetworkStatus();
      conn.addEventListener('change', updateNetworkStatus);

      return () => conn.removeEventListener('change', updateNetworkStatus);
    }
  }, []);

  return (
    <div className="bg-red-50 p-4 rounded shadow mb-5">
      <h2 className="text-xl font-bold text-red-700 mb-2">🕒 Idle & Network Monitor</h2>
      <p>
        Status:{' '}
        {isOffline
          ? 'Inactive & Offline ❌'
          : isIdle
          ? 'Inactive (Idle) ⚠️'
          : networkStatus === 'poor'
          ? 'Poor Network 🐢'
          : '✅ Active (Online)'}
      </p>
    </div>
  );
};

export default IdleMonitor;
