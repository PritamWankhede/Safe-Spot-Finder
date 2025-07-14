import React, { useEffect, useRef, useState } from 'react';

const LazyLoadTips = () => {
  const [visible, setVisible] = useState(false);
  const tipsRef = useRef(null);

  const tips = [
    "🔒 Stick to well-lit streets.",
    "🚨 Avoid shortcuts or alleys.",
    "📤 Share your trip live.",
    "👀 Stay alert to surroundings.",
  ];

  useEffect(() => {
    const currentRef = tipsRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );

    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div ref={tipsRef} className="bg-green-50 p-4 rounded shadow mb-5">
      <h2 className="text-xl font-bold text-green-700 mb-2">✅ Safety Tips</h2>
      {visible ? (
        <ul className="list-disc list-inside">
          {tips.map((tip, idx) => (
            <li key={idx} className="mb-1">{tip}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Scroll to reveal tips...</p>
      )}
    </div>
  );
};

export default LazyLoadTips;