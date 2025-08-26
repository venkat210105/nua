import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading...', size = 'medium', overlay = false }) => {
  const spinnerContent = (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner-ring"></div>
      <p className="loading-message">{message}</p>
    </div>
  );

  if (overlay) {
    return (
      <div className="loading-overlay">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;