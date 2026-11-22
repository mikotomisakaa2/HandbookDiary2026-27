import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookMarked,
  BookOpen,
  Camera,
  ChevronLeft,
  ChevronRight,
  Download,
  Eraser,
  Highlighter,
  Link2,
  PenTool,
  Plus,
  Sparkles,
  Sticker,
  StickyNote,
  Upload,
} from 'lucide-react';
import {
  ActiveSection,
  BookEntry,
  DiaryState,
  HighlightStroke,
  MonthData,
  PageItem,
  PenFontId,
} from './types/diary';
import { ALL_MONTH_KEYS, parseMonthKey } from './data/seasons';
import {
  createDefaultMonth,
  createDemoSeedState,
  loadDiaryState,
  saveDiaryState,
} from './utils/storage';
import { SeasonScene3D } from './components/SeasonScene3D';
import { BookCover } from './components/BookCover';
import { SpiralRings } from './components/SpiralRings';
import { LinedMonthPage } from './components/LinedMonthPage';
import { HabitTrackerSpread } from './components/HabitTrackerSpread';
import { NotesSpread } from './components/NotesSpread';
import { BookshelfSpread } from './components/BookshelfSpread';
import { MemoriesMilestonesSpread } from './components/MemoriesMilestonesSpread';
import { ModalKind, ToolboxModals } from './components/ToolboxModals';

const PEN_COLORS = [
  { id: 'espresso', label: 'Espresso Ink', hex: '#2c1e16' },
  { id: 'fountain', label: 'Fountain Blue', hex: '#1d4477' },
  { id: 'burgundy', label: 'Burgundy', hex: '#7c2432' },
  { id: 'forest', label: 'Forest Green', hex: '#24523b' },
  { id: 'terracotta', label: 'Terracotta', hex: '#9e4724' },
  { id: 'plum', label: 'Plum Ink', hex: '#5a2d6b' },
];

const HIGHLIGHTER_COLORS = [
  { id: 'sun', label: 'Sunshine Yellow', hex: '#ffe45e' },
  { id: 'pink', label: 'Blush Pink', hex: '#ff9ebb' },
  { id: 'mint', label: 'Mint Green', hex: '#8ce99a' },
  { id: 'sky', label: 'Sky Blue', hex: '#74c0fc' },
  { id: 'peach', label: 'Warm Peach', hex: '#ffbe76' },
];

const PEN_FONT_STACKS: Record<PenFontId, string> = {
  caveat: "'Caveat', 'Patrick Hand', cursive",
  patrick: "'Patrick Hand', 'Caveat', cursive",
  indie: "'Indie Flower', 'Caveat', cursive",
  shadows: "'Shadows Into Light', 'Caveat', cursive",
};

