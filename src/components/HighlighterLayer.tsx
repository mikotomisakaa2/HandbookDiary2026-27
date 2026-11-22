import React, { useRef, useState } from 'react';
import { HighlightPoint, HighlightStroke } from '../types/diary';

interface HighlighterLayerProps {
  pageId: string;
  strokes: HighlightStroke[];
  isHighlightMode: boolean;
  highlighterColor: string;
  onAddStroke: (pageId: string, stroke: HighlightStroke) => void;
}

export const HighlighterLayer: React.FC<HighlighterLayerProps> = ({
  pageId,
  strokes,
  isHighlightMode,
  highlighterColor,
  onAddStroke,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draftPoints, setDraftPoints] = useState<HighlightPoint[] | null>(null);

  const getRelPoint = (e: React.PointerEvent): HighlightPoint | null => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isHighlightMode) return;
    e.stopPropagation();
    const pt = getRelPoint(e);
    if (!pt) return;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    setDraftPoints([pt]);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isHighlightMode || !draftPoints) return;
    const pt = getRelPoint(e);
    if (!pt) return;
    setDraftPoints((prev) => (prev ? [...prev, pt] : [pt]));
  };

  const handlePointerUp = () => {
    if (!draftPoints || draftPoints.length < 2) {
      setDraftPoints(null);
      return;
    }
    onAddStroke(pageId, {
      id: `hl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      color: highlighterColor,
      width: 3.4,
      points: draftPoints,
    });
    setDraftPoints(null);
  };

  const toPath = (pts: HighlightPoint[]) =>
    pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(' ');

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`highlighter-svg-layer ${isHighlightMode ? 'is-drawing-active' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {strokes.map((s) => (
        <path
          key={s.id}
          d={toPath(s.points)}
          fill="none"
          stroke={s.color}
          strokeWidth={s.width}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.42}
        />
      ))}

      {draftPoints && draftPoints.length > 1 && (
        <path
          d={toPath(draftPoints)}
          fill="none"
          stroke={highlighterColor}
          strokeWidth={3.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.48}
        />
      )}
    </svg>
  );
};
