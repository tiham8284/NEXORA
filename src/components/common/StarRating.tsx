import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({
  value = 0,
  onChange,
  readOnly = false,
  size = 'md'
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4.5 h-4.5',
    lg: 'w-6 h-6'
  };

  const activeRating = hoverRating || value;

  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
          className={`p-0.5 transition-transform ${readOnly ? 'cursor-default' : 'hover:scale-110 cursor-pointer'}`}
          aria-label={`${star} Star`}
        >
          <Star
            className={`${starSizes[size]} ${
              star <= activeRating
                ? 'fill-amber-400 text-amber-500'
                : 'fill-slate-100 text-slate-300'
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="text-xs font-semibold text-slate-700 ml-1">
          {value}.0
        </span>
      )}
    </div>
  );
};
