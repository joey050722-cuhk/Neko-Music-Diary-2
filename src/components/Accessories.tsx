import React from 'react';

interface AccessoryProps {
  className?: string;
  type: string;
}

export const Accessory: React.FC<AccessoryProps> = ({ type, className }) => {
  switch (type) {
    case 'red_scarf':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M35 68 Q 50 75 65 68 Q 70 85 55 90 L 45 90 Q 30 85 35 68" fill="#fb7185" stroke="#cc4444" />
          <path d="M40 72 L 42 85" stroke="#cc4444" strokeWidth="1" />
          <path d="M60 72 L 58 85" stroke="#cc4444" strokeWidth="1" />
          <path d="M42 75 Q 50 82 58 75" stroke="#cc4444" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="50" cy="88" r="2" fill="#fff" fillOpacity="0.3" />
        </svg>
      );
    case 'yellow_hat':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M30 45 L 70 45 Q 75 45 75 40 L 75 38 Q 50 15 25 38 L 25 40 Q 25 45 30 45" fill="#fde68a" stroke="#d97706" />
          <path d="M25 40 Q 50 48 75 40" stroke="#d97706" strokeWidth="1.5" />
          <circle cx="50" cy="22" r="4" fill="#fcd34d" stroke="#d97706" />
          <path d="M35 30 Q 50 35 65 30" stroke="#d97706" strokeWidth="0.5" strokeOpacity="0.5" />
        </svg>
      );
    case 'pink_bow':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M42 65 Q 32 55 40 70 Q 32 85 42 75 Z" fill="#f43f5e" stroke="#881337" />
          <path d="M58 65 Q 68 55 60 70 Q 68 85 58 75 Z" fill="#f43f5e" stroke="#881337" />
          <circle cx="50" cy="70" r="4" fill="#fb7185" stroke="#881337" />
          <path d="M48 70 L 45 78" stroke="#881337" strokeWidth="1" />
          <path d="M52 70 L 55 78" stroke="#881337" strokeWidth="1" />
        </svg>
      );
    case 'cool_sunglasses':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3">
          <rect x="34" y="52" width="14" height="10" rx="3" fill="#1c1917" />
          <rect x="52" y="52" width="14" height="10" rx="3" fill="#1c1917" />
          <path d="M48 57 L 52 57" stroke="#1c1917" strokeWidth="2" />
          <path d="M34 56 L 28 56" stroke="#1c1917" strokeWidth="1.5" />
          <path d="M66 56 L 72 56" stroke="#1c1917" strokeWidth="1.5" />
          <path d="M38 55 L 42 55" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
        </svg>
      );
    case 'green_leaf':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M50 40 Q 65 30 50 15 Q 35 30 50 40" fill="#6ee7b7" stroke="#059669" />
          <path d="M50 20 L 50 40" stroke="#059669" strokeWidth="1" />
          <path d="M50 25 Q 55 25 58 20" stroke="#059669" strokeWidth="1" />
          <path d="M50 32 Q 45 32 42 28" stroke="#059669" strokeWidth="1" />
        </svg>
      );
    case 'flower':
        return (
          <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
            <g transform="translate(50, 68)">
                {[0, 72, 144, 216, 288].map(deg => (
                    <ellipse key={deg} cx="0" cy="-6" rx="5" ry="8" transform={`rotate(${deg})`} fill="#fb7185" stroke="#e11d48" strokeWidth="1" />
                ))}
                <circle cx="0" cy="0" r="4" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
            </g>
          </svg>
        );
    case 'headphones':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M25 55 Q 25 25 50 25 Q 75 25 75 55" stroke="#4a044e" strokeWidth="4" />
          <rect x="18" y="48" width="16" height="20" rx="6" fill="#d946ef" stroke="#4a044e" />
          <rect x="66" y="48" width="16" height="20" rx="6" fill="#d946ef" stroke="#4a044e" />
          <path d="M22 55 L 30 55" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
          <path d="M70 55 L 78 55" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
          <circle cx="26" cy="58" r="2" fill="white" fillOpacity="0.4" />
          <circle cx="74" cy="58" r="2" fill="white" fillOpacity="0.4" />
        </svg>
      );
    case 'star_glasses':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M40 50 L 43 56 L 50 56 L 45 61 L 47 68 L 40 64 L 33 68 L 35 61 L 30 56 L 37 56 Z" fill="#fef08a" stroke="#ca8a04" />
          <path d="M60 50 L 63 56 L 70 56 L 65 61 L 67 68 L 60 64 L 53 68 L 55 61 L 50 56 L 57 56 Z" fill="#fef08a" stroke="#ca8a04" />
          <path d="M48 56 L 52 56" stroke="#ca8a04" strokeWidth="2" />
          <path d="M30 56 L 25 56" stroke="#ca8a04" strokeWidth="1.5" />
          <path d="M70 56 L 75 56" stroke="#ca8a04" strokeWidth="1.5" />
        </svg>
      );
    case 'toast':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M35 75 Q 30 75 30 70 L 30 65 Q 30 55 40 55 L 60 55 Q 70 55 70 65 L 70 70 Q 70 75 65 75 Z" fill="#fbbf24" stroke="#92400e" />
          <path d="M35 72 L 65 72 Q 67 72 67 70 L 67 65 Q 67 58 60 58 L 40 58 Q 33 58 33 65 L 33 70 Q 33 72 35 72" fill="#fef3c7" stroke="none" />
          <rect x="45" y="62" width="10" height="6" rx="1" fill="#fbbf24" fillOpacity="0.6" stroke="none" />
        </svg>
      );
    case 'bell':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M35 70 Q 50 75 65 70" stroke="#f43f5e" strokeWidth="3" />
          <circle cx="50" cy="75" r="6" fill="#fbbf24" stroke="#92400e" />
          <path d="M47 75 Q 50 78 53 75" stroke="#92400e" strokeWidth="1" />
        </svg>
      );
    default:
      return null;
  }
};
