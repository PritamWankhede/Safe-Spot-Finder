import React, { useEffect, useState } from 'react';

const NetworkStatusChecker = () => {
  const [connection, setConnection] = useState({});

  useEffect(() => {
    if ('connection' in navigator) {
      const conn = navigator.connection;
      setConnection({
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt,
      });

      conn.addEventListener("change", () => {
        setConnection({
          effectiveType: conn.effectiveType,
          downlink: conn.downlink,
          rtt: conn.rtt,
        });
      });
    } else {
      setConnection({ effectiveType: "unknown" });
    }
  }, []);

  const getRttLabel = (rtt) => {
    if (rtt <= 100) return '🔵 Fast';
    if (rtt <= 300) return '🟡 Medium';
    return '🔴 Slow';
  };

  return (
    <div className="bg-yellow-50 p-4 rounded shadow mb-5">
      <h2 className="text-xl font-bold text-yellow-700 mb-2">🌐 Network Info</h2>
      <p>Type: {connection.effectiveType}</p>
      <p>Speed: {connection.downlink} Mbps</p>
      <p>
        RTT: {connection.rtt} ms{' '}
        {connection.rtt !== undefined && (
          <span className="font-semibold">
            ({getRttLabel(connection.rtt)})
          </span>
        )}
      </p>
    </div>
  );
};

export default NetworkStatusChecker;
