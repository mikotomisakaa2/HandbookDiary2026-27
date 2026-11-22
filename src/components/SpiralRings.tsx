import React from 'react';

interface SpiralRingsProps {
  count?: number;
}

export const SpiralRings: React.FC<SpiralRingsProps> = ({ count = 15 }) => {
  return (
    <div className="spiral-spine" aria-hidden="true">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="spiral-ring-unit">
          <span className="ring-hole ring-hole-left" />
          <span className="ring-wire" />
          <span className="ring-hole ring-hole-right" />
        </div>
      ))}
    </div>
  );
};
