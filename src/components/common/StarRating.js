import React from 'react';
import './StarRating.css';

const StarRating = ({ rating, size = 'normal', showText = false }) => {
  // Parse rating to a float; default to 0 if invalid
  const numRating = parseFloat(rating) || 0;

  // Determine number of full, half, and empty stars
  const fullStars = Math.floor(numRating); // Full stars count
  const hasHalfStar = numRating % 1 >= 0.5; // True if rating has a half star
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining empty stars

  return (
    <div className={`star-rating ${size}`}>
      <div className="stars">
        {/* Render full stars */}
        {[...Array(fullStars)].map((_, index) => (
          <span key={`full-${index}`} className="star filled">★</span>
        ))}

        {/* Render half star if applicable */}
        {hasHalfStar && <span className="star half">★</span>}

        {/* Render empty stars */}
        {[...Array(emptyStars)].map((_, index) => (
          <span key={`empty-${index}`} className="star empty">☆</span>
        ))}
      </div>

      {/* Optional text showing numeric rating */}
      {showText && (
        <span className="rating-value">{numRating.toFixed(1)} out of 5 stars</span>
      )}
    </div>
  );
};

export default StarRating;
