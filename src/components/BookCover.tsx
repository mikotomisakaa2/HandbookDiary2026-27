import React, { useState } from 'react';
import { IndianSeasonTheme } from '../data/seasons';

interface BookCoverProps {
  diaryTitle: string;
  ownerName: string;
  season: IndianSeasonTheme;
  activeMonthLabel: string;
  startDayLabel: string;
  onChangeDiaryTitle: (title: string) => void;
  onChangeOwnerName: (name: string) => void;
  onOpenBook: () => void;
  onLoadDemo: () => void;
}

export const BookCover: React.FC<BookCoverProps> = ({
  diaryTitle,
  ownerName,
  season,
  activeMonthLabel,
  startDayLabel,
  onChangeDiaryTitle,
  onChangeOwnerName,
  onOpenBook,
  onLoadDemo,
}) => {
  const [openingMode, setOpeningMode] = useState<'idle' | 'open' | 'demo'>('idle');

  const triggerHumanBookOpen = (mode: 'open' | 'demo') => {
    if (openingMode !== 'idle') return;
    setOpeningMode(mode);
    window.setTimeout(() => {
      if (mode === 'demo') {
        onLoadDemo();
      } else {
        onOpenBook();
      }
    }, 780);
  };

  return (
    <div className="cover-stage">
      <div
        className={`book-closed-wrapper ${
          openingMode !== 'idle' ? 'is-opening-book' : ''
        }`}
      >
        {/* First inner paper page revealed underneath as the front cover lifts */}
        <div className="cover-under-page" aria-hidden="true">
          <div className="under-page-header">
            Month : {activeMonthLabel}
          </div>
          <div className="under-page-start-badge">
            Opening from {startDayLabel}…
          </div>
          <div className="under-page-lines">
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} className="under-page-line" />
            ))}
          </div>
        </div>

        {/* Stacked realistic paper edges on right side of closed book */}
        <div className="closed-book-pages-edge" />

        {/* Ribbons hanging from bottom */}
        <div
          className="closed-book-ribbon"
          style={{ backgroundColor: season.ribbonColor }}
        />

        {/* Front leather cover that swings open on its left spine hinge */}
        <div
          className="closed-book-cover"
          style={{ background: season.coverGradient }}
        >
          {/* Left spine groove */}
          <div className="cover-spine-groove" />

          {/* Brass corners */}
          <span className="brass-corner top-right" />
          <span className="brass-corner bottom-right" />

          {/* Wooden inlay plaque */}
          <div className="cover-plaque">
            <div className="cover-season-pill">
              <span>{season.ambientEmoji}</span>
              <span>
                {season.name} · {season.indianName}
              </span>
            </div>

            <label className="cover-field-label" htmlFor="cover-journal-title">
              Name your journal ✎
            </label>
            <input
              id="cover-journal-title"
              type="text"
              className="cover-title-input"
              value={diaryTitle}
              onChange={(e) => onChangeDiaryTitle(e.target.value)}
              aria-label="Handbook Journal Name"
              placeholder="Handbook Diary"
            />
            <div className="cover-years">2026 — 2027</div>

            <div className="cover-divider" />

            <label className="cover-field-label" htmlFor="cover-owner-name">
              This handbook belongs to
            </label>
            <input
              id="cover-owner-name"
              type="text"
              className="cover-owner-input"
              value={ownerName}
              onChange={(e) => onChangeOwnerName(e.target.value)}
              aria-label="Diary Owner Name"
              placeholder="Write your name here..."
            />

            <p className="cover-quote">
              “You are confirming the person you&apos;re becoming.”
            </p>
          </div>

          {/* Elastic band */}
          <div className="cover-elastic-band" />

          {/* Open buttons */}
          <div className="cover-actions">
            <button
              type="button"
              className="open-diary-btn"
              onClick={() => triggerHumanBookOpen('open')}
            >
              Open from {startDayLabel} →
            </button>
            <button
              type="button"
              className="demo-diary-btn"
              onClick={() => triggerHumanBookOpen('demo')}
            >
              Open with Sample Inspiration ✨
            </button>
          </div>
        </div>
      </div>

      <p className="cover-desk-caption">
        {season.tagline} · Lift the cover to open your diary from {startDayLabel}
      </p>
    </div>
  );
};
