import React from 'react';
import './StarRating.css';

const StarRating = ({ rating, size = 'normal', showText = false }) => {
  const numRating = parseFloat(rating) || 0;
  const fullStars = Math.floor(numRating);
  const hasHalfStar = numRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`star-rating ${size}`}>
      <div className="stars">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, index) => (
          <span key={`full-${index}`} className="star filled">★</span>
        ))}

        {/* Half star */}
        {hasHalfStar && <span className="star half">★</span>}

        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, index) => (
          <span key={`empty-${index}`} className="star empty">☆</span>
        ))}
      </div>

      {showText && (
        <span className="rating-value">{numRating.toFixed(1)} out of 5 stars</span>
      )}
    </div>
  );
};

export default StarRating;