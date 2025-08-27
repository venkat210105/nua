import React from 'react';
import './LoadingSpinner.css';

/**
 * Reusable loading spinner component.
 * Can display a spinner with a message, optional size, and optional overlay.
 *
 * Props:
 * - message: string (text displayed under the spinner, defaults to 'Loading...')
 * - size: string ('small', 'medium', 'large'; controls spinner size, default 'medium')
 * - overlay: boolean (if true, shows a full-screen overlay behind the spinner)
 */
const LoadingSpinner = ({ message = 'Loading...', size = 'medium', overlay = false }) => {
  // Spinner content including the ring animation and message
  const spinnerContent = (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner-ring"></div>
      <p className="loading-message">{message}</p>
    </div>
  );

  // If overlay is true, wrap the spinner in a semi-transparent overlay
  if (overlay) {
    return (
      <div className="loading-overlay">
        {spinnerContent}
      </div>
    );
  }

  // Otherwise, just return the spinner itself
  return spinnerContent;
};

export default LoadingSpinner;
