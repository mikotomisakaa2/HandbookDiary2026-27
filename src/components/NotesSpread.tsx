import React from 'react';
import { Plus } from 'lucide-react';
import { HighlightStroke, PageItem } from '../types/diary';
import { PageCanvasOverlay } from './PageCanvasOverlay';
import { HighlighterLayer } from './HighlighterLayer';

interface NotesSpreadProps {
  monthKey: string;
  monthName: string;
  year: number;
  noteSpreadOffset: number;
  totalNoteSpreads: number;
  leftNoteText: string;
  rightNoteText: string;
  leftPageId: string;
  rightPageId: string;
  leftItems: PageItem[];
  rightItems: PageItem[];
  leftHighlights: HighlightStroke[];
  rightHighlights: HighlightStroke[];
  isHighlightMode: boolean;
  highlighterColor: string;
  onAddHighlight: (pageId: string, stroke: HighlightStroke) => void;
  onChangeNote: (notePageIndex: number, text: string) => void;
  onAddTwoPages: () => void;
  onUpdateItem: (pageId: string, item: PageItem) => void;
  onDeleteItem: (pageId: string, itemId: string) => void;
  onSelectPageForAdd: (pageId: string) => void;
  selectedPageForAdd: string;
}

export const NotesSpread: React.FC<NotesSpreadProps> = ({
  monthName,
  year,
  noteSpreadOffset,
  totalNoteSpreads,
  leftNoteText,
  rightNoteText,
  leftPageId,
  rightPageId,
  leftItems,
  rightItems,
  leftHighlights,
  rightHighlights,
  isHighlightMode,
  highlighterColor,
  onAddHighlight,
  onChangeNote,
  onAddTwoPages,
  onUpdateItem,
  onDeleteItem,
  onSelectPageForAdd,
  selectedPageForAdd,
}) => {
  const leftNoteIdx = noteSpreadOffset * 2;
  const rightNoteIdx = noteSpreadOffset * 2 + 1;
  const leftPhysicalPage = 5 + leftNoteIdx;
  const rightPhysicalPage = 5 + rightNoteIdx;
  const isLastNotesSpread = noteSpreadOffset === totalNoteSpreads - 1;

  return (
    <>
      <div
        className={`diary-page diary-page-left notes-blank-page ${
          selectedPageForAdd === leftPageId ? 'page-active-target' : ''
        }`}
        onClick={() => onSelectPageForAdd(leftPageId)}
      >
        <div className="notes-page-header">
          <span>
            {monthName} {year} · Notes
          </span>
          <span className="notes-page-num">Page {leftPhysicalPage}</span>
        </div>

        <textarea
          className="notes-blank-textarea"
          value={leftNoteText}
          onChange={(e) => onChangeNote(leftNoteIdx, e.target.value)}
          placeholder=""
          aria-label={`${monthName} notes page ${leftPhysicalPage}`}
        />

        <HighlighterLayer
          pageId={leftPageId}
          strokes={leftHighlights}
          isHighlightMode={isHighlightMode}
          highlighterColor={highlighterColor}
          onAddStroke={onAddHighlight}
        />

        <PageCanvasOverlay
          pageId={leftPageId}
          items={leftItems}
          onUpdateItem={onUpdateItem}
          onDeleteItem={onDeleteItem}
        />

        <div className="page-footer-bar">
          <span>Page {leftPhysicalPage}</span>
          <span>Blank if unfilled</span>
        </div>
      </div>

      <div
        className={`diary-page diary-page-right notes-blank-page ${
          selectedPageForAdd === rightPageId ? 'page-active-target' : ''
        }`}
        onClick={() => onSelectPageForAdd(rightPageId)}
      >
        <div className="notes-page-header">
          <span>
            {monthName} {year} · Notes
          </span>
          <span className="notes-page-num">Page {rightPhysicalPage}</span>
        </div>

        <textarea
          className="notes-blank-textarea"
          value={rightNoteText}
          onChange={(e) => onChangeNote(rightNoteIdx, e.target.value)}
          placeholder=""
          aria-label={`${monthName} notes page ${rightPhysicalPage}`}
        />

        <HighlighterLayer
          pageId={rightPageId}
          strokes={rightHighlights}
          isHighlightMode={isHighlightMode}
          highlighterColor={highlighterColor}
          onAddStroke={onAddHighlight}
        />

        <PageCanvasOverlay
          pageId={rightPageId}
          items={rightItems}
          onUpdateItem={onUpdateItem}
          onDeleteItem={onDeleteItem}
        />

        <div className="page-footer-bar">
          <span>Page {rightPhysicalPage}</span>
          {isLastNotesSpread ? (
            <button
              type="button"
              className="add-two-pages-btn"
              onClick={(e) => {
                e.stopPropagation();
                onAddTwoPages();
              }}
            >
              <Plus size={14} /> Add 2 More Pages
            </button>
          ) : (
            <span>Blank if unfilled</span>
          )}
        </div>
      </div>
    </>
  );
};