export default function App() {
  const [state, setState] = useState<DiaryState>(() => loadDiaryState());
  const [activeModal, setActiveModal] = useState<ModalKind>(null);
  const [selectedPageId, setSelectedPageId] = useState<string>('2026-11-p1');
  const [pageTurnAnim, setPageTurnAnim] = useState<'none' | 'next' | 'prev'>('none');
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const [highlighterColor, setHighlighterColor] = useState(HIGHLIGHTER_COLORS[0].hex);

  useEffect(() => {
    saveDiaryState(state);
  }, [state]);

  useEffect(() => {
    const title = state.diaryTitle?.trim() || 'Handbook Diary';
    document.title = state.ownerName?.trim()
      ? `${title} — ${state.ownerName.trim()}`
      : `${title} 2026–27`;
  }, [state.diaryTitle, state.ownerName]);

  const monthInfo = useMemo(
    () => parseMonthKey(state.activeMonthKey),
    [state.activeMonthKey]
  );

  const monthData: MonthData = useMemo(() => {
    return (
      state.months[state.activeMonthKey] ||
      createDefaultMonth(state.activeMonthKey)
    );
  }, [state.months, state.activeMonthKey]);

  const notesSpreadsCount = Math.max(0, monthData.notesSpreadsCount || 0);
  const totalSpreadsInMonth = 2 + notesSpreadsCount;
  const startDayLabel = `${monthData.startDay || 1} ${monthInfo.shortName} ${monthInfo.year}`;

  const currentSpreadPageIds = useMemo(() => {
    const mk = state.activeMonthKey;
    if (state.activeSpreadIndex === 0) return [`${mk}-p1`, `${mk}-p2`];
    if (state.activeSpreadIndex === 1) return [`${mk}-p3`, `${mk}-p4`];
    const nOff = state.activeSpreadIndex - 2;
    return [`${mk}-n${nOff * 2}`, `${mk}-n${nOff * 2 + 1}`];
  }, [state.activeMonthKey, state.activeSpreadIndex]);

  useEffect(() => {
    if (!currentSpreadPageIds.includes(selectedPageId)) {
      setSelectedPageId(currentSpreadPageIds[0]);
    }
  }, [currentSpreadPageIds, selectedPageId]);

  const triggerTurn = (dir: 'next' | 'prev') => {
    setPageTurnAnim(dir);
    window.setTimeout(() => setPageTurnAnim('none'), 340);
  };

  const updateCurrentMonth = (patch: Partial<MonthData>) => {
    setState((prev) => {
      const existing =
        prev.months[prev.activeMonthKey] ||
        createDefaultMonth(prev.activeMonthKey);
      return {
        ...prev,
        months: {
          ...prev.months,
          [prev.activeMonthKey]: { ...existing, ...patch },
        },
      };
    });
  };

  const handleAddHighlight = (pageId: string, stroke: HighlightStroke) => {
    setState((prev) => ({
      ...prev,
      highlights: {
        ...prev.highlights,
        [pageId]: [...(prev.highlights[pageId] || []), stroke],
      },
    }));
  };

  const handleClearPageHighlights = () => {
    setState((prev) => ({
      ...prev,
      highlights: {
        ...prev.highlights,
        [selectedPageId]: [],
      },
    }));
  };

  const handleAddItemToPage = (item: PageItem) => {
    const targetId =
      state.activeSection === 'month'
        ? selectedPageId
        : `${state.activeMonthKey}-p1`;
    setState((prev) => ({
      ...prev,
      pageItems: {
        ...prev.pageItems,
        [targetId]: [...(prev.pageItems[targetId] || []), item],
      },
    }));
  };

  const handleUpdateItem = (pageId: string, updated: PageItem) => {
    setState((prev) => ({
      ...prev,
      pageItems: {
        ...prev.pageItems,
        [pageId]: (prev.pageItems[pageId] || []).map((it) =>
          it.id === updated.id ? updated : it
        ),
      },
    }));
  };

  const handleDeleteItem = (pageId: string, itemId: string) => {
    setState((prev) => ({
      ...prev,
      pageItems: {
        ...prev.pageItems,
        [pageId]: (prev.pageItems[pageId] || []).filter(
          (it) => it.id !== itemId
        ),
      },
    }));
  };

  const handleAddBook = (book: BookEntry) => {
    setState((prev) => ({ ...prev, books: [...prev.books, book] }));
  };

  const handleUpdateBook = (book: BookEntry) => {
    setState((prev) => ({
      ...prev,
      books: prev.books.map((b) => (b.id === book.id ? book : b)),
    }));
  };

  const handleDeleteBook = (id: string) => {
    setState((prev) => ({
      ...prev,
      books: prev.books.filter((b) => b.id !== id),
    }));
  };

  const switchMonth = (monthKey: string) => {
    triggerTurn('next');
    setState((prev) => ({
      ...prev,
      activeSection: 'month',
      activeMonthKey: monthKey,
      activeSpreadIndex: 0,
      months: prev.months[monthKey]
        ? prev.months
        : { ...prev.months, [monthKey]: createDefaultMonth(monthKey) },
    }));
  };

  const goPrevSpread = () => {
    if (state.activeSection !== 'month') {
      setState((prev) => ({ ...prev, activeSection: 'month' }));
      return;
    }
    if (state.activeSpreadIndex > 0) {
      triggerTurn('prev');
      setState((prev) => ({
        ...prev,
        activeSpreadIndex: prev.activeSpreadIndex - 1,
      }));
    } else {
      const idx = ALL_MONTH_KEYS.indexOf(state.activeMonthKey);
      if (idx > 0) {
        const prevKey = ALL_MONTH_KEYS[idx - 1];
        triggerTurn('prev');
        setState((prev) => ({
          ...prev,
          activeMonthKey: prevKey,
          activeSpreadIndex: 1,
          months: prev.months[prevKey]
            ? prev.months
            : { ...prev.months, [prevKey]: createDefaultMonth(prevKey) },
        }));
      }
    }
  };

  const goNextSpread = () => {
    if (state.activeSection !== 'month') {
      setState((prev) => ({ ...prev, activeSection: 'month' }));
      return;
    }
    if (state.activeSpreadIndex < totalSpreadsInMonth - 1) {
      triggerTurn('next');
      setState((prev) => ({
        ...prev,
        activeSpreadIndex: prev.activeSpreadIndex + 1,
      }));
    } else {
      const idx = ALL_MONTH_KEYS.indexOf(state.activeMonthKey);
      if (idx >= 0 && idx < ALL_MONTH_KEYS.length - 1) {
        switchMonth(ALL_MONTH_KEYS[idx + 1]);
      }
    }
  };

  const handleAddTwoNotePages = () => {
    const nextCount = notesSpreadsCount + 1;
    updateCurrentMonth({ notesSpreadsCount: nextCount });
    triggerTurn('next');
    setState((prev) => ({
      ...prev,
      activeSection: 'month',
      activeSpreadIndex: 2 + nextCount - 1,
    }));
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `handbook-diary-${state.activeMonthKey}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as DiaryState;
        if (parsed && parsed.months) {
          setState(parsed);
        }
      } catch {
        alert('Invalid diary backup file.');
      }
    };
    reader.readAsText(file);
  };

  const spreadLabel = (() => {
    if (state.activeSection === 'bookshelf') return 'Wooden Bookshelf';
    if (state.activeSection === 'memories') return 'Cafes, Movies, Videos & Clicks';
    if (state.activeSection === 'milestones') return 'Milestones Earned';
    if (state.activeSpreadIndex === 0) return 'Pages 1–2 · Monthly Lined';
    if (state.activeSpreadIndex === 1) return 'Pages 3–4 · Schedule Table & Column Graph';
    const nOff = state.activeSpreadIndex - 2;
    return `Pages ${5 + nOff * 2}–${6 + nOff * 2} · Notes`;
  })();

  const targetPageLabel = (() => {
    if (state.activeSection !== 'month') {
      return `${monthInfo.monthName} Page 1`;
    }
    if (selectedPageId.endsWith('-p1')) return `${monthInfo.monthName} Page 1 (Left)`;
    if (selectedPageId.endsWith('-p2')) return `${monthInfo.monthName} Page 2 (Right)`;
    if (selectedPageId.endsWith('-p3')) return `${monthInfo.monthName} Page 3 (Left)`;
    if (selectedPageId.endsWith('-p4')) return `${monthInfo.monthName} Page 4 (Right)`;
    const match = selectedPageId.match(/-n(\d+)$/);
    if (match) {
      return `${monthInfo.monthName} Notes Page ${5 + Number(match[1])}`;
    }
    return `${monthInfo.monthName}`;
  })();

  return (
    <div
      className={`wood-desk-root season-${monthInfo.season.id}`}
      style={
        {
          '--desk-bg': monthInfo.season.deskGradient,
          '--wood-grain': monthInfo.season.woodGrainColor,
          '--paper-tint': monthInfo.season.paperTint,
          '--season-accent': monthInfo.season.accent,
          '--season-accent-soft': monthInfo.season.accentSoft,
          '--ink-color': state.penColor || monthInfo.season.inkColor,
          '--pen-font': PEN_FONT_STACKS[state.penFont || 'caveat'],
          '--ribbon-color': monthInfo.season.ribbonColor,
        } as React.CSSProperties
      }
    >
      {/* Three.js 3D Indian Seasonal Atmosphere */}
      <SeasonScene3D season={monthInfo.season.id} />

      {!state.isBookOpen ? (
        <BookCover
          diaryTitle={state.diaryTitle}
          ownerName={state.ownerName}
          season={monthInfo.season}
          activeMonthLabel={`${monthInfo.monthName} ${monthInfo.year}`}
          startDayLabel={startDayLabel}
          onChangeDiaryTitle={(title) =>
            setState((prev) => ({ ...prev, diaryTitle: title }))
          }
          onChangeOwnerName={(name) =>
            setState((prev) => ({ ...prev, ownerName: name }))
          }
          onOpenBook={() =>
            setState((prev) => ({
              ...prev,
              isBookOpen: true,
              activeSection: 'month',
              activeSpreadIndex: 1,
            }))
          }
          onLoadDemo={() => setState(createDemoSeedState())}
        />
      ) : (
        <div className="open-diary-workspace">
          {/* Top wooden desk bar */}
          <header className="desk-toolbar">
            <div className="desk-toolbar-left">
              <button
                type="button"
                className="wood-chip-btn"
                onClick={() =>
                  setState((prev) => ({ ...prev, isBookOpen: false }))
                }
                title="Close Diary Cover"
              >
                <BookOpen size={15} /> {state.diaryTitle?.trim() || 'Cover'}
              </button>

              <select
                className="month-picker-select"
                value={state.activeMonthKey}
                onChange={(e) => switchMonth(e.target.value)}
                aria-label="Select Month"
              >
                {ALL_MONTH_KEYS.map((mk) => {
                  const info = parseMonthKey(mk);
                  return (
                    <option key={mk} value={mk}>
                      {info.season.ambientEmoji} {info.monthName} {info.year} ({info.daysInMonth}d)
                    </option>
                  );
                })}
              </select>

              <span className="season-status-badge">
                {monthInfo.season.ambientEmoji} {monthInfo.season.name} ·{' '}
                {monthInfo.season.indianName} (3D)
              </span>
            </div>

            {/* Creative Pinterest tools */}
            <div className="desk-toolbar-center">
              <button
                type="button"
                className="tool-chip-btn"
                onClick={() => setActiveModal('sticker')}
              >
                <Sticker size={14} /> Sticker
              </button>
              <button
                type="button"
                className="tool-chip-btn"
                onClick={() => setActiveModal('sticky')}
              >
                <StickyNote size={14} /> Sticky
              </button>
              <button
                type="button"
                className="tool-chip-btn"
                onClick={() => setActiveModal('link')}
              >
                <Link2 size={14} /> Link
              </button>
              <button
                type="button"
                className="tool-chip-btn"
                onClick={() => setActiveModal('photo')}
              >
                <Camera size={14} /> Photo/Video
              </button>
              <button
                type="button"
                className="tool-chip-btn"
                onClick={() => setActiveModal('milestone')}
              >
                <Award size={14} /> Milestone
              </button>
            </div>

            <div className="desk-toolbar-right">
              <button
                type="button"
                className="wood-chip-btn"
                onClick={() => setState(createDemoSeedState())}
                title="Load sample inspiration into November 2026"
              >
                <Sparkles size={14} /> Sample
              </button>
              <button
                type="button"
                className="wood-chip-btn"
                onClick={handleExportJson}
                title="Backup diary as JSON"
              >
                <Download size={14} />
              </button>
              <label className="wood-chip-btn" title="Restore diary from JSON">
                <Upload size={14} />
                <input
                  type="file"
                  accept="application/json"
                  onChange={handleImportJson}
                  hidden
                />
              </label>
            </div>
          </header>

          {/* Spread Navigation Ribbon */}
          <div className="spread-subnav">
            <button
              type="button"
              className="page-turn-btn"
              onClick={goPrevSpread}
            >
              <ChevronLeft size={16} /> Prev Pages
            </button>

            <div className="spread-tabs-row">
              <button
                type="button"
                className={
                  state.activeSection === 'month' && state.activeSpreadIndex === 0
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setState((p) => ({
                    ...p,
                    activeSection: 'month',
                    activeSpreadIndex: 0,
                  }))
                }
              >
                Pages 1–2 (Lines)
              </button>
              <button
                type="button"
                className={
                  state.activeSection === 'month' && state.activeSpreadIndex === 1
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setState((p) => ({
                    ...p,
                    activeSection: 'month',
                    activeSpreadIndex: 1,
                  }))
                }
              >
                Pages 3–4 (Schedule &amp; Graph)
              </button>
              {Array.from({ length: notesSpreadsCount }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={
                    state.activeSection === 'month' &&
                    state.activeSpreadIndex === 2 + idx
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setState((p) => ({
                      ...p,
                      activeSection: 'month',
                      activeSpreadIndex: 2 + idx,
                    }))
                  }
                >
                  Notes {5 + idx * 2}–{6 + idx * 2}
                </button>
              ))}
              <button
                type="button"
                className="add-spread-tab-btn"
                onClick={handleAddTwoNotePages}
                title="Add 2 extra blank pages to this month"
              >
                <Plus size={14} /> Add 2 Pages
              </button>
            </div>

            <button
              type="button"
              className="page-turn-btn"
              onClick={goNextSpread}
            >
              Next Pages <ChevronRight size={16} />
            </button>
          </div>

          {/* OPEN REALISTIC BOOK SHELL */}
          <main className="book-stage">
            <div
              className={`open-book-frame ${
                pageTurnAnim !== 'none' ? `turn-${pageTurnAnim}` : ''
              }`}
            >
              <div
                className="open-book-ribbon"
                style={{ backgroundColor: monthInfo.season.ribbonColor }}
              />

              <div className="book-paper-stack">
                {state.activeSection === 'month' && state.activeSpreadIndex === 0 && (
                  <>
                    <LinedMonthPage
                      pageId={`${state.activeMonthKey}-p1`}
                      side="left"
                      pageNumberLabel="Page 1 · Monthly Log"
                      monthName={monthInfo.monthName}
                      year={monthInfo.year}
                      daysInMonth={monthInfo.daysInMonth}
                      headerTitle="Monthly Highlights & Plans"
                      lines={monthData.page1Lines}
                      onChangeLine={(day, value) =>
                        updateCurrentMonth({
                          page1Lines: { ...monthData.page1Lines, [day]: value },
                        })
                      }
                      items={state.pageItems[`${state.activeMonthKey}-p1`] || []}
                      highlights={
                        state.highlights[`${state.activeMonthKey}-p1`] || []
                      }
                      isHighlightMode={isHighlightMode}
                      highlighterColor={highlighterColor}
                      onAddHighlight={handleAddHighlight}
                      onUpdateItem={handleUpdateItem}
                      onDeleteItem={handleDeleteItem}
                      onSelectPageForAdd={setSelectedPageId}
                      isSelectedForAdd={
                        selectedPageId === `${state.activeMonthKey}-p1`
                      }
                    />
                    <LinedMonthPage
                      pageId={`${state.activeMonthKey}-p2`}
                      side="right"
                      pageNumberLabel="Page 2 · Moments & Links"
                      monthName={monthInfo.monthName}
                      year={monthInfo.year}
                      daysInMonth={monthInfo.daysInMonth}
                      headerTitle="Stickers, Photos & Reflections"
                      lines={monthData.page2Lines}
                      onChangeLine={(day, value) =>
                        updateCurrentMonth({
                          page2Lines: { ...monthData.page2Lines, [day]: value },
                        })
                      }
                      items={state.pageItems[`${state.activeMonthKey}-p2`] || []}
                      highlights={
                        state.highlights[`${state.activeMonthKey}-p2`] || []
                      }
                      isHighlightMode={isHighlightMode}
                      highlighterColor={highlighterColor}
                      onAddHighlight={handleAddHighlight}
                      onUpdateItem={handleUpdateItem}
                      onDeleteItem={handleDeleteItem}
                      onSelectPageForAdd={setSelectedPageId}
                      isSelectedForAdd={
                        selectedPageId === `${state.activeMonthKey}-p2`
                      }
                    />
                  </>
                )}

                {state.activeSection === 'month' && state.activeSpreadIndex === 1 && (
                  <HabitTrackerSpread
                    monthData={monthData}
                    monthName={monthInfo.monthName}
                    year={monthInfo.year}
                    daysInMonth={monthInfo.daysInMonth}
                    accentColor={monthInfo.season.accent}
                    page3Id={`${state.activeMonthKey}-p3`}
                    page4Id={`${state.activeMonthKey}-p4`}
                    page3Items={
                      state.pageItems[`${state.activeMonthKey}-p3`] || []
                    }
                    page4Items={
                      state.pageItems[`${state.activeMonthKey}-p4`] || []
                    }
                    page3Highlights={
                      state.highlights[`${state.activeMonthKey}-p3`] || []
                    }
                    page4Highlights={
                      state.highlights[`${state.activeMonthKey}-p4`] || []
                    }
                    isHighlightMode={isHighlightMode}
                    highlighterColor={highlighterColor}
                    onAddHighlight={handleAddHighlight}
                    onUpdateMonth={updateCurrentMonth}
                    onUpdateItem={handleUpdateItem}
                    onDeleteItem={handleDeleteItem}
                    onSelectPageForAdd={setSelectedPageId}
                    selectedPageForAdd={selectedPageId}
                  />
                )}

                {state.activeSection === 'month' &&
                  state.activeSpreadIndex >= 2 &&
                  notesSpreadsCount > 0 && (
                  <NotesSpread
                    monthKey={state.activeMonthKey}
                    monthName={monthInfo.monthName}
                    year={monthInfo.year}
                    noteSpreadOffset={state.activeSpreadIndex - 2}
                    totalNoteSpreads={notesSpreadsCount}
                    leftNoteText={
                      monthData.notesContent[(state.activeSpreadIndex - 2) * 2] ||
                      ''
                    }
                    rightNoteText={
                      monthData.notesContent[
                        (state.activeSpreadIndex - 2) * 2 + 1
                      ] || ''
                    }
                    leftPageId={`${state.activeMonthKey}-n${(state.activeSpreadIndex - 2) * 2}`}
                    rightPageId={`${state.activeMonthKey}-n${(state.activeSpreadIndex - 2) * 2 + 1}`}
                    leftItems={
                      state.pageItems[
                        `${state.activeMonthKey}-n${(state.activeSpreadIndex - 2) * 2}`
                      ] || []
                    }
                    rightItems={
                      state.pageItems[
                        `${state.activeMonthKey}-n${(state.activeSpreadIndex - 2) * 2 + 1}`
                      ] || []
                    }
                    leftHighlights={
                      state.highlights[
                        `${state.activeMonthKey}-n${(state.activeSpreadIndex - 2) * 2}`
                      ] || []
                    }
                    rightHighlights={
                      state.highlights[
                        `${state.activeMonthKey}-n${(state.activeSpreadIndex - 2) * 2 + 1}`
                      ] || []
                    }
                    isHighlightMode={isHighlightMode}
                    highlighterColor={highlighterColor}
                    onAddHighlight={handleAddHighlight}
                    onChangeNote={(idx, text) =>
                      updateCurrentMonth({
                        notesContent: {
                          ...monthData.notesContent,
                          [idx]: text,
                        },
                      })
                    }
                    onAddTwoPages={handleAddTwoNotePages}
                    onUpdateItem={handleUpdateItem}
                    onDeleteItem={handleDeleteItem}
                    onSelectPageForAdd={setSelectedPageId}
                    selectedPageForAdd={selectedPageId}
                  />
                )}

                {state.activeSection === 'bookshelf' && (
                  <BookshelfSpread
                    books={state.books}
                    onAddBook={handleAddBook}
                    onUpdateBook={handleUpdateBook}
                    onDeleteBook={handleDeleteBook}
                  />
                )}

                {(state.activeSection === 'memories' ||
                  state.activeSection === 'milestones') && (
                  <MemoriesMilestonesSpread
                    mode={state.activeSection}
                    pageItems={state.pageItems}
                    onOpenAddPhoto={() => setActiveModal('photo')}
                    onOpenAddMilestone={() => setActiveModal('milestone')}
                    onDeleteItem={handleDeleteItem}
                    onUpdateItem={handleUpdateItem}
                  />
                )}

                <SpiralRings count={15} />
              </div>

              {/* Right-side colorful index tabs sticking out of the book */}
              <nav className="book-side-tabs" aria-label="Diary Sections">
                {(
                  [
                    {
                      id: 'month',
                      label: monthInfo.shortName,
                      icon: <BookOpen size={13} />,
                    },
                    {
                      id: 'bookshelf',
                      label: 'Books',
                      icon: <BookMarked size={13} />,
                    },
                    {
                      id: 'memories',
                      label: 'Media',
                      icon: <Camera size={13} />,
                    },
                    {
                      id: 'milestones',
                      label: 'Wins',
                      icon: <Award size={13} />,
                    },
                  ] as { id: ActiveSection; label: string; icon: React.ReactNode }[]
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`side-index-tab tab-${tab.id} ${
                      state.activeSection === tab.id ? 'is-active' : ''
                    }`}
                    onClick={() =>
                      setState((p) => ({ ...p, activeSection: tab.id }))
                    }
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </main>

          {/* Bottom Stationery Dock: Pen Ink Colors, Handwritten Fonts & Realistic Highlighter */}
          <div className="stationery-bar stationery-bar-bottom">
            <div className="stationery-group">
              <span className="stationery-label">
                <PenTool size={13} /> Pen Ink:
              </span>
              {PEN_COLORS.map((pen) => (
                <button
                  key={pen.id}
                  type="button"
                  title={pen.label}
                  className={`ink-dot ${state.penColor === pen.hex ? 'active' : ''}`}
                  style={{ backgroundColor: pen.hex }}
                  onClick={() =>
                    setState((prev) => ({ ...prev, penColor: pen.hex }))
                  }
                />
              ))}
              <select
                className="font-picker-select"
                value={state.penFont || 'caveat'}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    penFont: e.target.value as PenFontId,
                  }))
                }
                aria-label="Handwritten font"
              >
                <option value="caveat">Caveat (Handwritten)</option>
                <option value="patrick">Patrick Hand</option>
                <option value="indie">Indie Flower</option>
                <option value="shadows">Shadows Into Light</option>
              </select>
            </div>

            <div className="stationery-group">
              <button
                type="button"
                className={`highlighter-toggle-btn ${isHighlightMode ? 'active' : ''}`}
                onClick={() => setIsHighlightMode((v) => !v)}
              >
                <Highlighter size={14} />
                {isHighlightMode ? 'Highlighter ON (Drag on page)' : 'Highlighter'}
              </button>
              {HIGHLIGHTER_COLORS.map((hl) => (
                <button
                  key={hl.id}
                  type="button"
                  title={hl.label}
                  className={`hl-dot ${highlighterColor === hl.hex ? 'active' : ''}`}
                  style={{ backgroundColor: hl.hex }}
                  onClick={() => {
                    setHighlighterColor(hl.hex);
                    setIsHighlightMode(true);
                  }}
                />
              ))}
              <button
                type="button"
                className="hl-clear-btn"
                onClick={handleClearPageHighlights}
                title="Clear highlights on selected page"
              >
                <Eraser size={13} />
              </button>
            </div>
          </div>

          <footer className="desk-footer-hint">
            <span>{spreadLabel}</span>
            <span>·</span>
            <span>
              Tip: Toggle Highlighter to draw realistic marker strokes, hover
              Photos/Videos to play their attached song, or switch months to see
              Indian seasons in 3D!
            </span>
          </footer>
        </div>
      )}

      <ToolboxModals
        activeModal={activeModal}
        currentSeason={monthInfo.season.id}
        targetPageLabel={targetPageLabel}
        onClose={() => setActiveModal(null)}
        onAddItem={handleAddItemToPage}
      />
    </div>
  );
}
