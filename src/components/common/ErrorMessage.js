import React from 'react';
import './ErrorMessage.css';

/**
 * Reusable error message component.
 * Displays an error icon, title, message, and an optional retry button.
 *
 * Props:
 * - message: string (error message text)
 * - onRetry: function (optional callback to retry an action)
 * - title: string (optional, defaults to 'Oops! Something went wrong')
 * - showIcon: boolean (optional, whether to show the error icon, default true)
 */
const ErrorMessage = ({ 
  message, 
  onRetry, 
  title = 'Oops! Something went wrong',
  showIcon = true 
}) => {
  return (
    <div className="error-message-container">
      {/* Optional error icon */}
      {showIcon && (
        <div className="error-icon">
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
      )}

      {/* Error title */}
      <h2 className="error-title">{title}</h2>

      {/* Error message text */}
      <p className="error-text">{message}</p>

      {/* Retry button if onRetry callback is provided */}
      {onRetry && (
        <button className="retry-button" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
