import React from 'react';

const BouncingDots = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="bouncing-dots">
        <div className="dot dot-1"></div>
        <div className="dot dot-2"></div>
        <div className="dot dot-3"></div>
      </div>
      <p className="text-gray-600 animate-pulse">Processing sequences...</p>
    </div>
  );
};

export default BouncingDots; 