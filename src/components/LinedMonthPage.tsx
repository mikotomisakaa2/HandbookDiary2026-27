import React from 'react';
import { HighlightStroke, PageItem } from '../types/diary';
import { PageCanvasOverlay } from './PageCanvasOverlay';
import { HighlighterLayer } from './HighlighterLayer';

interface LinedMonthPageProps {
  pageId: string;
  side: 'left' | 'right';
  pageNumberLabel: string;
  monthName: string;
  year: number;
  daysInMonth: number;
  headerTitle: string;
  subtitle?: string;
  editableHeader?: boolean;
  onChangeMotto?: (val: string) => void;
  onChangeSubtitle?: (val: string) => void;
  lines: Record<number, string>;
  onChangeLine: (day: number, value: string) => void;
  items: PageItem[];
  highlights: HighlightStroke[];
  isHighlightMode: boolean;
  highlighterColor: string;
  onAddHighlight: (pageId: string, stroke: HighlightStroke) => void;
  onUpdateItem: (pageId: string, item: PageItem) => void;
  onDeleteItem: (pageId: string, itemId: string) => void;
  onSelectPageForAdd: (pageId: string) => void;
  isSelectedForAdd: boolean;
}

export const LinedMonthPage: React.FC<LinedMonthPageProps> = ({
  pageId,
  side,
  pageNumberLabel,
  monthName,
  year,
  daysInMonth,
  headerTitle,
  subtitle,
  editableHeader = false,
  onChangeMotto,
  onChangeSubtitle,
  lines,
  onChangeLine,
  items,
  highlights,
  isHighlightMode,
  highlighterColor,
  onAddHighlight,
  onUpdateItem,
  onDeleteItem,
  onSelectPageForAdd,
  isSelectedForAdd,
}) => {
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div
      className={`diary-page diary-page-${side} ${isSelectedForAdd ? 'page-active-target' : ''}`}
      onClick={() => onSelectPageForAdd(pageId)}
    >
      <div className="page-header-area">
        <div className="month-header-line">
          <span className="month-label-prefix">Month : {monthName}</span>
          {editableHeader && onChangeMotto ? (
            <input
              type="text"
              className="month-motto-input"
              value={headerTitle}
              onChange={(e) => onChangeMotto(e.target.value)}
              placeholder="New learning everyday"
            />
          ) : (
            <span className="month-header-sub">{headerTitle}</span>
          )}
          <span className="page-year-tag">{year}</span>
        </div>

        {subtitle !== undefined && (
          <div className="month-subtitle-pill-wrap">
            {editableHeader && onChangeSubtitle ? (
              <input
                type="text"
                className="month-subtitle-pill-input"
                value={subtitle}
                onChange={(e) => onChangeSubtitle(e.target.value)}
              />
            ) : (
              <span className="month-subtitle-pill">{subtitle}</span>
            )}
          </div>
        )}
      </div>

      {/* Numbered ruled lines: 1 to 28/29/30/31 */}
      <div className="numbered-lines-list">
        {days.map((day) => (
          <div key={day} className="ruled-line-row">
            <span className="ruled-day-num">{day}</span>
            <input
              type="text"
              className="ruled-line-input"
              value={lines[day] || ''}
              onChange={(e) => onChangeLine(day, e.target.value)}
              aria-label={`${monthName} day ${day}`}
            />
          </div>
        ))}
      </div>

      <HighlighterLayer
        pageId={pageId}
        strokes={highlights}
        isHighlightMode={isHighlightMode}
        highlighterColor={highlighterColor}
        onAddStroke={onAddHighlight}
      />

      <PageCanvasOverlay
        pageId={pageId}
        items={items}
        onUpdateItem={onUpdateItem}
        onDeleteItem={onDeleteItem}
      />

      <div className="page-footer-bar">
        <span>{pageNumberLabel}</span>
        <span className="page-days-hint">{daysInMonth} days</span>
      </div>
    </div>
  );
};
